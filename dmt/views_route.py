
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView, FormView, View
from django.core.urlresolvers import reverse_lazy
from datetime import datetime, date
from collections import Counter, OrderedDict
from django.db.models import Sum, Min, Count
from django.utils import dateformat
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template.loader import get_template
from django.template import Context
import json

from .forms_route import RouteFilterForm, RouteForm, RouteEditForm, CreateRouteForm
from customer.models import Route, Ip, User, get_default_route
from customer.decorators import dmt_user_required
from stats.memory import memstat
from stats.models import UserDaily, STAT_KEYS


class RouteActivityView(View):
    form_class = RouteFilterForm
    success_url = reverse_lazy('dmt:filter')
    template_name = 'activity/activity.html'

    @dmt_user_required
    def dispatch(self, *args, **kwargs):
        return super(RouteActivityView, self).dispatch(*args, **kwargs)

    def _get_initial(self):
        start = date.today()
        end = date.today()

        return {
            'start': dateformat.format(start, 'Y-m-d'),
            'end': dateformat.format(end, 'Y-m-d'),
            'delivered_min': 0,
            'delivered_max': 100,
            'bounced_min': 0,
            'bounced_max': 100,
            'opened_min': 0,
            'opened_max': 100,
            'clicked_min': 0,
            'clicked_max': 100,
            'yahoo_min': 0,
            'yahoo_max': 100,
            'aol_min': 0,
            'aol_max': 100,
            'hotmail_min': 0,
            'hotmail_max': 100,
            'comcast_min': 0,
            'comcast_max': 100,
            'other_min': 0,
            'other_max': 100,
        }

    def get(self, request, *args, **kwargs):
        data = request.GET.copy()

        start = data.get('start'); end = data.get('end')

        form = self.form_class(request.GET.copy())

        if start and end:
            form.is_valid(); data = form.cleaned_data
            start = data.get('start'); end = data.get('end')

            if start > date.today():
                start = date.today()
            if end > date.today():
                end = date.today()
            if start > end:
                start = end

            routes = self.combined_data(
                start=start,
                end=end,
            )

            for key in ('delivered', 'bounced', 'opened', 'clicked', 'complained', 'yahoo', 'aol', 'hotmail', 'comcast', 'other'):
                self.add_percent(routes, key)

            self.filter_search(routes, 'name', data.get('route'))

            data_list = {
                'delivered': 'delivered',
                'bounced': 'bounced',
                'opened': 'opened',
                'clicked': 'clicked',
                'yahoo': 'yahoo',
                'aol': 'aol',
                'hotmail': 'hotmail',
                'comcast': 'comcast',
                'other': 'other',
            }

            for key, value in data_list.items():

                if '{0}_min'.format(key) in data:
                    self.filter_number(routes, '{0}_perc'.format(value),
                        data.get('{0}_min'.format(key)), 'gt')

                if '{0}_max'.format(key) in data:
                    self.filter_number(routes, '{0}_perc'.format(value),
                        data.get('{0}_max'.format(key)), 'lt')

            for key, route in routes.items():
                routes[key]['ip_count'] = Ip.objects.filter(route=key).count()

                routes[key].update(
                    self.get_route_users(key))

            if request.field.strip('-') == 'CSV':

                template = get_template('activity/csv-template.csv')
                context = Context({'routes': routes})
                result = template.render(context=context)

                response = HttpResponse(content=result, content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename="pools_filtered.csv"'

                return response

            else:
                routes = self.sorting(routes=routes, field_name=request.field, direction=request.direction)

            return render(request, self.template_name, {
                'form': form, 'routes': routes})

        else:
            form = self.form_class(initial=self._get_initial())

            routes = self.combined_data(
                start=date.today(),
                end=date.today(),
            )

            for key in ('delivered', 'bounced', 'opened', 'clicked', 'complained'):
                self.add_percent(routes, key)

            for key, route in routes.items():
                routes[key]['ip_count'] = Ip.objects.filter(route=key).count()

                routes[key].update(
                    self.get_route_users(key))

            return render(request, self.template_name, {
                'form': form, 'routes': routes})

    def get_route_users(self, route):
        return User.objects.filter(route_id=route).aggregate(
            user_count=Count('email', distinct=True),
            user_email=Min('email'),
        )

    def redis_data(self):
        routes = {}

        for daily in memstat.redis.scan_iter('user:dd:*'):
            try:
                user_id, route_id, cmpid, redis_provider = daily.split(':')[2:]
            except ValueError:
                continue

            try:
                cmpid = int(cmpid)
            except ValueError:
                continue

            stat = memstat.general_stat_user_daily(
                data=dict.fromkeys(STAT_KEYS, 0), user_id=user_id, route_id=route_id, date=datetime.now(), cmpid=cmpid, provider=redis_provider)

            key = int(route_id)

            if key in routes:
                counter = Counter(routes[key])
                counter.update(stat)
                routes[key] = dict(counter)
            else:
                routes[key] = stat
        return routes

    def db_data(self, start=None, end=None):
        routes = {}

        query = UserDaily.objects.all().values('route_id', 'provider')

        if start is not None:
            query = query.filter(date__gte=start)

        if end is not None:
            query = query.filter(date__lte=end)

        keys = {}
        for key in STAT_KEYS:
            keys[key] = Sum(key)

        query = query.annotate(**keys)

        for route in query:
            try:
                key = int(route.pop('route_id'))
            except TypeError:
                key = get_default_route()

            provider = route.pop('provider')

            if key in routes:
                counter = Counter(routes[key])
                counter.update(route)
                routes[key] = dict(counter)
            else:
                routes[key] = route

            try:
                routes[key][provider] += route['complained']
            except KeyError:
                routes[key][provider] = route['complained']

        return routes

    def combined_data(self, start, end):
        db_dict = {}; redis_dict = {}

        if start < date.today():
            db_dict = self.db_data(start=start, end=end)

        if end >= date.today():
            redis_dict = self.redis_data()

        routes = db_dict.copy()
        for key, data in redis_dict.items():

            if key in routes:
                counter = Counter(routes[key])
                counter.update(data)
                routes[key] = dict(counter)
            else:
                routes[key] = data

        names = dict((x.pk, x.name) for x in
            Route.objects.filter(pk__in=routes.keys()))

        for key in routes:
            routes[key]['name'] = names.get(key)

        return routes

    def filter_number(self, routes, field, value, rule):

        for key, route in routes.items():
            try:

                if rule == 'gt' and value > route[field]:
                    routes.pop(key)

                if value != 100 and rule == 'lt' and value < route[field]:
                    routes.pop(key)

            except KeyError:
                pass

    def filter_search(self, routes, field, value):
        for key, route in routes.items():
            if value.lower() not in route[field]:
                routes.pop(key)

    def add_percent(self, routes, field):
        for key, route in routes.items():
            if routes[key]['queued'] == 0:
                routes[key]['{}_perc'.format(field)] = 0
            else:
                try:
                    perc = routes[key][field] * 100 / routes[key]['queued']
                    routes[key]['{}_perc'.format(field)] = perc
                except KeyError:
                    routes[key][field] = 0
                    routes[key]['{}_perc'.format(field)] = 0

    def sorting(self, routes, field_name, direction):

        reverse = False
        if field_name == '-' and direction == "desc":
            return routes
        elif direction == "desc" and len(field_name) > 1:
            field_name = field_name.strip('-')
            reverse = True

        temp_list = []
        for key, values in routes.items():

            temp_list.append(values.get(field_name, 0))

        temp_list.sort(reverse=reverse)

        routes_new = OrderedDict()

        while True:
            if len(routes) == 0: break

            for key, values in routes.items():

                if values[field_name] == temp_list[0]:
                    routes_new.update({key: routes.pop(key, 0)})
                    temp_list.pop(0)

        return routes_new


class RouteView(FormView):
    template_name = 'route/route.html'
    form_class = RouteForm

    def get(self, request, *args, **kwargs):
        data = request.GET.copy()

        query = data.get('q')

        form = self.form_class(request.GET.copy())

        if query:
            form.is_valid(); data = form.cleaned_data

            query = data.get('q')

            return render(request, self.template_name,
                {'routes': Route.objects.filter(name__icontains=query)})

        else:
            return super(RouteView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(RouteView, self).get_context_data(**kwargs)
        context['routes'] = Route.objects.all()
        return context


class RouteCreateView(CreateView):
    template_name = 'activity/modal/route_create.html'
    form_class = CreateRouteForm

    def get(self, request, *args, **kwargs):
        form = self.form_class(request.GET)

        if form.is_valid():
            name = form.cleaned_data.get('name')
            mta = request.GET.get('mta')

            if name and mta:
                route, create = Route.objects.get_or_create(
                    name=name, mta_id=mta)

                return HttpResponse(json.dumps({'pk': route.pk}),
                    content_type='application/json')

        return super(RouteCreateView, self).get(self, request, *args, **kwargs)


class RouteEditView(UpdateView):
    template_name = 'activity/modal/route_edit.html'
    form_class = RouteEditForm
    model = Route
    success_url = reverse_lazy('dmt:route-activity')

    def get_context_data(self, **kwargs):
        context = super(RouteEditView, self).get_context_data(**kwargs)
        route_id = int(self.kwargs.get('pk'))
        context['ip_list'] = Ip.objects.filter(route_id=self.kwargs.get('pk'))
        context['user_list'] = User.objects.filter(route_id=self.kwargs.get('pk'))
        context['remove'] = True if route_id != get_default_route() else False
        context['pk'] = route_id
        return context


class RouteRemoveView(DeleteView):
    model = Route
    success_url = reverse_lazy('dmt:route-activity')

    def post(self, request, *args, **kwargs):
        pk = int(self.kwargs.get('pk'))

        if pk != get_default_route():
            ips = Ip.objects.filter(route_id=pk)

            for ip in ips:
                ip_in_other_route = Ip.objects.filter(addr=ip.addr).exclude(route_id=pk)

                if len(ip_in_other_route) > 0:
                    ip.delete()
                else:
                    ip.route_id = None
                    ip.save()

            User.objects.filter(route_id=pk, is_active=True).update(route_id=get_default_route())
            Route.objects.get(pk=pk).delete()

            return redirect(to=reverse_lazy('dmt:route'), permanent=True)

        return redirect(to=reverse_lazy('dmt:route-edit', kwargs={'pk': pk}), permanent=True)


class ListsRefreshView(TemplateView):
    template_name = 'activity/load/lists_refresh.html'

    def get_context_data(self, **kwargs):
        context = super(ListsRefreshView, self).get_context_data(**kwargs)
        route_id = int(self.kwargs.get('pk'))
        context['pk'] = route_id
        context['route_name'] = Route.objects.values_list('name', flat=True).get(pk=route_id)
        context['ip_list'] = Ip.objects.filter(route_id=route_id)
        context['user_list'] = User.objects.filter(route_id=route_id)
        context['remove'] = True if route_id != get_default_route() else False
        return context

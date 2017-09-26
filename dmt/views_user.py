
from logging import getLogger
import json
from django.core.urlresolvers import reverse, reverse_lazy
from django.views.generic import View, FormView, UpdateView
from django.http import HttpResponse
from django.db.utils import OperationalError
from .forms_user import UserForm, UserEditForm
from customer.models import User, get_default_route
from django.shortcuts import render

dmt_log = getLogger('dmt')


class SuggestUserView(View):

    def get(self, request, *args, **kwargs):
        email = self.request.GET.get('email')
        email = email.encode('utf8')

        try:
            users = User.objects.filter(
                email__icontains=email,
                is_active=True).exclude(route_id=self.kwargs['pk'])

            list_emails = [{'pk': email_dict.pk, 'email': email_dict.email}
                for email_dict in users]

        except OperationalError:
            list_emails = []

        return HttpResponse(json.dumps(list_emails),
            content_type='application/json')


class UserAddView(View):
    template_name = 'modal/user_edit.html'

    def get(self, request, *args, **kwargs):
        user_id = self.request.GET.get('pk', False)
        route_id = self.kwargs.get('pk')

        if user_id:
            try:
                user = User.objects.exclude(
                    route_id=route_id).get(
                    pk=user_id, is_active=True)

            except User.DoesNotExist:
                return HttpResponse(json.dumps({'error': 1, 'message': 'user does not found'}),
                    content_type='application/json')

            dmt_log.info('user: {0} has been transfer from route_id: {1}, to route_id: {2} by user: {3}'.format(
                user.email, user.route_id, route_id, self.request.user.email))

            User.objects.filter(pk=user.pk).update(route_id=route_id)

            return HttpResponse(json.dumps({'error': 0, 'message': user.pk}),
                content_type='application/json')

        return render(request, self.template_name, {'pk': route_id})


class UserStatusChangeView(View):

    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(pk=self.request.GET.get('pk'))

        except User.DoesNotExist:
            return HttpResponse(json.dumps({'error': 1, 'message': 'user does not found'}),
                content_type='application/json')

        dmt_log.info('user: {0} has been change status from: {1} by user: {2}'.format(
            user.email, user.is_active, self.request.user.email))

        is_active = True
        if user.is_active:
            is_active = False

        User.objects.filter(pk=user.pk).update(
            is_active=is_active)

        return HttpResponse(json.dumps({'error': 0}),
            content_type='application/json')


class UserRemoveView(View):

    def get(self, request, *args, **kwargs):
        user_id = self.request.GET.get('pk')

        try:
            user = User.objects.get(pk=user_id,
                route_id=self.kwargs.get('pk'))

        except User.DoesNotExist:
            return HttpResponse(json.dumps({'error': 1, 'message': 'user does not found'}),
                content_type='application/json')

        dmt_log.info('user: {0} has been remove from route_id: {1} by user: {2}'.format(
            user.email, user.route_id, self.request.user.email))

        User.objects.filter(pk=user.pk).update(
            route_id=get_default_route())

        return HttpResponse(json.dumps({'error': 0}),
            content_type='application/json')


class UserView(FormView):
    template_name = 'user/user.html'
    form_class = UserForm

    def get(self, request, *args, **kwargs):
        data = request.GET.copy()

        query = data.get('q')

        form = self.form_class(request.GET.copy())

        if query:
            form.is_valid(); data = form.cleaned_data

            query = data.get('q')

            return render(request, self.template_name,
                {'users': User.objects.filter(email__icontains=query)})

        else:
            return super(UserView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(UserView, self).get_context_data(**kwargs)
        context['users'] = User.objects.all()
        return context


class UserEditView(UpdateView):
    model = User
    form_class = UserEditForm
    success_url = reverse_lazy('dmt:user')
    template_name = 'user/edit.html'

    def get_context_data(self, **kwargs):
        context = super(UserEditView, self).get_context_data(**kwargs)
        context['pk'] = self.kwargs['pk']
        return context

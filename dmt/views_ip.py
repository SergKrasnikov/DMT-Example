
from datetime import datetime
import json
from logging import getLogger
from django.db.utils import OperationalError
from django.views.generic import View
from django.core.validators import validate_ipv46_address
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.shortcuts import render
from customer.models import Route, Ip, get_default_route

dmt_log = getLogger('dmt')


class SuggestIpView(View):

    def get(self, request, *args, **kwargs):
        addr = self.request.GET.get('addr')

        try:
            if addr == '*':
                addrs = Ip.objects.filter(route__isnull=True)

            else:
                addrs = Ip.objects.filter(
                    addr__icontains=addr, route__isnull=True)

            list_addrs = [{'pk': addr.pk, 'addr': addr.addr}
                for addr in addrs]

        except OperationalError:
            list_addrs = []

        return HttpResponse(json.dumps(list_addrs),
            content_type='application/json')


class IpAddView(View):
    template_name = 'modal/ip_edit.html'

    def get(self, request, *args, **kwargs):
        addr = self.request.GET.get('addr', False)

        if addr:
            error = self.ip_add_to_route(addr=addr)
            if error:
                return HttpResponse(json.dumps(error),
                    content_type='application/json')

        return render(request, self.template_name, {'pk': self.kwargs['pk']})

    def ip_add_to_route(self, addr):
        addrs = []
        if addr.find('-') > 0:
            begin_addr, end_ip = addr.strip().split('-')
            begin_addr = begin_addr.strip().split('.')

            try:
                begin_ip = int(begin_addr[3].strip())
                end_ip = int(end_ip.strip())

                if begin_ip < 1 or end_ip > 254:
                    dmt_log.info('IP range {0} - is not valid;'.format(addr))
                    return {'error': 1, 'message': 'IP range is not valid '}

            except ValueError:
                dmt_log.info('IP range {0} - is not valid;'.format(addr))
                return {'error': 1, 'message': 'IP range is not valid '}

            for ip in range(begin_ip, end_ip+1):
                addrs.append('.'.join(
                    [begin_addr[0].strip(), begin_addr[1].strip(), begin_addr[2].strip(), str(ip)]))

        elif addr.find(',') > 0:
            addrs_strip = addr.strip().split(',')

            for ip in addrs_strip:
                if ip != '':
                    addrs.append(ip)

        else:
            addrs.append(addr)

        return self.add_addrs(addrs=addrs)

    def add_addrs(self, addrs):
        message = ''; error = 0; ip_in_route = {}; route_id = self.kwargs['pk']

        for ip_addr in addrs:
            try:
                validate_ipv46_address(ip_addr)
            except ValidationError, e:
                error += 1; message += str(e)
                continue

            try:
                ip = Ip.objects.get(addr=ip_addr, route_id=route_id)

                error += 1
                message += 'Ip address: {0} present in this: {1} route; '.format(ip_addr, ip.route.name)
                dmt_log.info('Ip address: {0} present in this: {1} route.'.format(ip_addr, ip.route.name))
                continue

            except Ip.DoesNotExist:
                ip_in_other_route = Ip.objects.filter(addr=ip_addr, route_id__isnull=False)

                if len(ip_in_other_route) == 0:
                    try:
                        ip = Ip.objects.get(addr=ip_addr, route_id__isnull=True)

                    except Ip.DoesNotExist:
                        ip = Ip(addr=ip_addr, created=datetime.now())

                else:
                    if self.request.GET.get('confirm', False) == 'true':
                        ip = Ip(addr=ip_addr, created=datetime.now())
                        dmt_log.info('Add Ip address: {0} to route: {1} present in route: {2} by user: {3}'.format(
                            ip_addr, route_id, ip_in_other_route[0].route_id, self.request.user.email))

                    else:
                        ip_in_route.update({ip_in_other_route[0].route_id: {'addr': ip_in_other_route[0].addr,
                            'route': ip_in_other_route[0].route.name}})
                        continue

            ip.route_id = route_id

            ip.reverse = ip.resolve()
            ip.last_reverse_check = datetime.now()

            if not ip.reverse:
                error += 1
                message += 'Reverse resolve absent from ip address: {0}; '.format(ip_addr)
                dmt_log.info('Reverse resolve absent from ip address: {0};'.format(ip_addr))
                continue

            ip.save()
            route = Route.objects.get(pk=ip.route_id)

            dmt_log.info('ip: {0} has been added to route: {1}, route_id: {2} by user: {3}'.format(
                ip.addr, route.name, route.pk, self.request.user.email))

        return {'error': error, 'message': message, 'ip_in_route': False if len(ip_in_route) == 0 else ip_in_route}


class IpRouteExcludeView(View):

    def get(self, request, *args, **kwargs):
        addr = self.request.GET.get('ip').lower()
        route_id = self.kwargs.get('pk')

        ips = Ip.objects.filter(addr=addr,
            route_id=route_id)
        if len(ips) == 0:
            dmt_log.info('ip: {0} address not found in route_id: {1}'.format(
                addr, route_id))
            return HttpResponse(json.dumps({'error': 1,
                'message': 'ip address not found'}),
                content_type='application/json')

        elif len(ips) == 1:
            ip = ips[0]

        elif len(ips) > 1:
            for i in range(1, len(ips)):
                ips[i].delete()
            ip = ips[0]

        dmt_log.info('ip: {0} has been excluded from route: {1}, route_id: {2} by user: {3}'.format(
            ip.addr, ip.route.name, ip.route.pk, self.request.user.email))

        ip_in_other_route = Ip.objects.filter(addr=addr).exclude(route_id=route_id)

        if len(ip_in_other_route) > 0:
            ip.delete()

        else:
            ip.route_id = None
            ip.save()

        return HttpResponse(json.dumps({'error': 0}), 
            content_type='application/json')


class IpRemoveView(View):

    def get(self, request, *args, **kwargs):
        addr = self.request.GET.get('ip').lower()

        try:
            ip = Ip.objects.get(addr=addr,
                route_id__isnull=True)
        except Ip.DoesNotExist:
            return HttpResponse(json.dumps({'error': 1,
                'message': 'ip address not found'}),
                content_type='application/json')

        dmt_log.info('ip: {0} has been delete by user: {1}'.format(
            ip.addr, self.request.user.email))

        ip.delete()

        return HttpResponse(json.dumps({'error': 0}),
            content_type='application/json')

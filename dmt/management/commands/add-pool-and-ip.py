from django.core.management.base import BaseCommand
from django.template import loader, Context
from customer.models import Ip, Route, User
from config.settings import PMTA_CONF_DIR
from django.contrib.auth.hashers import make_password
from collections import defaultdict
from datetime import datetime
import os


class Command(BaseCommand):

    def handle(self, *args, **options):
        ip_string = '78.30.1.116 78.30.1.13 78.30.1.130 78.30.1.154 78.30.1.169 78.30.1.173 78.30.1.174 78.30.1.188 78.30.1.198 78.30.1.226 78.30.1.247 78.30.1.249 78.30.1.27 78.30.1.36 78.30.1.53 78.30.1.74 78.30.1.79 78.30.1.80 78.30.1.9 78.30.1.95 78.30.4.10 78.30.4.106 78.30.4.118 78.30.4.151 78.30.4.152 78.30.4.158 78.30.4.164 78.30.4.17 78.30.4.193 78.30.4.200 78.30.4.202 78.30.4.205 78.30.4.226 78.30.4.233 78.30.4.235 78.30.4.237 78.30.4.27 78.30.4.56 78.30.4.77 78.30.4.91 78.30.8.112 78.30.8.119 78.30.8.129 78.30.8.140 78.30.8.158 78.30.8.172 78.30.8.177 78.30.8.191 78.30.8.200 78.30.8.208 78.30.8.220 78.30.8.234 78.30.8.253 78.30.8.31 78.30.8.37 78.30.8.40 78.30.8.57 78.30.8.67 78.30.8.97 78.30.8.99'

        ips = ip_string.split(' ')

        for addr in ips:
            aaa_flag = False
            print addr
            #ip = Ip(addr=addr, route=route, check_reverse=datetime.now())
            try:
                ip = Ip.objects.get(addr=addr)
            except Ip.DoesNotExist:
                print 'ip not exist'
                aaa_flag = True
                ip = Ip(addr=addr)
            else:
                print 'ip exist', addr
                if not ip.route_id:
                    print 'ip exist empty'
                    aaa_flag = True
                else:
                    continue
            if aaa_flag:
                print 'Flag----------------------------'
                route = Route.objects.create(name='warming-pool-{0}'.format(addr), mta_host='62.212.73.22', mta_port=2525)
                ip.route_id=route.pk
                ip.check_reverse=datetime.now()
                ip.reverse = ip.resolve()
                ip.save()
                user = User.objects.create(
                    email='{0}@dcapi.net'.format(route.name),
                    password=make_password(None),
                    route=route,
                    parent_id=270,
                    dkim_domain_verified=1,
                    check_from_header=0)
            print user, user.email

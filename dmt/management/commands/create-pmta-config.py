
from django.core.management.base import BaseCommand
from django.template import loader, Context
from customer.models import Route, User
from config.settings import PMTA_CONF_DIR
from collections import defaultdict
from shutil import rmtree
import os


class Command(BaseCommand):

    def create_conf(self, name, items):
        t = loader.get_template(os.path.join('pmta-config', '{0}.tmpl'.format(name)))
        return t.render(Context({'items': items}))

    def handle(self, *args, **options):
        routes = defaultdict(list)

        for route in Route.objects.all():
            if route.mta.mta_host not in routes:
                routes[route.mta.mta_host] = []

            if route.ip_list.filter(route=route, reverse__isnull=False).count():
                routes[route.mta.mta_host].append(route)

        for box in routes.keys():
            tmp_boxdir = os.path.join(PMTA_CONF_DIR, '_{0}'.format(box))

            if not os.path.exists(tmp_boxdir):
                os.makedirs(tmp_boxdir)

            if not os.path.exists(os.path.join(tmp_boxdir, 'domainkeys')):
                os.makedirs(os.path.join(tmp_boxdir, 'domainkeys'))

            for tmpl in ('vmta', 'pool', 'dkim'):
                with open(os.path.join(tmp_boxdir, '{0}.conf'.format(tmpl)), 'w') as f:
                    f.write(self.create_conf(tmpl, routes[box]))

            for user in User.objects.filter(route__mta__mta_host=box,
                private_key__isnull=False, public_key__isnull=False, 
                dkim_domain__isnull=False):

                with open(os.path.join(tmp_boxdir, 'domainkeys',
                    '{0}.private'.format(user.dkim_domain)), 'wb') as f:
                        f.write(user.private_key)

                with open(os.path.join(tmp_boxdir, 'domainkeys',
                    '{0}.public'.format(user.dkim_domain)), 'wb') as f:
                        f.write(user.public_key)

            boxdir = os.path.join(PMTA_CONF_DIR, box)
            try:
                rmtree(boxdir)
            except OSError:
                pass
            os.rename(tmp_boxdir, boxdir)

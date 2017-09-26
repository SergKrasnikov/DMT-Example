
from socket import gethostbyaddr, herror
from django.core.management.base import BaseCommand
from django.db.models import Q
from datetime import datetime, timedelta
from customer.models import Ip


class Command(BaseCommand):

    def handle(self, *args, **options):
        time_to_check = datetime.now() - timedelta(minutes=30)

        try:
            ip_addrs = Ip.objects.filter(
            Q(last_reverse_check__lt=time_to_check) | Q(last_reverse_check__isnull=True), check_reverse=True)
        except Ip.DoesNotExist:
            ip_addrs = []

        for ip in ip_addrs:
            ip.reverse = ip.resolve()
            ip.last_reverse_check = datetime.now()
            ip.created = datetime.now()
            ip.save()

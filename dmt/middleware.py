
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth.middleware import AuthenticationMiddleware


class DmtSessionMiddleware(SessionMiddleware):
    def process_request(self, request):
        if request.path_info[0:5] != '/api/':
            super(DmtSessionMiddleware, self).process_request(request)

    def process_response(self, request, response):
        if request.path_info[0:5] != '/api/':
            super(DmtSessionMiddleware, self).process_response(request, response)
        return response


class DmtAuthenticationMiddleware(AuthenticationMiddleware):
    def process_request(self, request):
        if request.path_info[0:5] != '/api/':
            super(DmtAuthenticationMiddleware, self).process_request(request)


def get_field(self):
    try:
        field = self.GET['sort']
    except (KeyError, ValueError, TypeError):
        field = ''
    return (self.direction == 'desc' and '-' or '') + field


def get_direction(self):
    try:
        return self.GET['dir']
    except (KeyError, ValueError, TypeError):
        return 'desc'


class SortingMiddleware(object):
    """
    Inserts a variable representing the field (with direction of sorting) onto
    the request object if it exists in **GET** portions of the request.
    """

    def process_request(self, request):
        request.__class__.field = property(get_field)
        request.__class__.direction = property(get_direction)

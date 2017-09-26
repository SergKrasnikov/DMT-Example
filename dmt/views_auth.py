
from django.views.generic import FormView
from django.core.urlresolvers import reverse_lazy
from .forms_auth import AuthApiKeyForm


class LoginView(FormView):
    form_class = AuthApiKeyForm
    success_url = reverse_lazy('dmt:route-activity')
    template_name = 'login/login.html'

    def get_form_kwargs(self):
        kwargs = super(LoginView, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

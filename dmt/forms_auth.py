
from django.forms import Form, UUIDField, ValidationError
from django.contrib.auth import authenticate
from django.contrib.auth import login


class AuthApiKeyForm(Form):
    apikey = UUIDField(label='Apikey', help_text='Enter you apikey as username')

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request')
        super(AuthApiKeyForm, self).__init__(*args, **kwargs)

    def clean(self):
        data = self.cleaned_data

        user = authenticate(key=data.get('apikey'))

        if not user:
            raise ValidationError('invalid api key')

        if not user.is_staff or user.dmt_user < 1:
            raise ValidationError('permission denied')

        login(self.request, user)
        return data

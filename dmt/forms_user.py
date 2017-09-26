
from django import forms
from customer.models import User


class UserForm(forms.Form):
    q = forms.CharField(required=False)


class UserEditForm(forms.ModelForm):

    class Meta(object):
        model = User
        exclude = ['password', 'last_login', 'is_superuser', 'date_joined', 'groups', 'user_permissions']

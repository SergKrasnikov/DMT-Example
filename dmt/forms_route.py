
from django import forms
from customer.models import Mta, Route


class RouteFilterForm(forms.Form):
    route = forms.CharField(required=False)
    start = forms.DateField(required=False)
    end = forms.DateField(required=False)
    delivered_min = forms.IntegerField(required=False)
    delivered_max = forms.IntegerField(required=False)
    bounced_min = forms.IntegerField(required=False)
    bounced_max = forms.IntegerField(required=False)
    clicked_min = forms.IntegerField(required=False)
    clicked_max = forms.IntegerField(required=False)
    opened_min = forms.IntegerField(required=False)
    opened_max = forms.IntegerField(required=False)
    yahoo_min = forms.IntegerField(required=False)
    yahoo_max = forms.IntegerField(required=False)
    aol_min = forms.IntegerField(required=False)
    aol_max = forms.IntegerField(required=False)
    hotmail_min = forms.IntegerField(required=False)
    hotmail_max = forms.IntegerField(required=False)
    comcast_min = forms.IntegerField(required=False)
    comcast_max = forms.IntegerField(required=False)
    other_min = forms.IntegerField(required=False)
    other_max = forms.IntegerField(required=False)


class RouteForm(forms.Form):
    q = forms.CharField(required=False)


class RouteEditForm(forms.ModelForm):

    class Meta(object):
        exclude = ['is_default']
        model = Route


class CreateRouteForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(CreateRouteForm, self).__init__(*args, **kwargs)
        self.fields['mta'].label_from_instance = lambda obj: "%s" % obj.name

    class Meta(object):
        model = Route
        fields = ['name', 'mta']

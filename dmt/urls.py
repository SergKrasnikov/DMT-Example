
from django.conf.urls import url
from django.contrib.auth.views import logout_then_login
from django.core.urlresolvers import reverse_lazy
from django.views.generic import UpdateView
from customer.models import User
from . import views_auth, views_route, views_ip, views_user, forms_user

urlpatterns = [
    url(r'^login/$', views_auth.LoginView.as_view(), name='login'),
    url(r'^logout/$', logout_then_login, {'login_url': reverse_lazy('dmt:login')}, name='logout'),
    url(r'^route/$', views_route.RouteView.as_view(), name='route'),

    url(r'^route/activity/$', views_route.RouteActivityView.as_view(), name='route-activity'),

    url(r'^route/create/$', views_route.RouteCreateView.as_view(), name='route-create'),
    url(r'^route/(?P<pk>\d+)/edit/$', views_route.RouteEditView.as_view(), name='route-edit'),
    url(r'^route/(?P<pk>\d+)/remove/$', views_route.RouteRemoveView.as_view(), name='route-remove'),

    url(r'^ip/suggest/$', views_ip.SuggestIpView.as_view(), name='sug-ip'),
    url(r'^user/suggest/(?P<pk>\d+)/$', views_user.SuggestUserView.as_view(), name='sug-user'),

    url(r'^route/(?P<pk>\d+)/refresh/$', views_route.ListsRefreshView.as_view(), name='lists-refresh'),

    url(r'^route/(?P<pk>\d+)/ip/add/$', views_ip.IpAddView.as_view(), name='ip-add'),
    url(r'^route/(?P<pk>\d+)/ip/exclude/$', views_ip.IpRouteExcludeView.as_view(), name='ip-exclude'),
    url(r'^route/ip/remove/$', views_ip.IpRemoveView.as_view(), name='ip-remove'),

    url(r'^user/$', views_user.UserView.as_view(), name='user'),
    url(r'^user/(?P<pk>\d+)/edit/$', views_user.UserEditView.as_view(), name='user-edit'),

    url(r'^route/(?P<pk>\d+)/user/add/$', views_user.UserAddView.as_view(), name='user-add'),
    url(r'^route/user/status-change/$', views_user.UserStatusChangeView.as_view(), name='user-status-change'),
    url(r'^route/(?P<pk>\d+)/user/remove/$', views_user.UserRemoveView.as_view(), name='user-remove'),
]

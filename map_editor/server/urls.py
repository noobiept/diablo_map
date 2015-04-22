from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url( r'^$', 'server.views.home', name= 'home' ),

]

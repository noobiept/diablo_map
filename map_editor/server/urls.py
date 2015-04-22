from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url( r'^$', 'server.views.home', name= 'home' ),
    url( r'^save$', 'server.views.save', name= 'save' ),
    url( r'^load$', 'server.views.load', name= 'load' ),
]

from django.shortcuts import render
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt


def home( request ):

    return render( request, 'map_editor.html' )


@csrf_exempt
def save( request ):

    if request.POST:

        name = request.POST.get( 'name' )
        data = request.POST.get( 'data' )

        with open( '../map_info/{}.json'.format( name ), 'w', encoding= 'utf-8' ) as f:

            f.write( data )

        return HttpResponse()


    return HttpResponseBadRequest()


@csrf_exempt
def load( request ):

    if request.POST:

        name = request.POST.get( 'name' )

        with open( '../map_info/{}.json'.format( name ), 'r', encoding= 'utf-8' ) as f:
            data = f.read()

        return HttpResponse( data, content_type= 'application/json' )


    return HttpResponseBadRequest()
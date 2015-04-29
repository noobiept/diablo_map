from django.shortcuts import render
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt



def home( request ):

    return render( request, 'map_editor.html' )



@csrf_exempt
def save( request ):

    if not request.POST:
        return HttpResponseBadRequest( "Need to be a POST request." )

    data = request.POST.get( 'data' )

    if not data:
        return HttpResponseBadRequest( "Need a 'data' argument." )

    try:
        with open( '../map_info/info.json', 'w', encoding= 'utf-8' ) as f:

            f.write( data )

    except OSError:
        return HttpResponseBadRequest( "Failed to open the file." )

    return HttpResponse( "Saved." )



@csrf_exempt
def load( request ):

    try:
        with open( '../map_info/info.json', 'r', encoding= 'utf-8' ) as f:
            data = f.read()

    except OSError:
        return HttpResponseBadRequest( "Couldn't open the file." )

    return HttpResponse( data, content_type= 'application/json' )


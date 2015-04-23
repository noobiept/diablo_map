window.onload = function()
{
Game.init( document.body, 1000, 600 );

var manifest = [
        { id: 'act_1', path: '/static/images/act_1.jpg' },
        { id: 'cave_entrance', path: '/static/images/cave_entrance.png' },
        { id: 'cave_exit', path: '/static/images/cave_exit.png' },
        { id: 'damp_cellar', path: '/static/images/damp_cellar.jpg' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    MapEditor.init();

    var previousMap = MapEditor.getSavedFileName();

    if ( previousMap )
        {
        MapEditor.loadMap( previousMap );
        }
    });
preload.loadManifest( manifest );
};


(function(window)
{
function MapEditor()
{

}

var CONTAINER;
var FILE_NAME;  // element in the menu, which shows the current file name
var AREA_NAME;  // located at the top left of the map, shows the area name
var SCALE = 1;
var SELECTED_TYPE = null;
var MAP_INFO = {};


MapEditor.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // top level container
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


    // add the area name element
var canvas = Game.getCanvas();

AREA_NAME = new Game.Text({
        textAlign: 'end',
        color: 'white'
    });
AREA_NAME.x = canvas.getWidth();
Game.addElement( AREA_NAME );


    // set the mouse events for the movement
var mouseDown = false;
var referenceX;
var referenceY;
var canvasContainer = Game.getCanvasContainer();

canvasContainer.addEventListener( 'mousedown', function( event )
    {
    mouseDown = true;
    referenceX = event.clientX;
    referenceY = event.clientY;
    });
canvasContainer.addEventListener( 'mousemove', function( event )
    {
    if ( mouseDown )
        {
        var currentX = event.clientX;
        var currentY = event.clientY;

        moveCamera( currentX - referenceX, currentY - referenceY );

        referenceX = currentX;
        referenceY = currentY;
        }
    });
canvasContainer.addEventListener( 'mouseup', function( event )
    {
    mouseDown = false;
    });


    // add the labels on click (depending on what value is selected in the menu)
canvasContainer.addEventListener( 'mouseup', function( event )
    {
    if ( SELECTED_TYPE )
        {
        var rect = Game.getCanvas().getHtmlCanvasElement().getBoundingClientRect();

        var x = event.clientX - rect.left - CONTAINER.x;
        var y = event.clientY - rect.top - CONTAINER.y;

        var label = new Label({
                x: x / SCALE,
                y: y / SCALE,
                text: '------',
                image: SELECTED_TYPE
            });
        CONTAINER.addChild( label );
        }
    });


    // create the menu
var menu = new Game.Html.HtmlContainer();

var scale = new Game.Html.Range({
        min: 0.4,
        max: 2,
        value: 1,
        step: 0.2,
        preText: 'Scale',
        onChange: function( button )
            {
            changeScale( button.getValue() );
            }
    });

var recenter = new Game.Html.Button({
        value: 'Recenter',
        callback: reCenterCamera
    });

var selectElement = new Game.Html.MultipleOptions({
        options: [ 'none', 'cave_entrance', 'cave_exit' ],
        callback: function( button, position, htmlElement )
            {
            var id = htmlElement.innerHTML;

            if ( id === 'none' )
                {
                SELECTED_TYPE = null;
                }

            else
                {
                SELECTED_TYPE = id;
                }
            }
    });

var newMap = new Game.Html.Button({
        value: 'New Map',
        callback: startNewMap
    });

var save = new Game.Html.Button({
        value: 'Save',
        callback: saveMap
    });

var load = new Game.Html.Button({
        value: 'Load',
        callback: openLoadMessage
    });

FILE_NAME = new Game.Html.Value({ value: '' });

menu.addChild( selectElement, scale, recenter, newMap, save, load, FILE_NAME );


document.body.appendChild( menu.container );
};


MapEditor.load = function( mapInfo )
{
clear();

var image = Game.Preload.get( mapInfo.imageId );

var map = new Game.Bitmap({
        image: image
    });
CONTAINER.addChild( map );

reCenterCamera();

AREA_NAME.text = mapInfo.mapName;
FILE_NAME.setValue( mapInfo.fileName );
MAP_INFO = mapInfo;

MapEditor.saveFileName( mapInfo.fileName );
};


MapEditor.changeCursor = function( mouseOver )
{
if ( mouseOver === true )
    {
    document.body.style.cursor = 'pointer';
    }

else
    {
    document.body.style.cursor = 'default';
    }
};



function clear()
{
CONTAINER.removeAllChildren();
}



function reCenterCamera()
{
var canvas = Game.getCanvas();

CONTAINER.x = canvas.getWidth() / 2;
CONTAINER.y = canvas.getHeight() / 2;
}



function moveCamera( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
}


function changeScale( scale )
{
CONTAINER.scaleX = CONTAINER.scaleY = scale;

SCALE = scale;
}



function startNewMap()
{
var container = Game.getCanvasContainer();

var fileName = new Game.Html.Text({
        preText: 'File Name:'
    });
var name = new Game.Html.Text({
        preText: 'Map Name:'
    });
var image = new Game.Html.Text({
        preText: 'Image Id:'
    });
var start = new Game.Html.Button({
        value: 'Start',
        callback: function()
            {
            var info = {
                fileName: fileName.getValue(),
                mapName: name.getValue(),
                imageId: image.getValue()
            };

            MapEditor.load( info );
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            message.clear();
            }
    });


var message = new Game.Message({
        text: 'New Map',
        container: container,
        buttons: [ fileName, name, image, start, close ]
    });
}


/**
 * Save the previously saved file name, so that the next time the program is run, we can load it.
 */
MapEditor.saveFileName = function( fileName )
{
localStorage.setItem( 'diablo_map_previous_map', fileName );
};

MapEditor.getSavedFileName = function()
{
return localStorage.getItem( 'diablo_map_previous_map' );
};


MapEditor.clearSavedFileName = function()
{
localStorage.removeItem( 'diablo_map_previous_map' );
};



function openLoadMessage()
{
var container = Game.getCanvasContainer();

var fileName = new Game.Html.Text({
        preText: 'File Name:'
    });
var load = new Game.Html.Button({
        value: 'Load',
        callback: function()
            {
            MapEditor.loadMap( fileName.getValue() );
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            message.clear();
            }
    });


var message = new Game.Message({
        text: 'Load Map',
        container: container,
        buttons: [ fileName, load, close ]
    });
}



MapEditor.loadMap = function( name )
{
var container = Game.getCanvasContainer();

if ( name === '' )
    {
    new Game.Message({
            text: 'Need to specify the map name.',
            container: container,
            timeout: 2
        });
    return;
    }


var formData = new FormData();

formData.append( 'name', name );

    // make the request to the server
var request = new XMLHttpRequest();

request.open( 'POST', 'http://localhost:8000/load' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                text: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        MapEditor.clearSavedFileName();

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        var info = JSON.parse( this.responseText );

        MapEditor.load( info );
        }
    };
request.send( formData );
};




function saveMap()
{
    // name of the map
var container = Game.getCanvasContainer();

var dataStr = JSON.stringify( MAP_INFO, null, 4 );

var formData = new FormData();

formData.append( 'name', MAP_INFO.fileName );
formData.append( 'data', dataStr );

var request = new XMLHttpRequest();

request.open( 'POST', 'http://localhost:8000/save' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                text: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        new Game.Message({
                text: 'Saved',
                container: container,
                timeout: 2
            });
        }
    };
request.send( formData );
}



window.MapEditor = MapEditor;

})(window);
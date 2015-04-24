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
var MAP_INFO = {};
var LABELS = [];    // all the label elements
var SELECTED_LABEL = null;

    // 'move' -- move the camera mode
    // 'drag' -- drag a label mode
    // 'remove' -- remove a label mode
var POSSIBLE_MODES = [ 'Move', 'Drag', 'Remove' ];
var MODES = Utilities.createEnum( POSSIBLE_MODES );
var CURRENT_MODE = -1;

MapEditor.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // top level container
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


    // add the area name element
var canvas = Game.getCanvas();
var canvasHtmlElement = canvas.getHtmlCanvasElement();

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
    var currentX, currentY;

        // the drag of the labels
    if ( CURRENT_MODE === MODES.Drag )
        {
        if ( SELECTED_LABEL )
            {
            currentX = event.clientX;
            currentY = event.clientY;

            var rect = canvasHtmlElement.getBoundingClientRect();

            var x = (currentX - rect.left - CONTAINER.x) / SCALE;
            var y = (currentY - rect.top - CONTAINER.y) / SCALE;

            SELECTED_LABEL.x = x;
            SELECTED_LABEL.y = y;
            }
        }

        // the movement of the camera
    else if ( mouseDown )
        {
        currentX = event.clientX;
        currentY = event.clientY;

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
    if ( CURRENT_MODE === MODES.Remove )
        {
        var rect = canvasHtmlElement.getBoundingClientRect();

        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        MapEditor.removeLabel2( mouseX, mouseY );
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

var addLabel = new Game.Html.Button({
        value: 'Add Label',
        callback: MapEditor.addLabel
    });

var activeMode = new Game.Html.MultipleOptions({
        preText: 'Mode:',
        options: POSSIBLE_MODES,
        callback: function( button, position, htmlElement )
            {
            CURRENT_MODE = position;
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

menu.addChild( scale, recenter, addLabel, activeMode, newMap, save, load, FILE_NAME );


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



MapEditor.addLabel = function()
{
var container = Game.getCanvasContainer();
var canvas = Game.getCanvas();

var x = (canvas.getWidth() / 2 - CONTAINER.x) / SCALE;
var y = (canvas.getHeight() / 2 - CONTAINER.y) / SCALE;

var type = new Game.Html.MultipleOptions({
        options: [ 'cave_entrance', 'cave_exit' ]
    });
var text = new Game.Html.Text({
        preText: 'Text:'
    });
var destinationId = new Game.Html.Text({
        preText: 'Destination Id:'
    });
var add = new Game.Html.Button({
        value: 'Add',
        callback: function()
            {
            var label = new Label({
                    x: x,
                    y: y,
                    text: text.getValue(),
                    image: type.getValue()
                });
            CONTAINER.addChild( label );

            LABELS.push( label );

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
        text: 'New Label',
        container: container,
        background: true,
        buttons: [ type, text, destinationId, add, close ]
    });
};


MapEditor.removeLabel = function( label )
{
var position = LABELS.indexOf( label );

LABELS.splice( position, 1 );

label.remove();
};


MapEditor.removeLabel2 = function( x, y )
{
for (var a = LABELS.length - 1 ; a >= 0 ; a--)
    {
    var label = LABELS[ a ];
    var elements = label.intersect( x, y );

    if ( elements.length > 0 )
        {
        LABELS.splice( a, 1 );

        label.remove();
        return;
        }
    }
};



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


/**
 * Marks a label as selected. If the label given was already the one selected, and we deselect it.
 */
MapEditor.selectLabel = function( label )
{
if ( SELECTED_LABEL === label )
    {
    SELECTED_LABEL = null;
    }

else
    {
    SELECTED_LABEL = label;
    }
};



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
        background: true,
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
        background: true,
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
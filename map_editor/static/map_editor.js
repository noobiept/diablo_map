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


var MapEditor;
(function(MapEditor) {


var CONTAINER;

var AREA_NAME;  // located at the top left of the map, shows the area name
var SCALE = 1;
var BASIC_INFO = {};
var LABELS = [];    // all the label elements
var SELECTED_LABEL = null;



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
    if ( MapEditor.getCurrentMode() === MapEditor.MODES.Drag )
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

        MapEditor.moveCamera( currentX - referenceX, currentY - referenceY );

        referenceX = currentX;
        referenceY = currentY;
        }
    });
canvasContainer.addEventListener( 'mouseup', function( event )
    {
    mouseDown = false;

        // remove a label on click (if its on remove mode)
    if ( MapEditor.getCurrentMode() === MapEditor.MODES.Remove )
        {
        var rect = canvasHtmlElement.getBoundingClientRect();

        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        MapEditor.removeLabel2( mouseX, mouseY );
        }
    });


MapEditor.initMenu();


};


MapEditor.load = function( mapInfo )
{
clear();

var image = Game.Preload.get( mapInfo.imageId );

var map = new Game.Bitmap({
        image: image
    });
CONTAINER.addChild( map );

MapEditor.reCenterCamera();
MapEditor.setFileName( mapInfo.fileName );

AREA_NAME.text = mapInfo.mapName;
BASIC_INFO = {
        imageId: mapInfo.imageId,
        fileName: mapInfo.fileName,
        mapName: mapInfo.mapName
    };

MapEditor.saveFileName( mapInfo.fileName );


    // add all the labels
if ( typeof mapInfo.labels !== 'undefined' )
    {
    var labelsIds = Object.keys( mapInfo.labels );

    for (var a = labelsIds.length - 1 ; a >= 0 ; a--)
        {
        var id = labelsIds[ a ];
        var labelInfo = mapInfo.labels[ id ];

        MapEditor.addLabel( labelInfo.x, labelInfo.y, labelInfo.imageId, id, labelInfo.text, labelInfo.destination );
        }
    }
};



MapEditor.constructMapInfo = function()
{
var mapInfo = Utilities.deepClone( BASIC_INFO );

mapInfo.labels = {};

for (var a = LABELS.length - 1 ; a >= 0 ; a--)
    {
    var label = LABELS[ a ];

    mapInfo.labels[ label.id ] = {
            text: label.text,
            imageId: label.imageId,
            x: label.x,
            y: label.y,
            destination: label.destination
        };
    }

return mapInfo;
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


MapEditor.getTopLevelContainer = function()
{
return CONTAINER;
};


MapEditor.addLabel = function( x, y, imageId, id, text, destinationId )
{
var label = new Label({
        x: x,
        y: y,
        id: id,
        text: text,
        image: imageId,
        destination: destinationId
    });
CONTAINER.addChild( label );

LABELS.push( label );
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



MapEditor.reCenterCamera = function()
{
var canvas = Game.getCanvas();

CONTAINER.x = canvas.getWidth() / 2;
CONTAINER.y = canvas.getHeight() / 2;
};



MapEditor.moveCamera = function( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
};


MapEditor.changeScale = function( scale )
{
CONTAINER.scaleX = CONTAINER.scaleY = scale;

SCALE = scale;
};


MapEditor.getScale = function()
{
return SCALE;
};


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



})(MapEditor || (MapEditor = {}));
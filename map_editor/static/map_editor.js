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

var MAP_NAME;   // located at the top left of the map, shows the map name
var AREA_NAME;  // name of the area currently under the mouse
var SCALE = 1;
var BASIC_INFO = {};
var LABELS = [];    // all the label elements
var SELECTED_ELEMENT = null;
var AREAS = [];



MapEditor.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // top level container
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


    // add the map name element
var canvas = Game.getCanvas();
var canvasWidth = canvas.getWidth();
var canvasHtmlElement = canvas.getHtmlCanvasElement();

MAP_NAME = new Game.Text({
        textAlign: 'end',
        color: 'white'
    });
MAP_NAME.x = canvasWidth;
Game.addElement( MAP_NAME );


    // add the area name element
AREA_NAME = new Game.Text({
        textAlign: 'end',
        color: 'white'
    });
AREA_NAME.x = canvasWidth;
AREA_NAME.y = 20;
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
    var currentX = event.clientX;
    var currentY = event.clientY;
    var currentMode = MapEditor.getCurrentMode();

        // the drag of the elements
    if ( currentMode === MapEditor.MODES.Drag )
        {
        if ( SELECTED_ELEMENT )
            {
            var rect = canvasHtmlElement.getBoundingClientRect();

            var x = (currentX - rect.left - CONTAINER.x) / SCALE;
            var y = (currentY - rect.top - CONTAINER.y) / SCALE;

            SELECTED_ELEMENT.x = x;
            SELECTED_ELEMENT.y = y;
            }
        }

        // the movement of the camera
    else if ( mouseDown )
        {
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

        MapEditor.removeElement2( mouseX, mouseY );
        }
    });
document.body.addEventListener( 'keyup', function( event )
    {
    var key = event.keyCode;
    var currentMode = MapEditor.getCurrentMode();

    if ( currentMode === MapEditor.MODES.Resize && SELECTED_ELEMENT )
        {
        var step = 5;

        switch( key )
            {
            case Utilities.KEY_CODE.leftArrow:
            case Utilities.KEY_CODE.a:
                SELECTED_ELEMENT.width -= step;
                break;

            case Utilities.KEY_CODE.rightArrow:
            case Utilities.KEY_CODE.d:
                SELECTED_ELEMENT.width += step;
                break;

            case Utilities.KEY_CODE.upArrow:
            case Utilities.KEY_CODE.w:
                SELECTED_ELEMENT.height -= step;
                break;

            case Utilities.KEY_CODE.downArrow:
            case Utilities.KEY_CODE.s:
                SELECTED_ELEMENT.height += step;
                break;
            }
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

MAP_NAME.text = mapInfo.mapName;
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
            destination: label.destination,
            destinationLabel: label.destinationLabel
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

LABELS.length = 0;
AREAS.length = 0;
}


MapEditor.getTopLevelContainer = function()
{
return CONTAINER;
};


MapEditor.addLabel = function( x, y, imageId, id, text, destinationId, destinationLabel )
{
var label = new Label({
        x: x,
        y: y,
        id: id,
        text: text,
        image: imageId,
        destination: destinationId,
        destinationLabel: destinationLabel
    });
CONTAINER.addChild( label );

LABELS.push( label );
};


MapEditor.removeElement = function( element )
{
var position;
var array;

if ( element instanceof Label )
    {
    array = LABELS;
    }

else
    {
    array = AREAS;
    }


position = array.indexOf( element );

array.splice( position, 1 );

element.remove();
};


MapEditor.removeElement2 = function( x, y )
{
var a;
var elements;

for (a = LABELS.length - 1 ; a >= 0 ; a--)
    {
    var label = LABELS[ a ];
    elements = label.intersect( x, y );

    if ( elements.length > 0 )
        {
        LABELS.splice( a, 1 );

        label.remove();
        return;
        }
    }

for (a = AREAS.length - 1 ; a >= 0 ; a--)
    {
    var area = AREAS[ a ];
    elements = area.intersect( x, y );

    if ( elements.length > 0 )
        {
        AREAS.splice( a, 1 );

        area.remove();
        return;
        }
    }
};


MapEditor.addArea = function( x, y, name )
{
var area = new Area({
        x: x,
        y: y,
        width: 50,
        height: 50,
        name: name
    });
CONTAINER.addChild( area );

AREAS.push( area );
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
MapEditor.selectElement = function( label )
{
var currentMode = MapEditor.getCurrentMode();

if ( currentMode === MapEditor.MODES.Drag ||
     currentMode === MapEditor.MODES.Resize )
    {
    if ( SELECTED_ELEMENT === label )
        {
        SELECTED_ELEMENT = null;
        }

    else
        {
        SELECTED_ELEMENT = label;
        }
    }
};



MapEditor.setAreaName = function( name )
{
AREA_NAME.text = name;
};



})(MapEditor || (MapEditor = {}));
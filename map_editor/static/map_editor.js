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
        callback: MapEditor.openAddLabel
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
        callback: MapEditor.startNewMap
    });

var save = new Game.Html.Button({
        value: 'Save',
        callback: MapEditor.saveMap
    });

var load = new Game.Html.Button({
        value: 'Load',
        callback: MapEditor.openLoadMessage
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


MapEditor.getTopLevelContainer = function()
{
return CONTAINER;
};


MapEditor.addLabel = function( x, y, text, image )
{
var label = new Label({
        x: x,
        y: y,
        text: text,
        image: image
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



MapEditor.getMapInfo = function()
{
return MAP_INFO;
};


})(MapEditor || (MapEditor = {}));
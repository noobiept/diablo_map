window.onload = function()
{
Game.init( document.body, 1000, 600 );

var manifest = [
        { id: 'act_1', path: '/static/images/act_1.jpg' },

        { id: 'cave_entrance', path: '/static/images/cave_entrance.png' },
        { id: 'cave_exit', path: '/static/images/cave_exit.png' },

        { id: 'damp_cellar', path: '/static/images/damp_cellar.jpg' },
        { id: 'dank_cellar', path: '/static/images/dank_cellar.jpg' },
        { id: 'dark_cellar', path: '/static/images/dark_cellar.jpg' },
        { id: 'mass_grave', path: '/static/images/mass_grave.jpg' },
        { id: 'musty_cellar', path: '/static/images/musty_cellar.jpg' },
        { id: 'the_cave_under_the_well', path: '/static/images/the_cave_under_the_well.jpg' },
        { id: 'the_hidden_cellar', path: '/static/images/the_hidden_cellar.jpg' },
        { id: 'cathedral_level_1', path: '/static/images/cathedral_level_1.jpg' },
        { id: 'cathedral_level_2', path: '/static/images/cathedral_level_2.jpg' },
        { id: 'cathedral_level_3', path: '/static/images/cathedral_level_3.jpg' },
        { id: 'cathedral_level_4', path: '/static/images/cathedral_level_4.jpg' },
        { id: 'caverns_of_araneae', path: '/static/images/caverns_of_araneae.jpg' },
        { id: 'cellar_of_the_damned', path: '/static/images/cellar_of_the_damned.jpg' },
        { id: 'chamber_of_queen_araneae', path: '/static/images/chamber_of_queen_araneae.jpg' },
        { id: 'crypt_of_the_skeleton_king', path: '/static/images/crypt_of_the_skeleton_king.jpg' },
        { id: 'desolate_chamber', path: '/static/images/desolate_chamber.jpg' },
        { id: 'leorics_passage', path: '/static/images/leorics_passage.jpg' },
        { id: 'the_royal_crypts', path: '/static/images/the_royal_crypts.jpg' },
        { id: 'wortham', path: '/static/images/wortham.jpg' },
        { id: 'wortham_chapel_cellar', path: '/static/images/wortham_chapel_cellar.jpg' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    MapEditor.init();
    MapEditor.loadMapsInfo();
    });
preload.loadManifest( manifest );
};


var MapEditor;
(function(MapEditor) {


var CONTAINER;

var MAP_NAME;       // located at the top left of the map, shows the map name
var AREA_NAME;      // name of the area currently under the mouse
var SCALE = 1;
var SCALE_STEP = 0.2;
var SELECTED_ELEMENT = null;
var BASIC_INFO = {};
var LABELS = [];    // all the label elements
var AREAS = [];     // all the area elements
var MAPS_INFO;      // has all the maps info (labels/areas position, names, etc)
var CURRENT_MAP_ID = '';  // id of the current map that is loaded


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

            SELECTED_ELEMENT.x = Math.round( x );
            SELECTED_ELEMENT.y = Math.round( y );
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

        // global shortcuts
    switch( key )
        {
            // menu shortcuts
        case Utilities.KEY_CODE[ '1' ]:
            MapEditor.reCenterCamera();
            break;

        case Utilities.KEY_CODE[ '2' ]:
            MapEditor.changeScale( SCALE - SCALE_STEP );
            break;

        case Utilities.KEY_CODE[ '3' ]:
            MapEditor.changeScale( SCALE + SCALE_STEP );
            break;

            // map editor specific shortcuts
        case Utilities.KEY_CODE.q:
            MapEditor.setCurrentMode( MapEditor.MODES.Move );
            break;

        case Utilities.KEY_CODE.w:
            MapEditor.setCurrentMode( MapEditor.MODES.Drag );
            break;

        case Utilities.KEY_CODE.e:
            MapEditor.setCurrentMode( MapEditor.MODES.Remove );
            break;

        case Utilities.KEY_CODE.r:
            MapEditor.setCurrentMode( MapEditor.MODES.Resize );
            break;

            // other shortcuts
            // go back to the top level
        case Utilities.KEY_CODE.esc:
            Main.load( 'act_1' );
            break;
        }


        // resize mode specific shortcuts
    if ( currentMode === MapEditor.MODES.Resize && SELECTED_ELEMENT )
        {
        var step = 5;
        var width = SELECTED_ELEMENT.getWidth();
        var height = SELECTED_ELEMENT.getHeight();

        switch( key )
            {
            case Utilities.KEY_CODE.leftArrow:
                SELECTED_ELEMENT.setWidth( width - step );
                break;

            case Utilities.KEY_CODE.rightArrow:
                SELECTED_ELEMENT.setWidth( width + step );
                break;

            case Utilities.KEY_CODE.upArrow:
                SELECTED_ELEMENT.setHeight( height - step );
                break;

            case Utilities.KEY_CODE.downArrow:
                SELECTED_ELEMENT.setHeight( height + step );
                break;
            }
        }
    });


MapEditor.initMenu();
};


MapEditor.load = function( mapId, mapPosition )
{
clear();

var mapInfo = MAPS_INFO[ mapId ];

var image = Game.Preload.get( mapInfo.imageId );

var map = new Game.Bitmap({
        image: image
    });
CONTAINER.addChild( map );


if ( typeof mapPosition === 'undefined' || mapPosition === '' )
    {
    MapEditor.reCenterCamera();
    }

else
    {
    var info = mapInfo.labels[ mapPosition ];

    MapEditor.reCenterCamera( info.x, info.y );
    }

MAP_NAME.text = mapInfo.mapName;
CURRENT_MAP_ID = mapId;
BASIC_INFO = {
        imageId: mapInfo.imageId,
        mapName: mapInfo.mapName
    };

MapEditor.saveMapName( mapId, mapPosition );


    // add all the labels
var a;

if ( typeof mapInfo.labels !== 'undefined' )
    {
    var labelsIds = Object.keys( mapInfo.labels );

    for (a = labelsIds.length - 1 ; a >= 0 ; a--)
        {
        var id = labelsIds[ a ];
        var labelInfo = mapInfo.labels[ id ];

        MapEditor.addLabel( labelInfo.x, labelInfo.y, labelInfo.imageId, id, labelInfo.text, labelInfo.destination );
        }
    }


    // add all the areas
if ( typeof mapInfo.areas !== 'undefined' )
    {
    for (a = mapInfo.areas.length - 1 ; a >= 0 ; a--)
        {
        var areaInfo = mapInfo.areas[ a ];

        MapEditor.addArea( areaInfo.x, areaInfo.y, areaInfo.width, areaInfo.height, areaInfo.name );
        }
    }
};



MapEditor.getUpdatedMapInfo = function()
{
var mapInfo = Utilities.deepClone( BASIC_INFO );
var a;

    // add the labels
mapInfo.labels = {};

for (a = LABELS.length - 1 ; a >= 0 ; a--)
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


    // add the areas
mapInfo.areas = [];

for (a = AREAS.length - 1 ; a >= 0 ; a--)
    {
    var area = AREAS[ a ];

    mapInfo.areas.push({
            x: area.x,
            y: area.y,
            width: area.getWidth(),
            height: area.getHeight(),
            name: area.name
        });
    }


MAPS_INFO[ CURRENT_MAP_ID ] = mapInfo;

return MAPS_INFO;
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


MapEditor.addNewMap = function( info )
{
MAPS_INFO[ info.mapId ] = {
        imageId: info.imageId,
        mapName: info.mapName
    };
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


MapEditor.addArea = function( x, y, width, height, name )
{
var area = new Area({
        x: x,
        y: y,
        width: width,
        height: height,
        name: name
    });
CONTAINER.addChild( area );

AREAS.push( area );
};



/**
 * Center the camera around a given point (or (0, 0) if there's no arguments).
 */
MapEditor.reCenterCamera = function( refX, refY )
{
if ( typeof refX === 'undefined' )
    {
    refX = refY = 0;
    }


var canvas = Game.getCanvas();

CONTAINER.x = canvas.getWidth() / 2 - refX * SCALE;
CONTAINER.y = canvas.getHeight() / 2 - refY * SCALE;
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


MapEditor.clearSelectedElement = function()
{
SELECTED_ELEMENT = null;
};


MapEditor.setAreaName = function( name )
{
AREA_NAME.text = name;
};


MapEditor.setMapsInfo = function( info )
{
MAPS_INFO = info;
};


})(MapEditor || (MapEditor = {}));
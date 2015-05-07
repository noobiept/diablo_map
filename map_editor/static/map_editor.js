window.onload = function()
{
Game.init( document.body, 1000, 600 );

var manifest = [
        { id: 'act_1', path: 'images/act_1.jpg' },
        { id: 'cathedral_level_1', path: 'images/cathedral_level_1.jpg' },
        { id: 'cathedral_level_2', path: 'images/cathedral_level_2.jpg' },
        { id: 'cathedral_level_3', path: 'images/cathedral_level_3.jpg' },
        { id: 'cathedral_level_4', path: 'images/cathedral_level_4.jpg' },
        { id: 'cave_of_the_moon_clan_level_1', path: 'images/cave_of_the_moon_clan_level_1.jpg' },
        { id: 'cave_of_the_moon_clan_level_2', path: 'images/cave_of_the_moon_clan_level_2.jpg' },
        { id: 'caverns_of_araneae', path: 'images/caverns_of_araneae.jpg' },
        { id: 'cellar_of_the_damned', path: 'images/cellar_of_the_damned.jpg' },
        { id: 'cells_of_the_condemned', path: 'images/cells_of_the_condemned.jpg' },
        { id: 'chamber_of_queen_araneae', path: 'images/chamber_of_queen_araneae.jpg' },
        { id: 'chamber_of_suffering', path: 'images/chamber_of_suffering.jpg' },
        { id: 'chancellors_tomb', path: 'images/chancellors_tomb.jpg' },
        { id: 'crypt_of_the_ancients', path: 'images/crypt_of_the_ancients.jpg' },
        { id: 'crypt_of_the_skeleton_king', path: 'images/crypt_of_the_skeleton_king.jpg' },
        { id: 'damp_cellar', path: 'images/damp_cellar.jpg' },
        { id: 'dank_cellar', path: 'images/dank_cellar.jpg' },
        { id: 'dark_cellar', path: 'images/dark_cellar.jpg' },
        { id: 'decaying_crypt_level_1', path: 'images/decaying_crypt_level_1.jpg' },
        { id: 'decaying_crypt_level_2', path: 'images/decaying_crypt_level_2.jpg' },
        { id: 'defiled_crypt_1', path: 'images/defiled_crypt_1.jpg' },
        { id: 'defiled_crypt_2_level_1', path: 'images/defiled_crypt_2_level_1.jpg' },
        { id: 'defiled_crypt_2_level_2', path: 'images/defiled_crypt_2_level_2.jpg' },
        { id: 'defiled_crypt_3', path: 'images/defiled_crypt_3.jpg' },
        { id: 'den_of_the_fallen_level_1', path: 'images/den_of_the_fallen_level_1.jpg' },
        { id: 'den_of_the_fallen_level_2', path: 'images/den_of_the_fallen_level_2.jpg' },
        { id: 'desolate_chamber', path: 'images/desolate_chamber.jpg' },
        { id: 'drowned_temple', path: 'images/drowned_temple.jpg' },
        { id: 'halls_of_agony_level_1', path: 'images/halls_of_agony_level_1.jpg' },
        { id: 'halls_of_agony_level_2', path: 'images/halls_of_agony_level_2.jpg' },
        { id: 'halls_of_agony_level_3', path: 'images/halls_of_agony_level_3.jpg' },
        { id: 'heretics_abode', path: 'images/heretics_abode.jpg' },
        { id: 'highlands_cave', path: 'images/highlands_cave.jpg' },
        { id: 'highlands_passage', path: 'images/highlands_passage.jpg' },
        { id: 'khazra_den', path: 'images/khazra_den.jpg' },
        { id: 'leahs_room', path: 'images/leahs_room.jpg' },
        { id: 'leorics_manor', path: 'images/leorics_manor.jpg' },
        { id: 'leorics_passage', path: 'images/leorics_passage.jpg' },
        { id: 'lost_mine_level_1', path: 'images/lost_mine_level_1.jpg' },
        { id: 'lost_mine_level_2', path: 'images/lost_mine_level_2.jpg' },
        { id: 'mass_grave', path: 'images/mass_grave.jpg' },
        { id: 'musty_cellar', path: 'images/musty_cellar.jpg' },
        { id: 'scavengers_den_level_1', path: 'images/scavengers_den_level_1.jpg' },
        { id: 'scavengers_den_level_2', path: 'images/scavengers_den_level_2.jpg' },
        { id: 'the_cave_under_the_well', path: 'images/the_cave_under_the_well.jpg' },
        { id: 'the_cursed_hold', path: 'images/the_cursed_hold.jpg' },
        { id: 'the_hidden_cellar', path: 'images/the_hidden_cellar.jpg' },
        { id: 'the_lyceum', path: 'images/the_lyceum.jpg' },
        { id: 'the_royal_crypts', path: 'images/the_royal_crypts.jpg' },
        { id: 'the_slaughtered_calf_inn', path: 'images/the_slaughtered_calf_inn.jpg' },
        { id: 'tinkers_hovel', path: 'images/tinkers_hovel.jpg' },
        { id: 'warriors_rest', path: 'images/warriors_rest.jpg' },
        { id: 'watch_tower_level_1', path: 'images/watch_tower_level_1.jpg' },
        { id: 'watch_tower_level_2', path: 'images/watch_tower_level_2.jpg' },
        { id: 'wortham', path: 'images/wortham.jpg' },
        { id: 'wortham_chapel_cellar', path: 'images/wortham_chapel_cellar.jpg' },

        { id: 'elements', path: 'images/elements.png' },
        { id: 'info', path: 'map_info/info.json' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    MapEditor.init();
    MapEditor.loadMapsInfo();
    });
preload.loadManifest( manifest, '/static/' );
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

        MapEditor.addLabel( labelInfo.x, labelInfo.y, labelInfo.imageId, id, labelInfo.text, labelInfo.destination, labelInfo.destinationLabel );
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
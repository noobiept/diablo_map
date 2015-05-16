window.onload = function()
{
Main.initialInit();
Main.loadAssets( '', function() { Main.load( 'act_1_map' ); } );
};



var Main;
(function(Main) {


var CONTAINER;      // top-level container
var MAP_NAME;       // text element, which identifies the current map image
var AREA_NAME;      // text element, that has the name of the current are under the mouse pointer
var CURRENT_AREA_NAMES = [];    // there may be more than 1 area under the mouse at any given time, the names are saved here
var MAPS_INFO;      // has all the maps info (labels/areas position, names, etc)
var SCALE = 1;      // current scale of the map
var MIN_SCALE = 0.4;
var MAX_SCALE = 2;
var SCALE_STEP = 0.2;
var SCALE_MENU_ELEMENT;


Main.initialInit = function()
{
var min = 400;
var max = 1000; // if the canvas is too big, it will have performance problems

var width = window.innerWidth - 10;
var height = window.innerHeight - 75;

    // make sure the canvas dimensions are within the limits
if ( width < min )
    {
    width = min;
    }

else if ( width > max )
    {
    width = max;
    }

if ( height < min )
    {
    height = min;
    }

else if ( height > max )
    {
    height = max;
    }

Game.init( document.body, width, height );
};


Main.loadAssets = function( basePath, onComplete )
{
if ( typeof basePath === 'undefined' )
    {
    basePath = '';
    }


var manifest = [
        { id: 'act_1', path: 'images/act_1.jpg' },
        { id: 'act_1_map', path: 'images/act_1_map.jpg' },
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

var container = Game.getCanvasContainer();
var loadingMessage = new Game.Message({
        container: container,
        cssId: 'LoadingMessage',
        body: 'Loading..'
    });

preload.addEventListener( 'progress', function( progress )
    {
    loadingMessage.setBody( 'Loading.. ' + progress + '%' );
    });
preload.addEventListener( 'complete', function()
    {
    loadingMessage.clear();
    Main.finalInit();

    if ( onComplete )
        {
        onComplete();
        }
    });
preload.loadManifest( manifest, basePath );
};


Main.loadMapsInfo = function()
{
MAPS_INFO = Game.Preload.get( 'info' );
};


Main.finalInit = function()
{
Game.activateMouseMoveEvents( 100 );

    // add the top-level container (for all the elements)
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


    // get the maps info
Main.loadMapsInfo();


    // add the map name element
var canvas = Game.getCanvas();
var canvasWidth = canvas.getWidth();

MAP_NAME = new Game.Text({
        textAlign: 'end',
        fontFamily: '"Exocet Blizzard Light" serif',
        color: 'white'
    });
MAP_NAME.x = canvasWidth;
Game.addElement( MAP_NAME );


    // add the area name element
AREA_NAME = new Game.Text({
        textAlign: 'end',
        fontFamily: '"Exocet Blizzard Light" serif',
        color: 'white'
    });
AREA_NAME.x = canvasWidth;
AREA_NAME.y = 20;
Game.addElement( AREA_NAME );


    // set up the key events for navigating the map
    // and for shortcuts to the menu
document.body.addEventListener( 'keydown', Main.keyDownListener );

    // and the mouse events for the movement as well
var mouseDown = false;
var referenceX;
var referenceY;
var canvasContainer = Game.getCanvasContainer();

    // disable the context menu (when right-clicking)
canvasContainer.oncontextmenu = function( event ) { return false; };
canvasContainer.addEventListener( 'mousedown', function( event )
    {
    if ( event.button === Utilities.MOUSE_CODE.left )
        {
        mouseDown = true;
        referenceX = event.clientX;
        referenceY = event.clientY;
        }
    });
canvasContainer.addEventListener( 'mousemove', function( event )
    {
    if ( mouseDown )
        {
        var currentX = event.clientX;
        var currentY = event.clientY;

        Main.moveCamera( currentX - referenceX, currentY - referenceY );

        referenceX = currentX;
        referenceY = currentY;
        }
    });
canvasContainer.addEventListener( 'mouseup', function( event )
    {
    mouseDown = false;

    if ( event.button === Utilities.MOUSE_CODE.right )
        {
        Main.load( 'act_1_map' );
        }
    });
canvasContainer.addEventListener( 'mouseleave', function( event )
    {
        // don't move the camera when the mouse goes out of the canvas (for example when going for the menu)
    mouseDown = false;
    });

Main.initMenu();
};


Main.initMenu = function()
{
var menu = new Game.Html.HtmlContainer();

SCALE_MENU_ELEMENT = new Game.Html.Range({
        min: MIN_SCALE,
        max: MAX_SCALE,
        value: 1,
        step: SCALE_STEP,
        preText: 'Scale',
        onChange: function( button )
            {
            Main.changeScale( button.getValue() );
            }
    });

var recenter = new Game.Html.Button({
        value: 'Recenter',
        callback: function( button )
            {
            Main.reCenterCamera();
            }
    });

menu.addChild( SCALE_MENU_ELEMENT, recenter );

document.body.appendChild( menu.container );

return menu;
};



/**
 * @param mapId Id of the map we're loading.
 * @param mapPosition Optional label id to center the camera on.
 */
Main.load = function( mapId, mapPosition )
{
Main.clear();
var mapInfo = MAPS_INFO[ mapId ];


    // load the map image
var map = new Game.Bitmap({
        image: Game.Preload.get( mapInfo.imageId )
    });
CONTAINER.addChild( map );

MAP_NAME.text = mapInfo.mapName;


    // center the container in the middle of the canvas
if ( typeof mapPosition === 'undefined' || mapPosition === '' )
    {
    Main.reCenterCamera();
    }

    // center in the middle of the given x/y position
else
    {
    var positionInfo = mapInfo.labels[ mapPosition ];

    Main.reCenterCamera( positionInfo.x, positionInfo.y );
    }


var a;
var info;

    // add the labels
if ( typeof mapInfo.labels !== 'undefined' )
    {
    var labelsIds = Object.keys( mapInfo.labels );

    for (a = labelsIds.length - 1 ; a >= 0 ; a--)
        {
        var id = labelsIds[ a ];

        info = mapInfo.labels[ id ];
        info.id = id;

        Main.addLabel( info );
        }
    }


    // add all the invisible labels
if ( typeof mapInfo.invisible_labels !== 'undefined' )
    {
    for (a = mapInfo.invisible_labels.length - 1 ; a >= 0 ; a--)
        {
        info = mapInfo.invisible_labels[ a ];

        Main.addInvisibleLabel( info );
        }
    }


    // and the area elements
if ( typeof mapInfo.areas !== 'undefined' )
    {
    for (a = mapInfo.areas.length - 1 ; a >= 0 ; a--)
        {
        info = mapInfo.areas[ a ];

        Main.addArea( info );
        }
    }
};


Main.addLabel = function( args )
{
var label = new Label( args );

CONTAINER.addChild( label );

return label;
};



Main.addInvisibleLabel = function( args )
{
var label = new InvisibleLabel( args );

CONTAINER.addChild( label );

return label;
};


Main.addArea = function( args )
{
var area = new Area( args );

CONTAINER.addChild( area );

return area;
};





Main.changeCursor = function( mouseOver )
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



Main.clear = function()
{
CURRENT_AREA_NAMES.length = 0;
AREA_NAME.text = '';
CONTAINER.removeAllChildren();
};


/**
 * Center the camera around a given point (or (0, 0) if there's no arguments).
 */
Main.reCenterCamera = function( refX, refY )
{
if ( typeof refX === 'undefined' )
    {
    refX = refY = 0;
    }

var canvas = Game.getCanvas();

CONTAINER.x = canvas.getWidth() / 2 - refX * SCALE;
CONTAINER.y = canvas.getHeight() / 2 - refY * SCALE;
};



Main.moveCamera = function( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
};


Main.changeScale = function( scale )
{
if ( scale < MIN_SCALE ||
     scale > MAX_SCALE )
    {
    return;
    }

var canvas = Game.getCanvas();
var scaleDiff = scale - SCALE;

CONTAINER.scaleX = CONTAINER.scaleY = scale;
SCALE = scale;

    // try to counter the movement resulting from the scaling
CONTAINER.x -= (canvas.getWidth() / 2 - CONTAINER.x) * scaleDiff;
CONTAINER.y -= (canvas.getHeight() / 2 - CONTAINER.y) * scaleDiff;


SCALE_MENU_ELEMENT.setValue( scale );
};


Main.getScale = function()
{
return SCALE;
};



Main.addAreaName = function( name )
{
CURRENT_AREA_NAMES.push( name );

AREA_NAME.text = name;
};


Main.removeAreaName = function( name )
{
var position = CURRENT_AREA_NAMES.indexOf( name );

CURRENT_AREA_NAMES.splice( position, 1 );

var length = CURRENT_AREA_NAMES.length;

if ( length > 0 )
    {
    AREA_NAME.text = CURRENT_AREA_NAMES[ length - 1 ];
    }

else
    {
    AREA_NAME.text = '';
    }
};


Main.getMapsInfo = function()
{
return MAPS_INFO;
};


Main.setMapsInfo = function( info )
{
MAPS_INFO = info;
};


Main.getTopLevelContainer = function()
{
return CONTAINER;
};


/**
 * Deals with the program's keyboard shortcuts.
 */
Main.keyDownListener = function( event )
{
var key = event.keyCode;
var step = 20;  // movement step

switch( key )
    {
        // key movement
    case Utilities.KEY_CODE.leftArrow:
    case Utilities.KEY_CODE.a:
        Main.moveCamera( step, 0 );
        break;

    case Utilities.KEY_CODE.rightArrow:
    case Utilities.KEY_CODE.d:
        Main.moveCamera( -step, 0 );
        break;

    case Utilities.KEY_CODE.upArrow:
    case Utilities.KEY_CODE.w:
        Main.moveCamera( 0, step );
        break;

    case Utilities.KEY_CODE.downArrow:
    case Utilities.KEY_CODE.s:
        Main.moveCamera( 0, -step );
        break;

        // menu shortcuts
    case Utilities.KEY_CODE[ '1' ]:
        Main.reCenterCamera();
        break;

    case Utilities.KEY_CODE[ '2' ]:
        Main.changeScale( SCALE - SCALE_STEP );
        break;

    case Utilities.KEY_CODE[ '3' ]:
        Main.changeScale( SCALE + SCALE_STEP );
        break;

        // other shortcuts
        // go back to the top level
    case Utilities.KEY_CODE.esc:
    case Utilities.KEY_CODE.m:
        Main.load( 'act_1_map' );
        break;
    }
};


})(Main || (Main = {}));
window.onload = function()
{
Game.init( document.body, 1000, 600 );


var manifest = [
        { id: 'act_1', path: 'images/act_1.jpg' },
        { id: 'damp_cellar', path: 'images/damp_cellar.jpg' },
        { id: 'dank_cellar', path: 'images/dank_cellar.jpg' },
        { id: 'dark_cellar', path: 'images/dark_cellar.jpg' },
        { id: 'mass_grave', path: 'images/mass_grave.jpg' },
        { id: 'musty_cellar', path: 'images/musty_cellar.jpg' },
        { id: 'the_cave_under_the_well', path: 'images/the_cave_under_the_well.jpg' },
        { id: 'the_hidden_cellar', path: 'images/the_hidden_cellar.jpg' },

        { id: 'cave_entrance', path: 'images/cave_entrance.png' },
        { id: 'cave_exit', path: 'images/cave_exit.png' },

        { id: 'info', path: 'map_info/info.json' }
    ];


var preload = new Game.Preload({ save_global: true });

var container = Game.getCanvasContainer();
var loadingMessage = new Game.Message({
        container: container,
        body: 'Loading..'
    });

preload.addEventListener( 'progress', function( progress )
    {
    loadingMessage.setBody( 'Loadding.. ' + progress + '%' );
    });
preload.addEventListener( 'complete', function()
    {
    loadingMessage.clear();

    Main.init();
    Main.load( 'act_1', 'damp_cellar' );
    });
preload.loadManifest( manifest );
};




(function(window)
{
function Main()
{

}

var CONTAINER;      // top-level container
var MAP_NAME;       // text element, which identifies the current map image
var AREA_NAME;      // text element, that has the name of the current are under the mouse pointer
var MAPS_INFO;      // has all the maps info (labels/areas position, names, etc)
var SCALE = 1;      // current scale of the map
var MIN_SCALE = 0.4;
var MAX_SCALE = 2;
var SCALE_STEP = 0.2;
var SCALE_MENU_ELEMENT;


Main.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // add the top-level container (for all the elements)
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


    // get the maps info
MAPS_INFO = Game.Preload.get( 'info' );


    // add the map name element
var canvas = Game.getCanvas();
var canvasWidth = canvas.getWidth();

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


    // set up the key events for navigating the map
    // and for shortcuts to the menu
document.body.addEventListener( 'keydown', function( event )
    {
    var key = event.keyCode;
    var step = 20;  // movement step

    switch( key )
        {
            // key movement
        case Utilities.KEY_CODE.leftArrow:
        case Utilities.KEY_CODE.a:
            moveCamera( step, 0 );
            break;

        case Utilities.KEY_CODE.rightArrow:
        case Utilities.KEY_CODE.d:
            moveCamera( -step, 0 );
            break;

        case Utilities.KEY_CODE.upArrow:
        case Utilities.KEY_CODE.w:
            moveCamera( 0, step );
            break;

        case Utilities.KEY_CODE.downArrow:
        case Utilities.KEY_CODE.s:
            moveCamera( 0, -step );
            break;

            // menu shortcuts
        case Utilities.KEY_CODE[ '1' ]:
            reCenterCamera();
            break;

        case Utilities.KEY_CODE[ '2' ]:
            changeScale( SCALE - SCALE_STEP );
            break;

        case Utilities.KEY_CODE[ '3' ]:
            changeScale( SCALE + SCALE_STEP );
            break;

            // other shortcuts
            // go back to the top level
        case Utilities.KEY_CODE.esc:
            Main.load( 'act_1' );
            break;
        }
    });


    // and the mouse events for the movement as well
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


    // add the menu
var menu = new Game.Html.HtmlContainer();

SCALE_MENU_ELEMENT = new Game.Html.Range({
        min: MIN_SCALE,
        max: MAX_SCALE,
        value: 1,
        step: SCALE_STEP,
        preText: 'Scale',
        onChange: function( button )
            {
            changeScale( button.getValue() );
            }
    });

var recenter = new Game.Html.Button({
        value: 'Recenter',
        callback: function( button )
            {
            reCenterCamera();
            }
    });

menu.addChild( SCALE_MENU_ELEMENT, recenter );


document.body.appendChild( menu.container );
};


/**
 * @param mapId Id of the map we're loading.
 * @param mapPosition Optional label id to center the camera on.
 */
Main.load = function( mapId, mapPosition )
{
clear();

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
    reCenterCamera();
    }

    // center in the middle of the given x/y position
else
    {
    var positionInfo = mapInfo.labels[ mapPosition ];

    reCenterCamera( positionInfo.x, positionInfo.y );
    }


    // add the labels
var labelsIds = Object.keys( mapInfo.labels );
var a;

for (a = labelsIds.length - 1 ; a >= 0 ; a--)
    {
    var id = labelsIds[ a ];

    var labelInfo = mapInfo.labels[ id ];
    var label = new Label( labelInfo );

    CONTAINER.addChild( label );
    }

    // and the area elements
for (a = mapInfo.areas.length - 1 ; a >= 0 ; a--)
    {
    var areaInfo = mapInfo.areas[ a ];

    var area = new Area({
            x: areaInfo.x,
            y: areaInfo.y,
            width: areaInfo.width,
            height: areaInfo.height,
            name: areaInfo.name
        });
    CONTAINER.addChild( area );
    }
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



function clear()
{
AREA_NAME.text = '';
CONTAINER.removeAllChildren();
}


/**
 * Center the camera around a given point (or (0, 0) if there's no arguments).
 */
function reCenterCamera( refX, refY )
{
if ( typeof refX === 'undefined' )
    {
    refX = refY = 0;
    }

var canvas = Game.getCanvas();

CONTAINER.x = canvas.getWidth() / 2 - refX * SCALE;
CONTAINER.y = canvas.getHeight() / 2 - refY * SCALE;
}



function moveCamera( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
}


function changeScale( scale )
{
if ( scale < MIN_SCALE ||
     scale > MAX_SCALE )
    {
    return;
    }

CONTAINER.scaleX = CONTAINER.scaleY = scale;
SCALE = scale;

SCALE_MENU_ELEMENT.setValue( scale );
}


Main.setAreaName = function( name )
{
AREA_NAME.text = name;
};


window.Main = Main;

})(window);
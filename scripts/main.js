window.onload = function()
{
Game.init( document.body, 1000, 600 );


var manifest = [
        { id: 'act_1', path: 'images/act_1.jpg' },
        { id: 'act_1_info', path: 'map_info/act_1.json' },
        { id: 'damp_cellar', path: 'images/damp_cellar.jpg' },
        { id: 'damp_cellar_info', path: 'map_info/damp_cellar.json' },

        { id: 'cave_entrance', path: 'images/cave_entrance.png' },
        { id: 'cave_exit', path: 'images/cave_exit.png' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
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
var SCALE = 1;      // current scale of the map


Main.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // add the top-level container (for all the elements)
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


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
document.body.addEventListener( 'keydown', function( event )
    {
    var key = event.keyCode;
    var step = 10;  // movement step

    switch( key )
        {
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

menu.addChild( scale, recenter );


document.body.appendChild( menu.container );
};


/**
 * @param mapName Id of the map we're loading.
 * @param mapPosition Optional label id to center the camera on
 */
Main.load = function( mapName, mapPosition )
{
clear();

var mapInfo = Game.Preload.get( mapName + '_info' );
var canvas = Game.getCanvas();

    // center the container in the middle of the canvas
if ( typeof mapPosition === 'undefined' || mapPosition === '' )
    {
    CONTAINER.x = canvas.getWidth() / 2;
    CONTAINER.y = canvas.getHeight() / 2;
    }

    // center in the middle of the given x/y position
else
    {
    var positionInfo = mapInfo.labels[ mapPosition ];
    CONTAINER.x = canvas.getWidth() / 2 - positionInfo.x * SCALE;
    CONTAINER.y = canvas.getHeight() / 2 - positionInfo.y * SCALE;
    }


    // load the map image
var map = new Game.Bitmap({
        image: Game.Preload.get( mapInfo.imageId )
    });
CONTAINER.addChild( map );


MAP_NAME.text = mapInfo.mapName;


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


Main.setAreaName = function( name )
{
AREA_NAME.text = name;
};


window.Main = Main;

})(window);
window.onload = function()
{
Game.init( document.body, 1000, 600 );


var manifest = [
        { id: 'act_1', path: 'images/act_1.jpg' },
        { id: 'cave_entrance', path: 'images/cave_entrance.png' },
        { id: 'cave_exit', path: 'images/cave_exit.png' },
        { id: 'damp_cellar', path: 'images/damp_cellar.jpg' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    Main.init();
    Main.load( 'damp_cellar' );
    });
preload.loadManifest( manifest );
};




(function(window)
{
function Main()
{

}

var CONTAINER;
var AREA_NAME;


Main.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // add the top-level container (for all the elements)
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

document.body.addEventListener( 'mousedown', function( event )
    {
    mouseDown = true;
    referenceX = event.clientX;
    referenceY = event.clientY;
    });
document.body.addEventListener( 'mousemove', function( event )
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
document.body.addEventListener( 'mouseup', function( event )
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
menu.addChild( scale );

document.body.appendChild( menu.container );
};


Main.load = function( mapName, mapPosition )
{
clear();

var mapInfo = INFO[ mapName ];
var canvas = Game.getCanvas();

    // center the container in the middle of the canvas
if ( typeof mapPosition === 'undefined' )
    {
    CONTAINER.x = canvas.getWidth() / 2;
    CONTAINER.y = canvas.getHeight() / 2;
    }

    // center in the middle of the given x/y position
else
    {
    var positionInfo = mapInfo[ mapPosition ];
    CONTAINER.x = canvas.getWidth() / 2 - positionInfo.x;
    CONTAINER.y = canvas.getHeight() / 2 - positionInfo.y;
    }


    // load the map image
var map = new Game.Bitmap({
        image: Game.Preload.get( mapInfo.image )
    });
CONTAINER.addChild( map );


AREA_NAME.text = mapInfo.text;


    // cave entrances
var caveEntrances = mapInfo.cave_entrances;
var length = caveEntrances.length;
var info;
var a;
var id;
var label;

for (a = 0 ; a < length ; a++)
    {
    id = caveEntrances[ a ];
    info = mapInfo[ id ];
    info.image = 'cave_entrance';

    label = new Label( info );

    CONTAINER.addChild( label );
    }

    // cave exits
var caveExits = mapInfo.cave_exits;
length = caveExits.length;

for (a = 0 ; a < length ; a++)
    {
    id = caveExits[ a ];
    info = mapInfo[ id ];
    info.image = 'cave_exit';

    label = new Label( info );

    CONTAINER.addChild( label );
    }
};



function clear()
{
CONTAINER.removeAllChildren();
}




function moveCamera( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
}


function changeScale( scale )
{
CONTAINER.scaleX = CONTAINER.scaleY = scale;
}


window.Main = Main;

})(window);
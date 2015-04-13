window.onload = function()
{
Game.init( document.body, 1000, 600 );


var manifest = [
        { id: 'act_1', path: 'images/act_1.jpg' },
        { id: 'cave_entrance', path: 'images/cave_entrance.png' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    Main.init();
    Main.load( 'act_1' );
    });
preload.loadManifest( manifest );
};




(function(window)
{
function Main()
{

}

var CONTAINER;


Main.init = function()
{
Game.activateMouseMoveEvents( 100 );


    // add the top-level container (for all the elements)
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


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
};


Main.load = function( mapName )
{
var mapInfo = INFO[ mapName ];

var map = new Game.Bitmap({
        image: Game.Preload.get( mapInfo.image )
    });
CONTAINER.addChild( map );

var labels = mapInfo.labels;
var length = labels.length;

for (var a = 0 ; a < length ; a++)
    {
    var labelInfo = labels[ a ];

    var label = new Label({
            x: labelInfo.x,
            y: labelInfo.y,
            image: Game.Preload.get( labelInfo.image ),
            text: labelInfo.text
        });

    CONTAINER.addChild( label );
    }
};



function moveCamera( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
}



window.Main = Main;

})(window);
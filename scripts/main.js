window.onload = function()
{
Game.init( document.body, 600, 600 );


var manifest = [
        { id: 'test', path: 'test/fields_of_misery.jpg' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    Main.init();
    Main.start();
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


Main.start = function()
{
var map = new Game.Bitmap({
        image: Game.Preload.get( 'test' )
    });
CONTAINER.addChild( map );
};



function moveCamera( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
}



window.Main = Main;

})(window);
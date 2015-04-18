window.onload = function()
{
Game.init( document.body, 700, 500 );

var manifest = [
        { id: 'act_1', path: '../images/act_1.jpg' },
        { id: 'cave_entrance', path: '../images/cave_entrance.png' },
        { id: 'cave_exit', path: '../images/cave_exit.png' },
        { id: 'damp_cellar', path: '../images/damp_cellar.jpg' }
    ];


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'complete', function()
    {
    MapEditor.init();
    MapEditor.load();
    });
preload.loadManifest( manifest );
};


(function(window)
{
function MapEditor()
{

}

var CONTAINER;
var SELECTED_TYPE = null;


MapEditor.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // top level container
CONTAINER = new Game.Container();

Game.addElement( CONTAINER );


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


    // add the labels on click (depending on what value is selected in the menu)
Game.getCanvas().getHtmlCanvasElement().addEventListener( 'mouseup', function( event )
    {
    if ( SELECTED_TYPE )
        {
        var rect = Game.getCanvas().getHtmlCanvasElement().getBoundingClientRect();

        var x = event.clientX - rect.left - CONTAINER.x;
        var y = event.clientY - rect.top - CONTAINER.y;

        var label = new Label({
                x: x,
                y: y,
                text: '------',
                image: SELECTED_TYPE
            });
        CONTAINER.addChild( label );
        }
    });


    // create the menu
var menu = new Game.Html.HtmlContainer();

var selectElement = new Game.Html.MultipleOptions({
        options: [ 'none', 'cave_entrance', 'cave_exit' ],
        callback: function( button, position, htmlElement )
            {
            var id = htmlElement.innerHTML;

            if ( id === 'none' )
                {
                SELECTED_TYPE = null;
                }

            else
                {
                SELECTED_TYPE = id;
                }
            }
    });
menu.addChild( selectElement );

document.body.appendChild( menu.container );
};


MapEditor.load = function( map )
{
var image = Game.Preload.get( 'act_1' );

var map = new Game.Bitmap({
        x: image.width / 2,
        y: image.height / 2,
        image: image
    });
CONTAINER.addChild( map );

CONTAINER.x = -660;
CONTAINER.y = -2900;
};




function moveCamera( xMov, yMov )
{
CONTAINER.x += xMov;
CONTAINER.y += yMov;
}



window.MapEditor = MapEditor;

})(window);
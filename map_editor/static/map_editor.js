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
var AREA_NAME;
var SCALE = 1;
var SELECTED_TYPE = null;


MapEditor.init = function()
{
Game.activateMouseMoveEvents( 100 );

    // top level container
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


    // add the labels on click (depending on what value is selected in the menu)
canvasContainer.addEventListener( 'mouseup', function( event )
    {
    if ( SELECTED_TYPE )
        {
        var rect = Game.getCanvas().getHtmlCanvasElement().getBoundingClientRect();

        var x = event.clientX - rect.left - CONTAINER.x;
        var y = event.clientY - rect.top - CONTAINER.y;

        var label = new Label({
                x: x / SCALE,
                y: y / SCALE,
                text: '------',
                image: SELECTED_TYPE
            });
        CONTAINER.addChild( label );
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

var save = new Game.Html.Button({
        value: 'Save',
        callback: saveMap
    });
var textInput = document.createElement( 'input' );

textInput.type = 'text';
textInput.id = 'TextInput';

menu.addChild( selectElement, scale, recenter, save );
menu.container.appendChild( textInput );

document.body.appendChild( menu.container );
};


MapEditor.load = function( map )
{
clear();

var image = Game.Preload.get( 'act_1' );

var map = new Game.Bitmap({
        image: image
    });
CONTAINER.addChild( map );

reCenterCamera();

AREA_NAME.text = 'Act 1';

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



function saveMap()
{
    // name of the map
var textInput = document.querySelector( '#TextInput' );
var name = textInput.value;
var container = Game.getCanvasContainer();

if ( name === '' )
    {
    new Game.Message({
            text: 'Specify the map name before saving.',
            container: container,
            timeout: 2
        });
    return;
    }


var data = {
    cave_entrances: [ 'test' ]
};

var dataStr = JSON.stringify( data );

var formData = new FormData();

formData.append( 'name', name );
formData.append( 'data', dataStr );

var request = new XMLHttpRequest();

request.open( 'POST', 'http://localhost:8000/save' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                text: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        console.log( this.status );
        console.log( this.responseText );
        }
    };
request.send( formData );
}



window.MapEditor = MapEditor;

})(window);
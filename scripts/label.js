function Label( info )
{
Game.Container.call( this );

var text = new Game.Text({
        y: 20,
        text: info.text,
        textAlign: 'center',
        color: 'white'
    });
text.visible = false;

var image = new Game.Bitmap({
        image: Game.Preload.get( info.imageId )
    });
image.addEventListener( 'click', function( data )
    {
        // since Main.load() will remove elements, can't call this directly in the event handler (since its still processing the elements)
        // add to the loop to be called later
    Game.addToGameLoop( function()
        {
        Main.load( info.destination, info.destinationLabel );
        }, 0, false );
    });
image.addEventListener( 'mouseover', function( data )
    {
    Main.changeCursor( true );
    text.visible = true;
    });
image.addEventListener( 'mouseout', function( data )
    {
    Main.changeCursor( false );
    text.visible = false;
    });


this.x = info.x;
this.y = info.y;
this.addChild( image, text );
}


Utilities.inheritPrototype( Label, Game.Container );
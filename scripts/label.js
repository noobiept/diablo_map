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
        image: Game.Preload.get( info.image )
    });
image.addEventListener( 'click', function( data )
    {
    Main.load( info.dest, info.position );
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
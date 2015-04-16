function Label( args )
{
Game.Container.call( this, args );

var text = new Game.Text({
        y: 20,
        text: args.text,
        textAlign: 'center',
        color: 'white'
    });
text.visible = false;

var image = new Game.Bitmap({
        image: args.image
    });
image.addEventListener( 'click', function( data )
    {
    Main.load( args.destination );
    });
image.addEventListener( 'mouseover', function( data )
    {
    text.visible = true;
    });
image.addEventListener( 'mouseout', function( data )
    {
    text.visible = false;
    });


this.addChild( image, text );
}


Utilities.inheritPrototype( Label, Game.Container );
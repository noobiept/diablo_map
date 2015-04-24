function Label( info )
{
Game.Container.call( this );

var _this = this;

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
    var code = data.event.button;

        // this won't trigger if the whole page isn't visible (middle clicking will turn into a drag movement)
    if ( code === Utilities.MOUSE_CODE.middle )
        {
        MapEditor.removeLabel( _this );
        }

    else if ( code === Utilities.MOUSE_CODE.left )
        {
        MapEditor.selectLabel( _this );
        }
    });
image.addEventListener( 'mouseover', function( data )
    {
    MapEditor.changeCursor( true );
    text.visible = true;
    });
image.addEventListener( 'mouseout', function( data )
    {
    MapEditor.changeCursor( false );
    text.visible = false;
    });


this.x = info.x;
this.y = info.y;
this.addChild( image, text );
}


Utilities.inheritPrototype( Label, Game.Container );
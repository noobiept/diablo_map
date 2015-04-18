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

    if ( code === Utilities.MOUSE_CODE.middle )
        {
        _this.remove();
        }
    });
image.addEventListener( 'mouseover', function( data )
    {
    text.visible = true;
    });
image.addEventListener( 'mouseout', function( data )
    {
    text.visible = false;
    });

this.x = info.x;
this.y = info.y;
this.addChild( image, text );
}


Utilities.inheritPrototype( Label, Game.Container );
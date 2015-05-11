function Area( args )
{
args.color = 'rgba(255, 255, 255, 0.2)';

Game.Rectangle.call( this, args );

var _this = this;

this.name = args.name;

this.addEventListener( 'mouseover', function()
    {
    Main.setAreaName( args.name );
    });
this.addEventListener( 'mouseout', function()
    {
    Main.setAreaName( '' );
    });
this.addEventListener( 'click', function( data )
    {
    var code = data.event.button;

    if ( code === Utilities.MOUSE_CODE.middle )
        {
        Main.removeElement( _this );
        }

    else if ( code === Utilities.MOUSE_CODE.left )
        {
        Main.selectElement( _this );
        }
    });
}

Utilities.inheritPrototype( Area, Game.Rectangle );
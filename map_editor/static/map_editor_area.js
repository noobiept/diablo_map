function Area( args )
{
args.color = 'rgba(255, 255, 255, 0.2)';

Game.Rectangle.call( this, args );

var _this = this;

this.addEventListener( 'mouseover', function()
    {
    MapEditor.setAreaName( args.name );
    });
this.addEventListener( 'mouseout', function()
    {
    MapEditor.setAreaName( '' );
    });
this.addEventListener( 'click', function( data )
    {
    var code = data.event.button;

    if ( code === Utilities.MOUSE_CODE.middle )
        {
        MapEditor.removeElement( _this );
        }

    else if ( code === Utilities.MOUSE_CODE.left )
        {
        MapEditor.selectElement( _this );
        }
    });
}

Utilities.inheritPrototype( Area, Game.Rectangle );
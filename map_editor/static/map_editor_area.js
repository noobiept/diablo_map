function Area( args )
{
Game.Container.call( this );

var _this = this;

var rect = new Game.Rectangle({
        width: args.width,
        height: args.height,
        color: 'rgba(255, 255, 255, 0.2)'
    });
rect.addEventListener( 'mouseover', function()
    {
    MapEditor.setAreaName( args.name );
    });
rect.addEventListener( 'mouseout', function()
    {
    MapEditor.setAreaName( '' );
    });
rect.addEventListener( 'click', function( data )
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

this.x = args.x;
this.y = args.y;
this.addChild( rect );
}

Utilities.inheritPrototype( Area, Game.Container );
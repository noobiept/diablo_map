function Area( args )
{
Game.Rectangle.call( this, args );

if ( args.is_map_editor === true )
    {
    var _this = this;

    this.color = 'rgba(255, 255, 255, 0.2)';
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

    // when its used in the main program
else
    {
    this.visible = false;
    }


this.name = args.name;
this.addEventListener( 'mouseover', function()
    {
    Main.setAreaName( args.name );
    });
this.addEventListener( 'mouseout', function()
    {
    Main.setAreaName( '' );
    });
}

Utilities.inheritPrototype( Area, Game.Rectangle );
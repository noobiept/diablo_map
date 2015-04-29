function Area( args )
{
Game.Rectangle.call( this, args );

this.visible = false;
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
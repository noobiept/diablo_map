/**
 * Isn't drawn (or have text), but can be clicked on to load a map.
 *
 * args = {
 *     x: number,
 *     y: number,
 *     width: number,
 *     height: number,
 *     destination: string,
 *     destinationLabel: string
 * };
 */
function InvisibleLabel( args )
{
Game.Rectangle.call( this, args );

this.visible = false;
this.addEventListener( 'click', function( data )
    {
    if ( args.destination )
        {
            // since Main.load() will remove elements, can't call this directly in the event handler (since its still processing the elements)
            // add to the loop to be called later
        Game.addToGameLoop( function()
            {
            Main.load( args.destination, args.destinationLabel );
            }, 0, false );
        }
    });
this.addEventListener( 'mouseover', function( data )
    {
    Main.changeCursor( true );
    });
this.addEventListener( 'mouseout', function( data )
    {
    Main.changeCursor( false );
    });
}

Utilities.inheritPrototype( InvisibleLabel, Game.Rectangle );
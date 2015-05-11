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
args.color = 'rgba(150, 150, 150, 0.5)';

Game.Rectangle.call( this, args );

var _this = this;

//this.visible = false;
this.addEventListener( 'click', function( data )
    {
    var code = data.event.button;

        // this won't trigger if the whole page isn't visible (middle clicking will turn into a drag movement)
    if ( code === Utilities.MOUSE_CODE.middle )
        {
        Main.removeElement( _this );
        }

    else if ( code === Utilities.MOUSE_CODE.left )
        {
        Main.selectElement( _this );
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

this.destination = args.destination;
this.destinationLabel = args.destinationLabel;
}

Utilities.inheritPrototype( InvisibleLabel, Game.Rectangle );
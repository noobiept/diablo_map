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


var click_f;
var _this = this;

    // when its used for the map editor
if ( args.is_map_editor === true )
    {
    this.color = 'rgba(255, 0, 0, 0.4)';

    click_f = function( data )
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
        };
    }

    // when its used in the main program
else
    {
    this.visible = false;

    click_f = function( data )
        {
        if ( args.destination )
            {
                // since Main.load() will remove elements, can't call this directly in the event handler (since its still processing the elements)
                // add to the loop to be called later
            Game.addToGameLoop( function()
                {
                Main.load( _this.destination, _this.destinationLabel );
                }, 0, false );
            }
        };
    }


this.destination = args.destination;
this.destinationLabel = args.destinationLabel;
this.addEventListener( 'click', click_f );
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
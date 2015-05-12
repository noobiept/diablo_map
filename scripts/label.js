function Label( info )
{
Game.Container.call( this );

var click_f;

    // when a label is used in the map editor, there's some differences (like the click callback, etc)
if ( info.is_map_editor === true )
    {
    var _this = this;

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

    this.imageId = info.imageId;
    this.text = info.text;
    this.id = info.id;
    this.destination = info.destination;
    this.destinationLabel = info.destinationLabel;
    }

    // when its used in the main program
else
    {
    click_f = function( data )
        {
        if ( info.destination )
            {
                // since Main.load() will remove elements, can't call this directly in the event handler (since its still processing the elements)
                // add to the loop to be called later
            Game.addToGameLoop( function()
                {
                Main.load( info.destination, info.destinationLabel );
                }, 0, false );
            }
        }
    }


var text = new Game.Text({
        y: 20,
        text: info.text,
        textAlign: 'center',
        fontFamily: '"Exocet Blizzard Light" serif',
        color: 'white'
    });
text.visible = false;

var image = new Game.Sprite({
        image: Game.Preload.get( 'elements' ),
        frameWidth: 30,
        frameHeight: 42
    });
image.setFrame( Label.SPRITE_POSITION[ info.imageId ] );
image.addEventListener( 'click', click_f );
image.addEventListener( 'mouseover', function( data )
    {
    Main.changeCursor( true );
    text.visible = true;
    });
image.addEventListener( 'mouseout', function( data )
    {
    Main.changeCursor( false );
    text.visible = false;
    });


this.x = info.x;
this.y = info.y;
this.addChild( image, text );
}

Utilities.inheritPrototype( Label, Game.Container );


Label.SPRITE_POSITION = {
        cave_exit: 0,
        waypoint: 1,
        wardrobe: 2,
        mystic: 3,
        book_of_cain: 4,
        nephalem_obelisk: 5,
        kadala: 6,
        cave_teleport: 7,
        cave_entrance: 8,
        merchant: 9,
        stash: 10,
        door: 11,
        healer: 12,
        jeweler: 13,
        blacksmith: 14
    };
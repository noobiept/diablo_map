function Label( info )
{
Game.Container.call( this );

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
image.addEventListener( 'click', function( data )
    {
        // since Main.load() will remove elements, can't call this directly in the event handler (since its still processing the elements)
        // add to the loop to be called later
    Game.addToGameLoop( function()
        {
        Main.load( info.destination, info.destinationLabel );
        }, 0, false );
    });
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
        cave_entrance: 7,
        merchant: 8,
        stash: 9,
        door: 10,
        healer: 11,
        jeweler: 12,
        blacksmith: 13
    };
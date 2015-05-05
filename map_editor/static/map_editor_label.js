function Label( info )
{
Game.Container.call( this );

var _this = this;

var text = new Game.Text({
        y: 20,
        text: info.text,
        textAlign: 'center',
        color: 'white'
    });
text.visible = false;

var image = new Game.Sprite({
        image: Game.Preload.get( 'elements' ),
        frameWidth: 30,
        frameHeight: 42
    });
image.setFrame( Label.SPRITE_POSITION[ info.image ] );
image.addEventListener( 'click', function( data )
    {
    var code = data.event.button;

        // this won't trigger if the whole page isn't visible (middle clicking will turn into a drag movement)
    if ( code === Utilities.MOUSE_CODE.middle )
        {
        MapEditor.removeElement( _this );
        }

    else if ( code === Utilities.MOUSE_CODE.left )
        {
        MapEditor.selectElement( _this );
        }
    });
image.addEventListener( 'mouseover', function( data )
    {
    MapEditor.changeCursor( true );
    text.visible = true;
    });
image.addEventListener( 'mouseout', function( data )
    {
    MapEditor.changeCursor( false );
    text.visible = false;
    });


this.imageId = info.image;
this.text = info.text;
this.id = info.id;
this.destination = info.destination;
this.destinationLabel = info.destinationLabel;

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
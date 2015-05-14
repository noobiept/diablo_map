var Main;
(function(Main) {


    // 'move' -- move the camera mode
    // 'drag' -- drag an element mode
    // 'remove' -- remove an element mode
    // 'resize' -- resize an area element mode
var POSSIBLE_MODES = [ 'Move', 'Drag', 'Remove', 'Resize' ];
var CURRENT_MODE = -1;
var ACTIVE_MODE_MENU;       // the menu element that selects the mode

var POSSIBLE_SELECT_TYPE = [ 'label', 'area' ];
var SELECT_ELEMENT_TYPE;    // the type of element that left clicking works on (if label, or area elements)

Main.MODES = Utilities.createEnum( POSSIBLE_MODES );

var IS_MESSAGE_OPENED = false;


/**
 * Create the map editor's menu
 */
Main.base_initMenu = Main.initMenu;
Main.initMenu = function()
{
Main.base_initMenu();

var menu = new Game.Html.HtmlContainer();

var addLabel = new Game.Html.Button({
        value: 'Add Label',
        callback: Main.openAddLabel
    });
var addInvisibleLabel = new Game.Html.Button({
        value: 'Add Invisible Label',
        callback: Main.openAddInvisibleLabel
    });
var addArea = new Game.Html.Button({
        value: 'Add Area',
        callback: Main.openAddArea
    });
ACTIVE_MODE_MENU = new Game.Html.MultipleOptions({
        preText: 'Mode:',
        options: POSSIBLE_MODES,
        callback: function( button, position, htmlElement )
            {
            Main.setCurrentMode( position );
            }
    });
SELECT_ELEMENT_TYPE = new Game.Html.MultipleOptions({
        preText: 'Select:',
        options: POSSIBLE_SELECT_TYPE
    });
var info = new Game.Html.Button({
        value: 'Info',
        callback: Main.showSelectedElementInfo
    });
var newMap = new Game.Html.Button({
        value: 'New Map',
        callback: Main.startNewMap
    });
var save = new Game.Html.Button({
        value: 'Save',
        callback: function()
            {
            var info = Main.getUpdatedMapInfo();
            Main.saveMap( info );
            }
    });
var load = new Game.Html.Button({
        value: 'Load',
        callback: Main.openLoadMessage
    });

menu.addChild( addLabel, addInvisibleLabel, addArea, ACTIVE_MODE_MENU, SELECT_ELEMENT_TYPE, info, newMap, save, load );

document.body.appendChild( menu.container );
};



Main.getCurrentMode = function()
{
return CURRENT_MODE;
};


Main.setCurrentMode = function( modeId )
{
if ( IS_MESSAGE_OPENED )
    {
    return;
    }

CURRENT_MODE = modeId;
ACTIVE_MODE_MENU.select( modeId );

Main.clearSelectedElement();
};


Main.getCurrentSelectType = function()
{
return SELECT_ELEMENT_TYPE.getValue();
};


Main.setCurrentSelectType = function( type )
{
if ( IS_MESSAGE_OPENED )
    {
    return;
    }

var position = POSSIBLE_SELECT_TYPE.indexOf( type );

if ( position >= 0 )
    {
    SELECT_ELEMENT_TYPE.select( position );
    }
};


Main.openAddLabel = function()
{
var container = Game.getCanvasContainer();
var canvas = Game.getCanvas();
var topLevelContainer = Main.getTopLevelContainer();
var scale = Main.getScale();

var x = (canvas.getWidth() / 2 - topLevelContainer.x) / scale;
var y = (canvas.getHeight() / 2 - topLevelContainer.y) / scale;

var type = new Game.Html.MultipleOptions({
        options: [ 'cave_exit', 'waypoint', 'wardrobe', 'mystic', 'book_of_cain', 'nephalem_obelisk', 'kadala', 'cave_teleport', 'cave_entrance', 'merchant', 'stash', 'door', 'healer', 'jeweler', 'blacksmith' ]
    });
var id = new Game.Html.Text({
        preText: 'Id:'
    });
var text = new Game.Html.Text({
        preText: 'Text:'
    });
var destinationId = new Game.Html.Text({
        preText: 'Destination Id:'
    });
var destinationLabel = new Game.Html.Text({
        preText: 'Destination Label:'
    });
var add = new Game.Html.Button({
        value: 'Add',
        callback: function()
            {
            var idValue = id.getValue();
            if ( Main.labelAlreadyExists( idValue ) )
                {
                new Game.Message({
                        body: "The 'id' given already exists.",
                        container: container,
                        background: true,
                        timeout: 2
                    });
                return;
                }

            Main.addLabel({
                id: idValue,
                x: Math.round( x ),
                y: Math.round( y ),
                imageId: type.getValue(),
                text: text.getValue(),
                destination: destinationId.getValue(),
                destinationLabel: destinationLabel.getValue()
            });

            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });

var message = new Game.Message({
        body: [ 'New Label', type, id, text, destinationId, destinationLabel ],
        container: container,
        background: true,
        buttons: [ add, close ]
    });
IS_MESSAGE_OPENED = true;
};


Main.openAddInvisibleLabel = function()
{
var container = Game.getCanvasContainer();
var canvas = Game.getCanvas();
var topLevelContainer = Main.getTopLevelContainer();
var scale = Main.getScale();

var x = (canvas.getWidth() / 2 - topLevelContainer.x) / scale;
var y = (canvas.getHeight() / 2 - topLevelContainer.y) / scale;

var destination = new Game.Html.Text({
        preText: 'Destination Id:'
    });
var destinationLabel = new Game.Html.Text({
        preText: 'Destination Label:'
    });

var add = new Game.Html.Button({
        value: 'Add',
        callback: function()
            {
            Main.addInvisibleLabel({
                x: Math.round( x ),
                y: Math.round( y ),
                width: 50,
                height: 50,
                destination: destination.getValue(),
                destinationLabel: destinationLabel.getValue()
            });

            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });

var message = new Game.Message({
        body: [ 'New Invisible Label', destination, destinationLabel ],
        container: container,
        background: true,
        buttons: [ add, close ]
    });
IS_MESSAGE_OPENED = true;
};


Main.openAddArea = function()
{
var container = Game.getCanvasContainer();
var canvas = Game.getCanvas();
var topLevelContainer = Main.getTopLevelContainer();
var scale = Main.getScale();

var x = (canvas.getWidth() / 2 - topLevelContainer.x) / scale;
var y = (canvas.getHeight() / 2 - topLevelContainer.y) / scale;

var name = new Game.Html.Text({
        preText: 'Area Name:'
    });

var add = new Game.Html.Button({
        value: 'Add',
        callback: function()
            {
            Main.addArea({
                x: Math.round( x ),
                y: Math.round( y ),
                width: 50,
                height: 50,
                name: name.getValue()
            });

            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });

var message = new Game.Message({
        body: [ 'New Area', name ],
        container: container,
        background: true,
        buttons: [ add, close ]
    });

IS_MESSAGE_OPENED = true;
};


Main.startNewMap = function()
{
var container = Game.getCanvasContainer();

var mapId = new Game.Html.Text({
        preText: 'Map Id:'
    });
var name = new Game.Html.Text({
        preText: 'Map Name:'
    });
var imageId = new Game.Html.Text({
        preText: 'Image Id:'
    });
var start = new Game.Html.Button({
        value: 'Start',
        callback: function()
            {
            var id = mapId.getValue();
            var info = {
                mapId: id,
                mapName: name.getValue(),
                imageId: imageId.getValue()
            };

            Main.addNewMap( info );
            Main.load( id );

            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });


var message = new Game.Message({
        body: [ 'New Map', mapId, name, imageId ],
        container: container,
        background: true,
        buttons: [ start, close ]
    });
IS_MESSAGE_OPENED = true;
};


Main.openLoadMessage = function()
{
var container = Game.getCanvasContainer();

var mapName = new Game.Html.Text({
        preText: 'Map Name:'
    });
var mapPosition = new Game.Html.Text({
        preText: 'Map Position:'
    });
var load = new Game.Html.Button({
        value: 'Load',
        callback: function()
            {
            Main.load( mapName.getValue(), mapPosition.getValue() );

            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });

var message = new Game.Message({
        body: [ 'Load Map', mapName, mapPosition ],
        container: container,
        background: true,
        buttons: [ load, close ]
    });
IS_MESSAGE_OPENED = true;
};


Main.isMessageOpened = function()
{
return IS_MESSAGE_OPENED;
};


Main.showSelectedElementInfo = function()
{
if ( IS_MESSAGE_OPENED )
    {
    return;
    }

var text = [];
var container = Game.getCanvasContainer();
var selected = Main.getSelectedElement();

if ( selected )
    {
    if ( selected instanceof Label )
        {
        text[ 0 ] = 'type: Label';
        text[ 1 ] = 'id: ' + selected.id;
        text[ 2 ] = 'image id: ' + selected.imageId;
        text[ 3 ] = 'text: ' + selected.text;
        text[ 4 ] = 'destination: ' + selected.destination;
        text[ 5 ] = 'destination label: ' + selected.destinationLabel;
        }

    else if ( selected instanceof InvisibleLabel )
        {
        text[ 0 ] = 'type: Invisible Label';
        text[ 1 ] = 'destination: ' + selected.destination;
        text[ 2 ] = 'destination label: ' + selected.destinationLabel;
        }

    else if ( selected instanceof Area )
        {
        text[ 0 ] = 'type: Area';
        text[ 1 ] = 'name: ' + selected.name;
        }

    else
        {
        text[ 0 ] = 'Error.';
        }
    }

else
    {
    text = 'No element selected.'
    }

var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            IS_MESSAGE_OPENED = false;
            message.clear();
            }
    });

var message = new Game.Message({
        body: text,
        container: container,
        background: true,
        buttons: close
    });
IS_MESSAGE_OPENED = true;
};


})(Main || (Main = {}));
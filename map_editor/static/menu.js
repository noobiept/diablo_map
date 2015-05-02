var MapEditor;
(function(MapEditor) {


    // 'move' -- move the camera mode
    // 'drag' -- drag an element mode
    // 'remove' -- remove an element mode
    // 'resize' -- resize an area element mode
var POSSIBLE_MODES = [ 'Move', 'Drag', 'Remove', 'Resize' ];
var CURRENT_MODE = -1;

MapEditor.MODES = Utilities.createEnum( POSSIBLE_MODES );

var FILE_NAME;  // element in the menu, which shows the current file name

/**
 * Create the map editor's menu
 */
MapEditor.initMenu = function()
{
var menu = new Game.Html.HtmlContainer();

var scale = new Game.Html.Range({
        min: 0.4,
        max: 2,
        value: 1,
        step: 0.2,
        preText: 'Scale',
        onChange: function( button )
            {
            MapEditor.changeScale( button.getValue() );
            }
    });

var recenter = new Game.Html.Button({
        value: 'Recenter',
        callback: MapEditor.reCenterCamera
    });

var addLabel = new Game.Html.Button({
        value: 'Add Label',
        callback: MapEditor.openAddLabel
    });

var addArea = new Game.Html.Button({
        value: 'Add Area',
        callback: MapEditor.openAddArea
    });

var activeMode = new Game.Html.MultipleOptions({
        preText: 'Mode:',
        options: POSSIBLE_MODES,
        callback: function( button, position, htmlElement )
            {
            CURRENT_MODE = position;

            MapEditor.clearSelectedElement();
            }
    });

var newMap = new Game.Html.Button({
        value: 'New Map',
        callback: MapEditor.startNewMap
    });

var save = new Game.Html.Button({
        value: 'Save',
        callback: function()
            {
            var info = MapEditor.getUpdatedMapInfo();
            MapEditor.saveMap( info );
            }
    });

var load = new Game.Html.Button({
        value: 'Load',
        callback: MapEditor.openLoadMessage
    });

menu.addChild( scale, recenter, addLabel, addArea, activeMode, newMap, save, load );


document.body.appendChild( menu.container );
};



MapEditor.getCurrentMode = function()
{
return CURRENT_MODE;
};


MapEditor.openAddLabel = function()
{
var container = Game.getCanvasContainer();
var canvas = Game.getCanvas();
var topLevelContainer = MapEditor.getTopLevelContainer();
var scale = MapEditor.getScale();

var x = (canvas.getWidth() / 2 - topLevelContainer.x) / scale;
var y = (canvas.getHeight() / 2 - topLevelContainer.y) / scale;

var type = new Game.Html.MultipleOptions({
        options: [ 'cave_entrance', 'cave_exit' ]
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
            MapEditor.addLabel(
                Math.round( x ),
                Math.round( y ),
                type.getValue(),
                id.getValue(),
                text.getValue(),
                destinationId.getValue(),
                destinationLabel.getValue()
            );

            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            message.clear();
            }
    });

var message = new Game.Message({
        body: [ 'New Label', type, id, text, destinationId, destinationLabel ],
        container: container,
        background: true,
        buttons: [ add, close ]
    });
};


MapEditor.openAddArea = function()
{
var container = Game.getCanvasContainer();
var canvas = Game.getCanvas();
var topLevelContainer = MapEditor.getTopLevelContainer();
var scale = MapEditor.getScale();

var x = (canvas.getWidth() / 2 - topLevelContainer.x) / scale;
var y = (canvas.getHeight() / 2 - topLevelContainer.y) / scale;

var name = new Game.Html.Text({
        preText: 'Area Name:'
    });

var add = new Game.Html.Button({
        value: 'Add',
        callback: function()
            {
            MapEditor.addArea(
                Math.round( x ),
                Math.round( y ),
                50,
                50,
                name.getValue()
            );

            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            message.clear();
            }
    });

var message = new Game.Message({
        body: [ 'New Area', name ],
        container: container,
        background: true,
        buttons: [ add, close ]
    });
};


MapEditor.startNewMap = function()
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

            MapEditor.addNewMap( info );
            MapEditor.load( id );
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            message.clear();
            }
    });


var message = new Game.Message({
        body: [ 'New Map', mapId, name, imageId ],
        container: container,
        background: true,
        buttons: [ start, close ]
    });
};


MapEditor.openLoadMessage = function()
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
            MapEditor.load( mapName.getValue(), mapPosition.getValue() );
            message.clear();
            }
    });
var close = new Game.Html.Button({
        value: 'Close',
        callback: function()
            {
            message.clear();
            }
    });


var message = new Game.Message({
        body: [ 'Load Map', mapName, mapPosition ],
        container: container,
        background: true,
        buttons: [ load, close ]
    });
};


})(MapEditor || (MapEditor = {}));
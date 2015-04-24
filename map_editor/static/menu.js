var MapEditor;
(function(MapEditor) {


    // 'move' -- move the camera mode
    // 'drag' -- drag a label mode
    // 'remove' -- remove a label mode
var POSSIBLE_MODES = [ 'Move', 'Drag', 'Remove' ];
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

var activeMode = new Game.Html.MultipleOptions({
        preText: 'Mode:',
        options: POSSIBLE_MODES,
        callback: function( button, position, htmlElement )
            {
            CURRENT_MODE = position;
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
            var info = MapEditor.constructMapInfo();
            MapEditor.saveMap( info );
            }
    });

var load = new Game.Html.Button({
        value: 'Load',
        callback: MapEditor.openLoadMessage
    });

FILE_NAME = new Game.Html.Value({ value: '' });

menu.addChild( scale, recenter, addLabel, activeMode, newMap, save, load, FILE_NAME );


document.body.appendChild( menu.container );
};


MapEditor.setFileName = function( name )
{
FILE_NAME.setValue( name );
};


MapEditor.getFileName = function()
{
return FILE_NAME.getValue();
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
                x,
                y,
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
        text: 'New Label',
        container: container,
        background: true,
        buttons: [ type, id, text, destinationId, destinationLabel, add, close ]
    });
};


MapEditor.startNewMap = function()
{
var container = Game.getCanvasContainer();

var fileName = new Game.Html.Text({
        preText: 'File Name:'
    });
var name = new Game.Html.Text({
        preText: 'Map Name:'
    });
var image = new Game.Html.Text({
        preText: 'Image Id:'
    });
var start = new Game.Html.Button({
        value: 'Start',
        callback: function()
            {
            var info = {
                fileName: fileName.getValue(),
                mapName: name.getValue(),
                imageId: image.getValue()
            };

            MapEditor.load( info );
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
        text: 'New Map',
        container: container,
        background: true,
        buttons: [ fileName, name, image, start, close ]
    });
};


MapEditor.openLoadMessage = function()
{
var container = Game.getCanvasContainer();

var fileName = new Game.Html.Text({
        preText: 'File Name:'
    });
var load = new Game.Html.Button({
        value: 'Load',
        callback: function()
            {
            MapEditor.loadMap( fileName.getValue() );
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
        text: 'Load Map',
        container: container,
        background: true,
        buttons: [ fileName, load, close ]
    });
};


})(MapEditor || (MapEditor = {}));
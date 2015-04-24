var MapEditor;
(function(MapEditor) {


MapEditor.initMenu = function()
{
    //HERE
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
var text = new Game.Html.Text({
        preText: 'Text:'
    });
var destinationId = new Game.Html.Text({
        preText: 'Destination Id:'
    });
var add = new Game.Html.Button({
        value: 'Add',
        callback: function()
            {
            MapEditor.addLabel( x, y, text.getValue(), type.getValue() );

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
        buttons: [ type, text, destinationId, add, close ]
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
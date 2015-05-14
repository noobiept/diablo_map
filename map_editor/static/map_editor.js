window.onload = function()
{
Main.initialInit();
Main.loadAssets( '/static/', function()
    {
    Main.mapEditorInit();
    });
};



var Main;
(function(Main) {


var SELECTED_ELEMENT = null;
var BASIC_INFO = {};
var LABELS = [];    // all the label elements
var INVISIBLE_LABELS = [];  // all the invisible label elements
var AREAS = [];     // all the area elements
var CURRENT_MAP_ID = '';  // id of the current map that is loaded


Main.mapEditorInit = function()
{
var canvas = Game.getCanvas();
var canvasHtmlElement = canvas.getHtmlCanvasElement();
var container = Main.getTopLevelContainer();
var canvasContainer = Game.getCanvasContainer();


canvasContainer.addEventListener( 'mousemove', function( event )
    {
    var currentX = event.clientX;
    var currentY = event.clientY;
    var currentMode = Main.getCurrentMode();
    var scale = Main.getScale();

        // the drag of the elements
    if ( currentMode === Main.MODES.Drag )
        {
        if ( SELECTED_ELEMENT )
            {
            var rect = canvasHtmlElement.getBoundingClientRect();

            var x = (currentX - rect.left - container.x) / scale;
            var y = (currentY - rect.top - container.y) / scale;

            SELECTED_ELEMENT.x = Math.round( x );
            SELECTED_ELEMENT.y = Math.round( y );
            }
        }
    });
canvasContainer.addEventListener( 'mouseup', function( event )
    {
        // remove a label on click (if its on remove mode)
    if ( Main.getCurrentMode() === Main.MODES.Remove )
        {
        var rect = canvasHtmlElement.getBoundingClientRect();

        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        Main.removeElement2( mouseX, mouseY );
        }
    });
document.body.addEventListener( 'keyup', function( event )
    {
    var key = event.keyCode;
    var currentMode = Main.getCurrentMode();

        // global shortcuts
    switch( key )
        {
            // map editor specific shortcuts
        case Utilities.KEY_CODE.z:
            Main.setCurrentMode( Main.MODES.Move );
            break;

        case Utilities.KEY_CODE.x:
            Main.setCurrentMode( Main.MODES.Drag );
            break;

        case Utilities.KEY_CODE.c:
            Main.setCurrentMode( Main.MODES.Remove );
            break;

        case Utilities.KEY_CODE.v:
            Main.setCurrentMode( Main.MODES.Resize );
            break;

        case Utilities.KEY_CODE.b:
            Main.setCurrentSelectType( 'label' );
            break;

        case Utilities.KEY_CODE.n:
            Main.setCurrentSelectType( 'area' );
            break;

        case Utilities.KEY_CODE.i:
            Main.showSelectedElementInfo();
            break;
        }


        // resize mode specific shortcuts
    if ( currentMode === Main.MODES.Resize && SELECTED_ELEMENT )
        {
        var step = 5;
        var width = SELECTED_ELEMENT.getWidth();
        var height = SELECTED_ELEMENT.getHeight();

        switch( key )
            {
            case Utilities.KEY_CODE.leftArrow:
                SELECTED_ELEMENT.setWidth( width - step );
                break;

            case Utilities.KEY_CODE.rightArrow:
                SELECTED_ELEMENT.setWidth( width + step );
                break;

            case Utilities.KEY_CODE.upArrow:
                SELECTED_ELEMENT.setHeight( height - step );
                break;

            case Utilities.KEY_CODE.downArrow:
                SELECTED_ELEMENT.setHeight( height + step );
                break;
            }
        }
    });
};


Main.base_load = Main.load;
Main.load = function( mapId, mapPosition )
{
Main.base_load( mapId, mapPosition );

var mapInfo = Main.getMapsInfo()[ mapId ];

CURRENT_MAP_ID = mapId;
BASIC_INFO = {
        imageId: mapInfo.imageId,
        mapName: mapInfo.mapName
    };

Main.saveMapName( mapId, mapPosition );
};



Main.getUpdatedMapInfo = function()
{
var mapInfo = Utilities.deepClone( BASIC_INFO );
var a;

    // add the labels
mapInfo.labels = {};

for (a = LABELS.length - 1 ; a >= 0 ; a--)
    {
    var label = LABELS[ a ];

    mapInfo.labels[ label.id ] = {
            text: label.text,
            imageId: label.imageId,
            x: label.x,
            y: label.y,
            destination: label.destination,
            destinationLabel: label.destinationLabel
        };
    }


    // add the invisible labels
mapInfo.invisible_labels = [];

for (a = INVISIBLE_LABELS.length - 1 ; a >= 0 ; a--)
    {
    var invisibleLabel = INVISIBLE_LABELS[ a ];

    mapInfo.invisible_labels.push({
            x: invisibleLabel.x,
            y: invisibleLabel.y,
            width: invisibleLabel.getWidth(),
            height: invisibleLabel.getHeight(),
            destination: invisibleLabel.destination,
            destinationLabel: invisibleLabel.destinationLabel
        });
    }


    // add the areas
mapInfo.areas = [];

for (a = AREAS.length - 1 ; a >= 0 ; a--)
    {
    var area = AREAS[ a ];

    mapInfo.areas.push({
            x: area.x,
            y: area.y,
            width: area.getWidth(),
            height: area.getHeight(),
            name: area.name
        });
    }


var mapsInfo = Main.getMapsInfo();

mapsInfo[ CURRENT_MAP_ID ] = mapInfo;

return mapsInfo;
};


Main.changeCursor = function( mouseOver )
{
if ( mouseOver === true )
    {
    document.body.style.cursor = 'pointer';
    }

else
    {
    document.body.style.cursor = 'default';
    }
};


Main.base_clear = Main.clear;
Main.clear = function()
{
Main.base_clear();

LABELS.length = 0;
INVISIBLE_LABELS.length = 0;
AREAS.length = 0;
};



Main.addNewMap = function( info )
{
var mapsInfo = Main.getMapsInfo();

mapsInfo[ info.mapId ] = {
        imageId: info.imageId,
        mapName: info.mapName
    };

Main.setMapsInfo( mapsInfo );
};


Main.base_addLabel = Main.addLabel;
Main.addLabel = function( args )
{
args.is_map_editor = true;

var label = Main.base_addLabel( args );

LABELS.push( label );
};


Main.base_addInvisibleLabel = Main.addInvisibleLabel;
Main.addInvisibleLabel = function( args )
{
args.is_map_editor = true;

var invisibleLabel = Main.base_addInvisibleLabel( args );

INVISIBLE_LABELS.push( invisibleLabel );
};



Main.base_addArea = Main.addArea;
Main.addArea = function( args )
{
args.is_map_editor = true;

var area = Main.base_addArea( args );

AREAS.push( area );
};




/**
 * Remove an element from the current map.
 */
Main.removeElement = function( element )
{
if ( !Main.isOffSelectType( element ) ||
     Main.isMessageOpened() )
    {
    return;
    }

var position;
var array;

if ( element instanceof Label )
    {
    array = LABELS;
    }

else if ( element instanceof InvisibleLabel )
    {
    array = INVISIBLE_LABELS;
    }

else
    {
    array = AREAS;
    }


position = array.indexOf( element );

array.splice( position, 1 );

element.remove();
};


/**
 * Remove an element, given a x/y position. It searches in all the element types (labels/invisible labels/areas).
 */
Main.removeElement2 = function( x, y )
{
if ( Main.isMessageOpened() )
    {
    return;
    }

var arrays = [ LABELS, INVISIBLE_LABELS, AREAS ];

for (var a = 0 ; a < arrays.length ; a++)
    {
    if ( Main.removeElement3( x, y, arrays[ a ] ) )
        {
        return true;
        }
    }

return false;
};


/**
 * Remove an element, from a given x/y position and an array of the elements to search in.
 */
Main.removeElement3 = function( x, y, array )
{
for (var a = array.length - 1 ; a >= 0 ; a--)
    {
    var element = array[ a ];
    var elements = element.intersect( x, y );

    if ( !Main.isOffSelectType( element ) )
        {
        return;
        }


    if ( elements.length > 0 )
        {
        array.splice( a, 1 );

        element.remove();
        return true;
        }
    }

return false;
};


/**
 * Marks a label as selected. If the label given was already the one selected, and we deselect it.
 */
Main.selectElement = function( element )
{
if ( !Main.isOffSelectType( element ) ||
     Main.isMessageOpened() )
    {
    return;
    }


if ( SELECTED_ELEMENT === element )
    {
    SELECTED_ELEMENT = null;
    }

else
    {
    SELECTED_ELEMENT = element;
    }
};


Main.clearSelectedElement = function()
{
SELECTED_ELEMENT = null;
};


Main.isOffSelectType = function( element )
{
var currentSelectableType = Main.getCurrentSelectType();

    // not off the current selected type
if ( currentSelectableType === 'area' && !(element instanceof Area) ||
     currentSelectableType === 'label' && (element instanceof Area) )
    {
    return false;
    }

return true;
};


Main.labelAlreadyExists = function( id )
{
for (var a = LABELS.length - 1 ; a >= 0 ; a--)
    {
    if ( LABELS[ a ].id === id )
        {
        return true;
        }
    }

return false;
};


Main.getSelectedElement = function()
{
return SELECTED_ELEMENT;
};


})(Main || (Main = {}));
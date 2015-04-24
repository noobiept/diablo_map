var MapEditor;
(function(MapEditor) {


MapEditor.loadMap = function( name )
{
var container = Game.getCanvasContainer();

if ( name === '' )
    {
    new Game.Message({
            text: 'Need to specify the map name.',
            container: container,
            timeout: 2
        });
    return;
    }


var formData = new FormData();

formData.append( 'name', name );

    // make the request to the server
var request = new XMLHttpRequest();

request.open( 'POST', 'http://localhost:8000/load' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                text: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        MapEditor.clearSavedFileName();

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        var info = JSON.parse( this.responseText );

        MapEditor.load( info );
        }
    };
request.send( formData );
};


MapEditor.saveMap = function()
{
    // name of the map
var container = Game.getCanvasContainer();
var mapInfo = MapEditor.getMapInfo();

var dataStr = JSON.stringify( mapInfo, null, 4 );

var formData = new FormData();

formData.append( 'name', mapInfo.fileName );
formData.append( 'data', dataStr );

var request = new XMLHttpRequest();

request.open( 'POST', 'http://localhost:8000/save' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                text: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        new Game.Message({
                text: 'Saved',
                container: container,
                timeout: 2
            });
        }
    };
request.send( formData );
};


/**
 * Save the previously saved file name, so that the next time the program is run, we can load it.
 */
MapEditor.saveFileName = function( fileName )
{
localStorage.setItem( 'diablo_map_previous_map', fileName );
};


MapEditor.getSavedFileName = function()
{
return localStorage.getItem( 'diablo_map_previous_map' );
};


MapEditor.clearSavedFileName = function()
{
localStorage.removeItem( 'diablo_map_previous_map' );
};


})(MapEditor || (MapEditor = {}));
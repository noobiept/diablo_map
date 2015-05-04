var MapEditor;
(function(MapEditor) {


MapEditor.loadMapsInfo = function()
{
var container = Game.getCanvasContainer();
var formData = new FormData();

    // make the request to the server
var request = new XMLHttpRequest();

request.open( 'GET', 'http://localhost:8000/load' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                body: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        MapEditor.clearSavedMapName();

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        var info = JSON.parse( this.responseText );

        MapEditor.setMapsInfo( info );

        var mapName = MapEditor.getSavedMapName();
        var mapPosition = MapEditor.getSavedMapPosition();

        if ( mapName )
            {
            MapEditor.load( mapName, mapPosition );
            }
        }
    };
request.send( formData );
};


MapEditor.saveMap = function( mapInfo )
{
    // name of the map
var container = Game.getCanvasContainer();

var dataStr = JSON.stringify( mapInfo, null, 4 );

var formData = new FormData();
formData.append( 'data', dataStr );


var request = new XMLHttpRequest();

request.open( 'POST', 'http://localhost:8000/save' );
request.onload = function()
    {
    if ( this.status !== 200 )
        {
        new Game.Message({
                body: 'Error. Failed to save.',
                container: container,
                timeout: 2
            });

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        new Game.Message({
                body: 'Saved',
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
MapEditor.saveMapName = function( mapName, mapPosition )
{
if ( typeof mapPosition === 'undefined' )
    {
    mapPosition = '';
    }

localStorage.setItem( 'diablo_map_previous_map', mapName );
localStorage.setItem( 'diablo_map_previous_map_position', mapPosition );
};


MapEditor.getSavedMapName = function()
{
return localStorage.getItem( 'diablo_map_previous_map' );
};


MapEditor.getSavedMapPosition = function()
{
return localStorage.getItem( 'diablo_map_previous_map_position' );
};


MapEditor.clearSavedMapName = function()
{
localStorage.removeItem( 'diablo_map_previous_map' );
localStorage.removeItem( 'diablo_map_previous_map_position' );
};


})(MapEditor || (MapEditor = {}));
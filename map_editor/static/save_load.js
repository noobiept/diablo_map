var Main;
(function(Main) {


Main.loadMapsInfo = function()
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

        Main.clearSavedMapName();

        console.log( this.status );
        console.log( this.responseText );
        }

    else
        {
        var info = JSON.parse( this.responseText );

        Main.setMapsInfo( info );

        var mapName = Main.getSavedMapName();
        var mapPosition = Main.getSavedMapPosition();

        if ( mapName )
            {
            Main.load( mapName, mapPosition );
            }
        }
    };
request.send( formData );
};


Main.saveMap = function( mapInfo )
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
Main.saveMapName = function( mapName, mapPosition )
{
if ( typeof mapPosition === 'undefined' )
    {
    mapPosition = '';
    }

localStorage.setItem( 'diablo_map_previous_map', mapName );
localStorage.setItem( 'diablo_map_previous_map_position', mapPosition );
};


Main.getSavedMapName = function()
{
return localStorage.getItem( 'diablo_map_previous_map' );
};


Main.getSavedMapPosition = function()
{
return localStorage.getItem( 'diablo_map_previous_map_position' );
};


Main.clearSavedMapName = function()
{
localStorage.removeItem( 'diablo_map_previous_map' );
localStorage.removeItem( 'diablo_map_previous_map_position' );
};


})(Main || (Main = {}));
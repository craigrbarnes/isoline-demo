const canvas = document.getElementById('map');
const map = new harp.MapView({
   canvas,
   theme: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json",
   //For tile cache optimization:
   maxVisibleDataSourceTiles: 40, 
   tileCacheSize: 100
});

map.setCameraGeolocationAndZoom(
   new harp.GeoCoordinates(41.8889103,-87.6365736),
   16
);

const mapControls = new harp.MapControls(map);
const ui = new harp.MapControlsUI(mapControls);
canvas.parentElement.appendChild(ui.domElement);

mapControls.maxPitchAngle = 75;
mapControls.setRotation(6.3, 50);

map.resize(window.innerWidth, window.innerHeight);
window.onresize = () => map.resize(window.innerWidth, window.innerHeight);

const omvDataSource = new harp.OmvDataSource({
   baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
   apiFormat: harp.APIFormat.XYZOMV,
   styleSetName: "tilezen",
   authenticationCode: 'ADzyeEu3zoVRneqtP2vTnto',
});
map.addDataSource(omvDataSource);

let url = 'https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?app_id=wq8WzMlUQ8Eqr95STMJQ&app_code=1aWy4m5Eq4bi1jWF2UxgVQ&mode=shortest;car;traffic:disabled&start=geo!41.8889103,-87.6365736&range=1000&rangetype=distance';

//  fetch(url)
//    .then(response => response.json())
//    .then(data => {
//        return { 
//         type: "FeatureCollection", "features": [   
//         {
//         type : "Feature", geometry: { type:"Polygon", coordinates : [ data.response.isoline[0].component[0].shape.map(function(e) {
//            return e.split(",").map(d => parseFloat(d)).reverse();
//        }).reverse() ]
//        } , properties: { id: data.response.isoline[0].component[0].id }} ] };
//     }
// ).then(data => {
//     const isoline_polygon = data;
//     const geoJsonDataProvider = new harp.GeoJsonDataProvider("iso-line", data);
//     const geoJsonDataSource = new harp.OmvDataSource({
//        dataProvider: geoJsonDataProvider,
//        name: "iso-line"
//     });

//     map.addDataSource(geoJsonDataSource).then(() => {
//         const styles = [{
//            "when": "$geometryType ^= 'polygon'",
//            "renderOrder": 1000,
//            "technique": "fill",
//            "attr": {
//               "color": "#D73060",
//               "transparent": true,
//               "opacity": 1,
//            }
//         }]
     
//         geoJsonDataSource.setStyleSet(styles);
//         map.update();
        
//     } );
//  });


var isoline =  fetch(url)
   .then(response => response.json())
   .then(data => {
       return { 
        type: "FeatureCollection", "features": [   
        {
        type : "Feature", geometry: { type:"Polygon", coordinates : [ data.response.isoline[0].component[0].shape.map(function(e) {
           return e.split(",").map(d => parseFloat(d)).reverse();
       }).reverse() ]
       } , properties: { id: data.response.isoline[0].component[0].id }} ] };
    }
);
isoline.then(data => {
 
    const geoJsonDataProvider = new harp.GeoJsonDataProvider("iso-line", data);
    const geoJsonDataSource = new harp.OmvDataSource({
       dataProvider: geoJsonDataProvider,
       name: "iso-line"
    });



    map.addDataSource(geoJsonDataSource).then(() => {
        const styles = [{
           "when": "$geometryType ^= 'polygon'",
           "renderOrder": 1000,
           "technique": "fill",
           "attr": {
              "color": "#D73060",
              "transparent": true,
              "opacity": 1,
           }
        }]
     
        geoJsonDataSource.setStyleSet(styles);
        map.update();
        
    } );
});
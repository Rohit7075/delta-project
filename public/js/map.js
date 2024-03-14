

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = MapAccessToken
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style:"mapbox://styles/mapbox/streets-v12",
      center: listing.geometry.coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
  });



  const marker= new mapboxgl.Marker()
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset:25})
  
  .setHTML("<h1>Hello World!</h1>")
)
 .addTo(map) 
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

const marker1 = new mapboxgl.Marker()
  .setLngLat(camp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${camp.Name}</h3>`
    )
  )
  .addTo(map);

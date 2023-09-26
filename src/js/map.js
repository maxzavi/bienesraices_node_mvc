(function() {
    const lat = -12.0466716;
    const lng = -77.0310093;
    const zoom=13;
    let marker;
    const map = L.map('map').setView([lat, lng ], zoom);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    }).addTo(map)

    marker.on('moveend', function(e){
        marker=e.target

        const position= marker.getLatLng();

        console.log(position);
        map.panTo(new L.LatLng(position.lat, position.lng))
    })
})()
(function() {
    const lat = document.querySelector('#lat').value || -12.0466716;
    const lng = document.querySelector('#lng').value || -77.0310093;
    const zoom=13;
    let marker;
    const map = L.map('map').setView([lat, lng ], zoom);

    const geocodeService = L.esri.Geocoding.geocodeService();
    

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
        map.panTo(new L.LatLng(position.lat, position.lng))
        // Get address info
        geocodeService.reverse().latlng(position,13).run(function(err, result){
            marker.bindPopup(result.address.LongLabel)
            document.querySelector('.street').textContent= result?.address?.Address ?? ''
            document.querySelector('#street').value= result?.address?.Address ?? ''
            document.querySelector('#lat').value= result?.latlng?.lat ?? ''
            document.querySelector('#lng').value= result?.latlng?.lng ?? ''
        })
    })
})()
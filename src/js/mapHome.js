(function() {
    const lat = -12.0466716;
    const lng = -77.0310093;
    const map = L.map('map-home').setView([lat, lng ], 13);
    let markers = new L.FeatureGroup().addTo(map)
    let properties = []
    const filters={
        category:'',
        price:''
    }
    const categoriesSelect = document.querySelector('#categories')
    const pricesSelect = document.querySelector('#prices')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //Filter by category and price
    categoriesSelect.addEventListener('change',e=>{
        filters.category= +e.target.value
        filterProperties()
    })

    pricesSelect.addEventListener('change',e=>{
        filters.price= +e.target.value
        filterProperties()
    })

    const getProperties = async ()=>{
        const url ="/api/properties"
        try {
            const result = await fetch(url)
            properties = await result.json()
            showProperties(properties)
        } catch (error) {
            console.log(error);
        }
    }

    const showProperties = (properties)=>{
        markers.clearLayers()
        properties.forEach(property=>{
            const marker = new L.marker([property?.lat, property?.lng],{
                autoPan: true
            }).addTo(map)
            .bindPopup(`
                <p class="text-indigo-700 font-bold">${property.category.name}</p>
                <h1 class="text-xl font-extrabold uppercase my-2" >${property?.title}</h1>
                <img src="/uploads/${property.image}" alt="Imagen de la propiedad ${property.title}">
                <p class="text-gray-700 font-bold">${property.price.name}</p>
                <a href="/property/${property?.id}" class="bg-indigo-400 block p-2 text-center font-bold uppercase text-white" >Ver propiedad</a>
            `)

            markers.addLayer(marker)
        })
    }
    const filterProperties = ()=>{
        const result = properties.filter(filterCategory).filter(filterPrice)
        showProperties(result)
    }

    const filterCategory = property => filters.category ? property.categoryId === filters.category : property
    const filterPrice = price => filters.price ? price.priceId === filters.price : price
    getProperties()
})()
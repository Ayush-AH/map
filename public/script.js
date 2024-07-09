const socket = io()


if(navigator.geolocation){
    navigator.geolocation.watchPosition(function(position){
        let {latitude,longitude } = position.coords
        socket.emit("send-location",{latitude,longitude})
    },
    function(err){
        console.error(err)
    },{
        enableHighAccuracy:true,
        maximumAge:false,
        timeout:5000
    }
)
}

const map = L.map("map").setView([0,0],16)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "sheryians coding school"
}).addTo(map)

const markers = {} 
socket.on("receive-location",function(data){
    let {id , latitude  ,longitude} = data
    map.setView([latitude,longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})


socket.on("user-disconnected",function(id){
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})
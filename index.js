var map=L.map('map');
var submitbtn=document.getElementById('submit');
submitbtn.addEventListener('click',main);
window.addEventListener('keyup',(e)=>{
    if(e.key=="Enter"){
        main();
    }
})

function main(){
    var ipaddress=document.getElementById('ip').value;
    if(validateIP(ipaddress)){
        document.querySelector('#arrow').style.display="none";
        document.querySelector('#loading').style.display="inline";
        performRequest(ipaddress);
    }else{
        if(!document.body.contains(document.querySelector('.error'))){
            createErrorMessage();
            setTimeout(()=>{
              removeErrorMessage();  
            },2000)
        }
    }
}

function validateIP(ipaddress){
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress);
}

function createErrorMessage(){
    var error=document.createElement('span');
    error.classList.add('error');
    var text=document.createTextNode('Invalid IP Address !');
    error.appendChild(text);
    document.body.appendChild(error);
}
function removeErrorMessage(){
    var error=document.querySelector('.error');
    error.style.opacity="0";
    document.body.removeChild(document.querySelector('.error'));
}
function performRequest(ipaddress){
    fetch('https://geo.ipify.org/api/v1?apiKey=at_fJoivDTTTOtl9rlPGI5p4Nx6DCE8J&ipAddress='+ipaddress)
    .then((res)=>{
        document.querySelector('#arrow').style.display="inline";
        document.querySelector('#loading').style.display="none";
        return res.json();
    })
    .then((data)=>{
        var ipaddress=data.ip;
        var location=data.location.city+" "+data.location.region+", "+data.location.country;
        var timezone="UTC "+data.location.timezone;
        var isp=data.isp;
        console.log(data);
        renderData(ipaddress,location,timezone,isp);
        renderMap(data.location.lat,data.location.lng);
    })
    .catch((error)=>{
        alert("No network");
        document.querySelector('#arrow').style.display="inline";
        document.querySelector('#loading').style.display="none";
    });
}
function renderData(ipaddress,location,timezone,ISP){
    var ip=document.querySelector('#ipaddress');
    var loc=document.querySelector('#location');
    var tz=document.querySelector('#timezone');
    var isp=document.querySelector('#isp');

    ip.innerText=ipaddress;
    loc.innerText=location;
    tz.innerText=timezone;
    isp.innerText=ISP;
}
function renderMap(lat,lng){
    if(document.getElementById('map').contains(document.getElementById('unloadimg'))){
        document.getElementById('map').removeChild(document.getElementById('unloadimg'))
    }
    // var map=L.map('map',{
    //     center:[lat,lng]
    // });
    map.setView([lat, lng],13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2aW5sdW8iLCJhIjoiY2tjZXI4dG95MGI3NDJycWdrNGJtcGN2eSJ9.kpNtaIJuFhWCXWOM4XGabg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWx2aW5sdW8iLCJhIjoiY2tjZXI4dG95MGI3NDJycWdrNGJtcGN2eSJ9.kpNtaIJuFhWCXWOM4XGabg'
    }).addTo(map);
    var marker = L.marker([lat, lng]).addTo(map);
}
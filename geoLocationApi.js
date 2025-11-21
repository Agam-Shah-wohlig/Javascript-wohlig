
const btn = document.getElementById('get-location-btn')


async function getWheather(lat, lon){
    const promise = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=262a1aaa0b4f41228f2122908252111&q=${lat},${lon}&aqi=no`
    );
    return await promise.json();
}

async function gotlocation(position) {
    const wheatherDetails = await getWheather(position.coords.latitude, position.coords.longitude);
    console.log(wheatherDetails)
}

function failedToGetLoc() {
    console.Error("Error in Getting the Location!")
}

btn.addEventListener('click', async () => {

    navigator.geolocation.getCurrentPosition(gotlocation, failedToGetLoc)
})


                    
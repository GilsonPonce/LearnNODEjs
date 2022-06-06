const fs = require('fs');
const axios =  require('axios');

class Busquedas{
    historial = [];
    dbPath = './db/database.json'

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p=> p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });
    }

    get paramsMapbox(){
        return {
            'proximity':'ip',
            'types':'place',
            'access_token':process.env.MAPBOX_KEY
        }
    }

    get paramsOpenWeather(){
        return {
            'units':'metric',
            'lang': 'es',
            'appid':process.env.OPENWEATHER_KEY
        }
    }

    async ciudad(lugar = ''){
        try{
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map(lugar=> ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        }catch(error){
            console.log('error en la peticion',error)
            return [];
        }
            
    }

    async climaLugar(lat,lon){
        try{

            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();

            return {
              desc: resp.data.weather[0].description,
              min: resp.data.main.temp_min,
              max: resp.data.main.temp_max,
              temp: resp.data.main.temp
            }

        }catch(error){
            console.log(error)
        }
    }

    agregarHistorial(lugar = ''){
        
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial.unshift(lugar);

        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }

    leerDB(){
       if(!fs.existsSync(this.dbPath)) return;
       
       const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
       const data = JSON.parse(info);
       this.historial = data.historial;
    }
}

module.exports = Busquedas;
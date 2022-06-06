require('dotenv').config()//variables de entorno
const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() =>{
   const busquedas = new Busquedas(); 
   let opt;
   do{
    opt = await inquirerMenu();
    
    switch(opt){
        case 1:
            const lugar = await leerInput('Ciudad: ');
            const lugares = await busquedas.ciudad(lugar);
            const idSeleccionado = await listarLugares(lugares);
            if(idSeleccionado === '0') continue;
            const lugarSelect = lugares.find(l => l.id === idSeleccionado);
            const clima = await busquedas.climaLugar(lugarSelect.lat,lugarSelect.lng);
            busquedas.agregarHistorial(lugarSelect.nombre);
            console.log('\nInformacion de la ciudad\n'.green); 
            console.log('Ciudad:',lugarSelect.nombre.green); 
            console.log('Latitud:',lugarSelect.lat); 
            console.log('Longitud:',lugarSelect.lng); 
            console.log('Temperatura:',clima.temp);
            console.log('Estado:',clima.desc.green) 
            console.log('Minima:',clima.min); 
            console.log('Maxima:',clima.max); 
            break;
        case 2:
            busquedas.historialCapitalizado.forEach((lugar,i)=>{
                const idx = `${i + 1}.`.green
                console.log(`${idx} ${lugar}`);
            })
            break;
    }
    if (opt !== 0) await pausa();
   }while(opt !== 0)
}

main();
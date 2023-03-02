//Constructores

function Seguro (marca, anio, tipo){
    this.marca = marca;
    this.anio = anio;
    this.tipo = tipo;
};

function UI (){};
/* Prototypes de Seguro */

// Realiza la cotizacion con los datos

Seguro.prototype.cotizarSeguro = function(){
    /* 
    1 = Americano incrementa valor 1.15 
    2 = Asiatico incrementa valor 1.05 
    3 = Europeo incrementa valor 1.35 
    */

    let cantidad;
    const base = 7000;
    //console.log('this.marca :>> ', this.marca);
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
    
        case '2':
            cantidad = base * 1.05;
            break;
        
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //leer año
    const diferencia = new Date().getFullYear() - this.anio;
    /* Cada año que la diferencia es mayor, el costo va a reducirse en 3% */
    cantidad -= ((diferencia * 3)* cantidad) / 100;

    /* 
    Si el seguro es básico e multiploca por 30% más
    Si el seguro es completo e multiploca por 50% más
     */

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }
    //console.log('cantidad :>> ', cantidad);
    return cantidad;
    
}
/* Prototypes de UI */

//Llena las opciones de los años en Select
UI.prototype.llenarOpciones = ()=>{
    const max = new Date().getFullYear(),
          min = max - 23;

    const selectAnio =  document.querySelector('#year');


    //Creando opciones
    for (let i = max; i >= min; i-- ){
        let option = document.createElement('option');
        option.value = i;
        option.textContent= i;
        selectAnio.appendChild(option);
    }
}

// Muestra Alertar en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo)=>{
    const div = document.createElement('div');
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    //Insertar div en HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado')); // (nuevoNodo, nodoReferencia)

    //Limpiar mensajes de error / correctos

    setTimeout(() => {
        div.remove();
    }, 2000);
}

// mostrar resultado

UI.prototype.mostrarResultado = (seguro, total)=>{

    const {marca, anio, tipo} = seguro;

    let textoMarca ;
    switch (marca) {
        case '1':
            textoMarca = "Americano";
            break;
        case '2':
            textoMarca = "Asiatico";
            break;
        case '3':
            textoMarca = "Europeo";
            break;
        default:
            break;
    }
    // Crear el resultado

    const div = document.createElement('DIV');
    div.classList.add('mt-10');
    div.innerHTML = 
    `
        <p class="header">Tu Resumen </p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca} </span></p>
        <p class="font-bold">Año: <span class="font-normal">${anio} </span></p>
        <p class="font-bold">Tipo de Seguro: <span class="font-normal capitalize">${tipo} </span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total} </span></p>

    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    //mostrar el spinner

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';; // se borra el spinner pero se muestra el resultado
        resultadoDiv.appendChild(div);
    }, 2000);


}

//Instanciar UI
const ui = new UI();
//console.log('ui :>> ', ui);





//Eventos
document.addEventListener('DOMContentLoaded', ()=>{
    ui.llenarOpciones(); //Se manda llamar prototype llenarOpciones del objeto UI, para llenar el select con los años.
});


eventListeners();
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}


function cotizarSeguro(e){
    e.preventDefault();

    //Leer marca seleccionada

    const marca = document.querySelector('#marca').value;

    
    //Leer el año seleccionado
    const year  = document.querySelector('#year').value;

    //Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === ''){
       ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
       return;
    }
        ui.mostrarMensaje('Cotizando...', 'exito');

        //Ocultar las cotizaciones previas
        const resultados = document.querySelector('#resultado div');
        if(resultados != null){
            resultados.remove();
        }

        //Instanciar el seguro

        const seguro = new Seguro(marca, year, tipo);
        const total = seguro.cotizarSeguro();

        //utilizar el protoype que va a cotizar.
    
        ui.mostrarResultado(seguro, total);
}
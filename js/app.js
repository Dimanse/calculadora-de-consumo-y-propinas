let cliente = {
    mesa: '',
    hora: '',
    pedido:[]
}

const categorias = {
    1 : 'comida',
    2 : 'bebida',
    3 : 'postre'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
const formulario = document.querySelector('#formulario');
const contenido = document.querySelector('#resumen .contenido');




btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){

    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo === '');
    if(camposVacios){
        const existeAlerta = document.querySelector('.invalid-feedback');
        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'text-center', 'd-block', 'fs-5');
            alerta.textContent = 'Debes rellenar los dos campos';
            document.querySelector('.modal-body form').appendChild(alerta);
            setTimeout(() => {
                alerta.remove()
            }, 3000);
        }
         return
        }
             // ASIGNAR DATOS DEL FORMULARIO AL CLIENTE
            cliente = {...cliente, mesa, hora};

            const modalFormulario = document.querySelector('#formulario');
            const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario)
            modalBootstrap.hide();
            // console.log(cliente);

            // MOSTRAR SECCIONES
            mostrarSecciones();
            obtenerPlatillos();
        
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none')
    })


}

function obtenerPlatillos(){
    const url = 'http://localhost:3000/platillos';
    fetch(url)
     .then(respuesta => respuesta.json())
     .then(resultado =>  mostrarPlatillos(resultado))
     
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido')
    platillos.forEach(platillo => {
        const {nombre, id, categoria, precio } = platillo

        const row = document.createElement('DIV');
        row.classList.add('row', 'border-top');

        const nombrePlatillo = document.createElement('DIV');
        nombrePlatillo.classList.add('col-md-4', 'py-3');
        nombrePlatillo.textContent = nombre;

        const precioPlatillo = document.createElement('DIV');
        precioPlatillo.classList.add('col-md-3', 'fw-bold', 'py-3');
        precioPlatillo.textContent = ` $ ${precio} `;

        const categoriaPlatillo = document.createElement('DIV');
        categoriaPlatillo.classList.add('col-md-3', 'py-3');
        categoriaPlatillo.textContent = categorias[categoria];

        const input = document.createElement('INPUT');
        input.classList.add('form-control', );
        input.type = 'number';
        input.min = 0;
        input.value = 0;
        input.id = `producto-${id}`;

        // FUNCCIÓN QUE DETECTA LA CANTIDAD Y EL PLATILLO QUE SE ESTA AGREGANDO
        input.onchange = function(){
            const cantidad = parseInt(input.value);
            
            agregarPlatillo({...platillo, cantidad});
        }

        const inputDiv = document.createElement('DIV');
        inputDiv.classList.add('col-md-2');

        
        row.appendChild(nombrePlatillo);
        row.appendChild(precioPlatillo);
        row.appendChild(categoriaPlatillo);
        row.appendChild(inputDiv);
        inputDiv.appendChild(input);
        contenido.appendChild(row);
        


    })
}

function agregarPlatillo(producto) {
    // EXTRAER EL PEDIDO ACTUAL
    let {pedido} = cliente;
    if(producto.cantidad > 0){
        // COMPRUEBA SI EL ELEMENTO YA EXISTE EN EL ARREGLO
        if( pedido.some( articulo => articulo.id === producto.id ) ){
            // EL ARTICULO YA EXISTE, ACTUALIZAMOS LA CANTIDAD
            const pedidoActualizado = pedido.map(articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                // NO PIERDE LA REFERENCIA DE LOS ARTICULOS NO ACTUALIZADOS
                return articulo;
            });
            cliente.pedido = [...pedidoActualizado];
        }else{
            // EL PEDIDO QUE NO EXISTE LO AGREGA AL ARREGLO DE PEDIDO
        cliente.pedido = [...pedido, producto];
        }
        
    }else{
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }
    const contenido = document.querySelector('#resumen .contenido');
    limpiarHTML(contenido);

    if(cliente.pedido.length){
        
        agregarResumen();
    }else{
        
        mostrarMensajeVacio()
    }
}

function agregarResumen(){
    const {pedido, mesa, hora} = cliente;
    const contenido = document.querySelector('#resumen .contenido');
    // console.log(cliente.pedido);

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6');

    const divResumen = document.createElement('DIV');
    divResumen.classList.add('card', 'px-3', 'py-2', 'shadow')

    // INFORMACION DE LA MESA
    const Texto = document.createElement('P');
    Texto.classList.add('fw-bold');
    Texto.textContent = 'Mesa: ';

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.classList.add('font-normal');
    mesaSpan.textContent = mesa;

    // INFORMACION HORA
    const horaTexto = document.createElement('P');
    horaTexto.classList.add('fw-bold');
    horaTexto.textContent = 'Hora: ';

    const horaSpan = document.createElement('SPAN');
    horaSpan.classList.add('font-normal');
    horaSpan.textContent = hora;

    // AGREGAR UN HEADING

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Paltillos Consumidos:';

    // ITERAR SOBRE EL ARREGLO DE PEDIDO
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    cliente.pedido.forEach(articulo => {
        
        const {nombre, id, precio, categoria, cantidad} = articulo;
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');


        // AGREGAR NOMBRE
        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // AGREGAR CANTIDAD
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadElSpan = document.createElement('SPAN');
        cantidadElSpan.classList.add('fw-normal');
        cantidadElSpan.textContent = cantidad;

        // AGREGAR EL PRECIO
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioElSpan = document.createElement('SPAN');
        precioElSpan.classList.add('fw-normal');
        precioElSpan.textContent = ` $${precio} `;

        // AGREGAR EL SUBTOTAL
        const subTotalEl = document.createElement('P');
        subTotalEl.classList.add('fw-bold');
        subTotalEl.textContent = 'Subtotal: ';

        const subTotalElSpan = document.createElement('SPAN');
        subTotalElSpan.classList.add('fw-normal');
        subTotalElSpan.textContent = calcularSubTotal(precio, cantidad);

        // AGRAGAR BOTON PARA ELIMINAR EL PRODUCTO
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger', 'col-md-5');
        btnEliminar.textContent = 'Eliminar de la comanda';

        // ELIMINAR PRODUCTO DE LA COMANDA POR EL ID
        btnEliminar.onclick = function(){
            eliminarProducto(id);
            
        }

        


        precioEl.appendChild(precioElSpan);
        cantidadEl.appendChild(cantidadElSpan);
        subTotalEl.appendChild(subTotalElSpan);


        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subTotalEl);
        lista.appendChild(btnEliminar);
        

        grupo.appendChild(lista);
    })




    // AGREGAR A ELELMETOS PADRE

        Texto.appendChild(mesaSpan);
        horaTexto.appendChild(horaSpan);
    
        divResumen.appendChild(heading);
        divResumen.appendChild(Texto);
        divResumen.appendChild(horaTexto);
    
        divResumen.appendChild(grupo);
        resumen.appendChild(divResumen);

        contenido.appendChild(resumen);

        // MOSTRAR FORMULARIO DE PROPINAS

        formularioPropinas();


}

function calcularSubTotal(precio, cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const {pedido} = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
        cliente.pedido = [...resultado];

        limpiarHTML(contenido);

        if(cliente.pedido.length){
            agregarResumen();
        }else{
            mostrarMensajeVacio()
        }
        
        // Si eliminamos producto regresar cantidad a 0 en el input
       const productoEliminado = `#producto-${id}`;
       const inputEliminado = document.querySelector(productoEliminado);
       inputEliminado.value = 0;
}

function mostrarMensajeVacio(){
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent ='Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas(){
    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const formularioDiv = document.createElement('DIV');
    formularioDiv.classList.add('card', 'px-3', 'py-2', 'shadow');
    
    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propinas:';

    // AGREGAR UN INPUT RADIO DEL 10% PARA LAS PROPINAS
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('from-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.classList.add('from-check-label', 'mx-2');
    radio10Label.textContent = '10%';

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('from-check');


    // AGREGAR UN INPUT RADIO DEL 25% PARA LAS PROPINAS
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('from-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.classList.add('from-check-label', 'mx-2');
    radio25Label.textContent = '25%';

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('from-check', 'my-3');

     // AGREGAR UN INPUT RADIO DEL 50% PARA LAS PROPINAS
     const radio50 = document.createElement('INPUT');
     radio50.type = 'radio';
     radio50.name = 'propina';
     radio50.value = '50';
     radio50.classList.add('from-check-input');
     radio50.onclick = calcularPropina;
 
     const radio50Label = document.createElement('LABEL');
     radio50Label.classList.add('from-check-label', 'mx-2');
     radio50Label.textContent = '50%';
 
     const radio50Div = document.createElement('DIV');
     radio50Div.classList.add('from-check');



    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);


    // AGREGANDO AL FORMULARIO
    formulario.appendChild(formularioDiv);
    formularioDiv.appendChild(heading);
    formularioDiv.appendChild(radio10Div);
    formularioDiv.appendChild(radio25Div);
    formularioDiv.appendChild(radio50Div);

    contenido.appendChild(formulario);
}

function calcularPropina(){
    const {pedido} = cliente;
    let subtotal = 0;

    pedido.forEach(articulo => {
         subtotal += articulo.cantidad * articulo.precio;
        })
        // RETORNAMOS EL PORCENTAJE DE LA PROPINA
        const propinaSeleccionada = document.querySelector('[name=propina]:checked').value;

        // CALCULAMOS LA PROPINA
        const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

        // obtenemos el total
        const total = subtotal + propina
        
        imprimirHTML(total, propina, subtotal);

       
}

function imprimirHTML(total, propina, subtotal){
    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5');

    const subtotalPagar = document.createElement('P');
    subtotalPagar.classList.add('fs-4', 'mt-2', 'fw-bold');
    subtotalPagar.textContent = 'Subtotal a pagar: ';

    const subtotalPagarSpan = document.createElement('SPAN');
    subtotalPagarSpan.classList.add('fw-normal');
    subtotalPagarSpan.textContent = ` $ ${subtotal} `;

    const propinaPagar = document.createElement('P');
    propinaPagar.classList.add('fs-4', 'mt-2', 'fw-bold');
    propinaPagar.textContent = 'Propina: ';

    const propinaPagarSpan = document.createElement('SPAN');
    propinaPagarSpan.classList.add('fw-normal');
    propinaPagarSpan.textContent = ` $ ${propina} `;

    const totalPagar = document.createElement('P');
    totalPagar.classList.add('fs-4', 'mt-2', 'fw-bold');
    totalPagar.textContent = 'Total a pagar: ';

    const totalPagarSpan = document.createElement('SPAN');
    totalPagarSpan.classList.add('fw-normal');
    totalPagarSpan.textContent = ` $ ${total} `;


    totalPagar.appendChild(totalPagarSpan);

    const divTotalPagar = document.querySelector('.total-pagar')

    if(divTotalPagar){
        divTotalPagar.remove();
    }
    
    subtotalPagar.appendChild(subtotalPagarSpan);
    propinaPagar.appendChild(propinaPagarSpan);
    
    divTotales.appendChild(subtotalPagar);
    divTotales.appendChild(propinaPagar);
    divTotales.appendChild(totalPagar);
    
    
    const formulario = document.querySelector('.formulario > DIV');
    formulario.appendChild(divTotales);
}
    


function limpiarHTML(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild)
    }
}



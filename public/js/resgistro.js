const formRegistro = document.forms['registro']
// console.log(formRegistro)

formRegistro.addEventListener('submit', (event) => {
    //detengo envio de formulario
    event.preventDefault()

    //obtengo los datos ingresados en el formulario
    const usuario = formRegistro.usuario.value
    const email = formRegistro.email.value
    const pass = formRegistro.pass.value

    //como no los tengo en el formulario los hardcodeo
    const image = formRegistro.usuario.value+'.jpg'
    const type = 0

    //creo objeto con los datos obtenidos
    const nvoUsuario = { Name: usuario, Email: email, Image: image, Pass: pass, Type_user: type }
    // console.log(nvoUsuario)

    //convierto el objeto a json para pasarlo por la API fetch al backend
    const nvoUsuarioJson = JSON.stringify(nvoUsuario)
    // console.log(nvoUsuarioJson)

    //declaro en enpoint
    const endpoint = 'http://localhost:3000/users/register'

    //funcion que envia los datos al datos al backend para que sean registrados
    const enviarNvoUsuario = async () => {
        try {
             const enviarDatos = await fetch(endpoint, {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: nvoUsuarioJson
            })
            //obtengo la respuesta del backend
            const response = await enviarDatos.json()
            // console.log(response)
            document.querySelector('#message').innerHTML=response.message


        } catch (error) {
            console.log(error)

        }
    }
    //ejecuto la funcion creada
    enviarNvoUsuario()

    //Limpio formulario
    formRegistro.reset()

})
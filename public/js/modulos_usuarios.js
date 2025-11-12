/********************************************************/
/*              verificar si hay sesion abierta         */
/********************************************************/
document.addEventListener("DOMContentLoaded", () => {
    // cargo la pagina, verifico si hay sesion abierta,o sea, si existe el token y es valido
    // de haber sesion muestro perfil y cierre de sesion
    // de no haber sesion muestro login y registrar

    //declaro en enpoint
    const endpoint = 'http://localhost:3000/users/'

    //funcion que envia los datos al datos al backend para que sean registrados
    const InSesion = async () => {
        try {
            const enSesion = await fetch(endpoint)
            //obtengo la respuesta del backend
            const response = enSesion.status
            console.log(response)
            if (response === 202) {
                //Oculto registro y login // Muestro perfil y cerrar sesion
                const usuario = JSON.parse(localStorage.getItem('user'))
                document.querySelector('#usuario').innerHTML = `<p class="usuario">${usuario}</p>`
                document.querySelector('#sesion').style.display = 'block'
                document.querySelector('#logout').style.display = 'block'
                document.querySelector('#registro').style.display = 'none'
                document.querySelector('#login').style.display = 'none'

            }

        } catch (error) {
            console.log(error)
        }
    }
    //ejecuto la funcion creada
    InSesion()
})


/********************************************************/
/*               REGISTRAR USUARIO                      */
/********************************************************/
const formRegistro = document.forms['registro']
// console.log(formRegistro)

formRegistro.addEventListener('submit', (event) => {
    /**************************************************************** */
    //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
    /**************************************************************** */
    //detengo envio de formulario
    event.preventDefault()

    //obtengo los datos ingresados en el formulario
    const usuario = formRegistro.usuario.value
    const email = formRegistro.email.value
    const pass = formRegistro.pass.value

    //como no los tengo en el formulario los hardcodeo
    const image = formRegistro.usuario.value + '.jpg'
    const type = 0

    //creo objeto con los datos obtenidos
    const nvoUsuario = { Name: usuario, Email: email, Image: image, Pass: pass, Type_user: type }
    // console.log(nvoUsuario)

    //convierto el objeto a json para pasarlo por la API fetch al backend
    const nvoUsuarioJson = JSON.stringify(nvoUsuario)
    // console.log(nvoUsuarioJson)

    /********************************************************************************************/
    //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
    /********************************************************************************************/
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
            // document.querySelector('#message').innerHTML = response.message
            alert(response.message)


        } catch (error) {
            console.log(error)

        }
    }
    //ejecuto la funcion creada
    enviarNvoUsuario()

    //Limpio formulario
    formRegistro.reset()

})


/********************************************************/
/*     INICIAR SESION (LOGIN) USUARIO                   */
/********************************************************/
const formLogin = document.forms['login']

formLogin.addEventListener('submit', (event) => {
    /**************************************************************** */
    //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
    /**************************************************************** */
    //detengo envio de formulario
    event.preventDefault()

    //determino que los campos no esten vacios
    if (!formLogin.email.value || !formLogin.pass.value) {
        return document.querySelector('#message').innerHTML = 'email y contraseña requeridos'
    }

    //obtengo los datos ingresados en el formulario
    const email = formLogin.email.value
    const pass = formLogin.pass.value

    //creo objeto con los datos obtenidos
    const datosLogin = { Email: email, Pass: pass }


    //convierto el objeto a json para pasarlo por la API fetch al backend
    const datosLoginJson = JSON.stringify(datosLogin)
    // console.log(nvoUsuarioJson)

    /********************************************************************************************/
    //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
    /********************************************************************************************/
    //declaro en enpoint
    const endpoint = 'http://localhost:3000/users/login'

    //funcion que envia los datos al datos al backend para que sean registrados
    const enviarDatosLogin = async () => {
        try {
            const enviarDatos = await fetch(endpoint, {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: datosLoginJson
            })
            //obtengo la respuesta del backend
            const response = await enviarDatos.json()

            // console.log(response) //recibo un message y la data del usuario id, name y tipo de usuario
            // document.querySelector('#message').innerHTML=response.message

            if (response.data) {
                // console.log(response.data)

                //limpio contenedor de mensajes
                // document.querySelector('#message').innerHTML = response.message
                document.querySelector('#message').innerHTML = ''

                //guardo el payload en el localStorage
                localStorage.setItem('user', JSON.stringify(response.data))

                //Oculto registro y login // Muestro perfil y cerrar sesion
                document.querySelector('#usuario').innerHTML = `<p class="usuario"> ${response.data}</p>`
                document.querySelector('#sesion').style.display = 'block'
                document.querySelector('#logout').style.display = 'block'
                document.querySelector('#registro').style.display = 'none'
                document.querySelector('#login').style.display = 'none'
            } else {
                document.querySelector('#message').innerHTML = response.message
            }
        } catch (error) {
            console.log(error)
        }
    }
    //ejecuto la funcion creada
    enviarDatosLogin()

    //Limpio formulario
    formLogin.reset()
})

/********************************************************/
/*               CERRAR SESION USUARIO                  */
/********************************************************/

document.querySelector('.btn_logout').addEventListener('click', () => {
    console.log('quiero cerrar sesion')

    //declaro en enpoint
    const endpoint = 'http://localhost:3000/users/logout'

    //funcion que envia los datos al datos al backend para que sean registrados
    const logout = async () => {
        try {
            const cerrarSesion = await fetch(endpoint)
            //obtengo la respuesta del backend
            const response = await cerrarSesion.json()
            // console.log(response)
            // document.querySelector('#message').innerHTML=response.message

            //elimino datos usuario del localStorage
            localStorage.removeItem('user')
            window.location.href = './'
        } catch (error) {
            console.log(error)
        }
    }
    //ejecuto la funcion creada
    logout()
})

/********************************************************/
/*                      Ver Perfil                      */
/********************************************************/

document.querySelector('.btn_perfil').addEventListener('click', () => {

    document.querySelector('#perfil').style.display = 'block'

    const endpoint = `http://localhost:3000/users/account`

    //funcion que envia los datos al datos al backend para que sean registrados
    const showAccount = async () => {
        try {
            const verPerfil = await fetch(endpoint)
            //obtengo la respuesta del backend
            const response = await verPerfil.json()
            // console.log(response)
            const perfil = `<p>Nombre: ${response.Name}</p>
            <p>Email: ${response.Email}</p>
            <img src="image_users/${response.Image}" />`
            document.querySelector('#datos_perfil').innerHTML = perfil
        } catch (error) {
            console.log(error)
        }
    }
    //ejecuto la funcion creada
    showAccount()
})

/********************************************************/
/*              ELIMINAR CUENTA USUARIO                 */
/********************************************************/

//declaro en enpoint
const endpoint = 'http://localhost:3000/users/deleteAccount'

//funcion que envia los datos al datos al backend para que sean registrados
const deleteAccount = async () => {
    try {
        const eliminarCuenta = await fetch(endpoint, { method: 'delete' })
        //obtengo la respuesta del backend
        const response = await eliminarCuenta.json()
        // console.log(response)

        //elimino datos usuario del localStorage
        localStorage.removeItem('user')
        window.location.href = './'
        document.querySelector('#message').innerHTML = response.message
    } catch (error) {
        console.log(error)
    }
}

function confirmarAccion() {
    // Muestra el cuadro de diálogo y almacena la respuesta en userChoice
    var userChoice = confirm("¿Estás seguro de que quieres eliminar tu cuenta?");

    if (userChoice) {
        //llamada a la función eliminar
        deleteAccount()
        alert("¡Cuenta eliminada!");

    } else {
        alert("Eliminación cancelada.");
    }
}


/********************************************************/
/*              Actualizar datos USUARIO                */
/********************************************************/

document.querySelector('#btn_act_datos').addEventListener('click', () => {

    //muestro formulario
    document.querySelector('#update').style.display = 'block'

    //selecciono el formulario
    const formUpdate = document.forms['formUpdate']

    formUpdate.addEventListener('submit', (event) => {
        /**************************************************************** */
        //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
        /**************************************************************** */
        //detengo envio de formulario
        event.preventDefault()

        //obtengo datos del campo
        const nvoNombre = formUpdate.usuario.value

        //creo objeto con los datos obtenidos
        const nvoUsuario = { Name: nvoNombre }
        // console.log(nvoUsuario)

        //convierto el objeto a json para pasarlo por la API fetch al backend
        const nvoUsuarioJson = JSON.stringify(nvoUsuario)

        /********************************************************************************************/
        //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
        /********************************************************************************************/
        //declaro en enpoint
        const endpoint = 'http://localhost:3000/users/upDate'

        //funcion que envia los datos al datos al backend para que sean registrados
        const update_User = async () => {
            try {
                const enviarDatos = await fetch(endpoint, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: nvoUsuarioJson
                })
                //obtengo la respuesta del backend
                const response = await enviarDatos.json()
                // console.log(response)
                document.querySelector('#message').innerHTML = response.message

                //guardo nvo nombre  en el localStorage
                localStorage.setItem('user', JSON.stringify(nvoNombre))

                document.querySelector('#usuario').innerHTML = `<p class="usuario">${nvoNombre}</p>`

            } catch (error) {
                console.log(error)

            }
        }
        //ejecuto la funcion creada
        update_User()

        //actualizo nombre desde el localStorage
        // const usuario = JSON.parse(localStorage.getItem('user'))
        // document.querySelector('#usuario').innerHTML = `<p> usuario: ${usuario}</p>`

        //Limpio formulario
        formUpdate.reset()

        //oculto formulario
        document.querySelector('#update').style.display = 'none'

        //oculto perfil para obligar al usuario a presionar el boton, entonce actualiza
        document.querySelector('#perfil').style.display = 'none'
    })




})

/********************************************************/
/*              Cambiar Contraseña               */
/********************************************************/

document.querySelector('#btn_change_pass').addEventListener('click', () => {

    //muestro formulario
    document.querySelector('#changePass').style.display = 'block'

    //selecciono el formulario
    const formChangePass = document.forms['formChangePass']

    formChangePass.addEventListener('submit', (event) => {
        console.log('presione btn')
        /**************************************************************** */
        //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
        /**************************************************************** */
        //detengo envio de formulario
        event.preventDefault()

        //obtengo datos del campo
        const nvoPass = formChangePass.pass.value
        console.log(nvoPass)

        //creo objeto con los datos obtenidos
        const nvoPassword = { Pass: nvoPass }
        // console.log(nvoUsuario)

        //convierto el objeto a json para pasarlo por la API fetch al backend
        const nvoPasswordJson = JSON.stringify(nvoPassword)
        console.log(nvoPasswordJson)
        /********************************************************************************************/
        //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
        /********************************************************************************************/
        //declaro en enpoint
        const endpoint = 'http://localhost:3000/users/setPassword'

        //funcion que envia los datos al datos al backend para que sean registrados
        const changePass = async () => {
            try {
                const enviarDatos = await fetch(endpoint, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: nvoPasswordJson
                })
                //obtengo la respuesta del backend
                const response = await enviarDatos.json()
                // console.log(response)
                
                alert(response.message)

                //redirecciono al index
                window.location.href = '/'

            } catch (error) {
                console.log(error)

            }
        }
        //ejecuto la funcion creada
        changePass()

    })




})

/********************************************************/
/*               subir imagen perfil                    */
/********************************************************/

document.querySelector('#btn_up_imagen').addEventListener('click', () => {
    console.log('quiero subir imagen')

    //muestro formulario
    document.querySelector('#image').style.display = 'block'

    //selecciono el formulario
    const formChangePass = document.forms['formImage']


    //declaro en enpoint
    const endpoint = 'http://localhost:3000/users/image'

    //funcion que envia los datos al datos al backend para que sean registrados
    const upImage = async () => {
        try {
            const cerrarSesion = await fetch(endpoint)
            //obtengo la respuesta del backend
            const response = await cerrarSesion.json()
            // console.log(response)
            // document.querySelector('#message').innerHTML=response.message

            //elimino datos usuario del localStorage
            localStorage.removeItem('user')
            window.location.href = './'
        } catch (error) {
            console.log(error)
        }
    }
    //ejecuto la funcion creada
    // upImage()
})
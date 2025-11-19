/********************************************************/
/*              verificar si hay sesion abierta         */
/********************************************************/
document.addEventListener("DOMContentLoaded", () => {
    
    // cargo la pagina, verifico si hay sesion abierta,o sea, si existe el token y es valido
    // de haber sesion muestro perfil y cierre de sesion
    // de no haber sesion muestro login y registrar
    // el mismo codigo funciona para todas las rutas abiertas o protegidas

    //funcion que envia los datos al datos al backend para que sean registrados
    const InSesion = async () => {
          //declaro en enpoint
    // const endpoint = 'http://localhost:3000/users/'
    const endpoint = '/users/'
        // try {
        const enSesion = await fetch(endpoint)
        //obtengo la respuesta del backend, en este caso un estado
        const response = enSesion.status
        console.log(response)
        if (response === 202 || response === 201) {
            //recuperamos el nombre del usuario del localStorage y lo mostramos
            const usuario = JSON.parse(localStorage.getItem('user'))
            document.querySelector('#usuario').innerHTML = `<p class="usuario">${usuario}</p>`

            //Oculto registro y login // Muestro perfil y cerrar sesion
            document.querySelector('#sesion').style.display = 'block'
            document.querySelector('#logout').style.display = 'block'
            document.querySelector('#registro').style.display = 'none'
            document.querySelector('#login').style.display = 'none'
        }
        // } catch (error) {
        //     alert('Error')        }
    }
    //ejecutamos la funcion creada
    InSesion()


/********************************************************/
/*               REGISTRAR USUARIO                      */
/********************************************************/
//capturamos el formulario del DOM 
const formRegistro = document.forms['registro']

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

    //creo objeto con los datos obtenidos
    const nvoUsuario = { Name: usuario, Email: email, Pass: pass, }
    // console.log(nvoUsuario)

    //convierto el objeto a json para pasarlo por la API fetch al backend
    const nvoUsuarioJson = JSON.stringify(nvoUsuario)
    // console.log(nvoUsuarioJson)

    /********************************************************************************************/
    //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
    /********************************************************************************************/
    //declaro en enpoint
    // const endpoint = 'http://localhost:3000/users/register'
    const endpoint = '/users/register'

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
            // Muestro la respuesta recibida del backend
            alert(response.message)

        } catch (error) {
            alert('Error')
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
//capturamos el formulario del DOM 
const formLogin = document.forms['login']

formLogin.addEventListener('submit', (event) => {
    /**************************************************************** */
    //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
    /**************************************************************** */
    //detengo envio de formulario
    event.preventDefault()

    //determino que los campos no esten vacios
    if (!formLogin.email.value || !formLogin.pass.value) {
        // return document.querySelector('#message').innerHTML = 'email y contraseña requeridos'
        return alert('email y contraseña requeridos')
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
    // const endpoint = 'http://localhost:3000/users/login'
    const endpoint = '/users/login'

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

            //determinamos que el codigo continue solo si el usuario tiene credenciales validas
            if (enviarDatos.status === 401) { return alert('credenciales invalidas') }

            //obtenemos la respuesta del backend
            const response = await enviarDatos.json()

            //guardamos el NOMBRE DEL USUARIO en el localStorage
            localStorage.setItem('user', JSON.stringify(response.data))

            //mostramos nombre del usuario
            document.querySelector('#usuario').innerHTML = `<p class="usuario"> ${response.data}</p>`

            //Ocultamos registro y login // Mostramos perfil y cerrar sesion
            document.querySelector('#sesion').style.display = 'block'
            document.querySelector('#logout').style.display = 'block'
            document.querySelector('#registro').style.display = 'none'
            document.querySelector('#login').style.display = 'none'
       
        } catch (error) {
            alert('Error')
        }
    }
    //ejecutamos la funcion creada
    enviarDatosLogin()

    //Limpiamos formulario
    formLogin.reset()
})

/********************************************************/
/*               CERRAR SESION USUARIO                  */
/********************************************************/

document.querySelector('.btn_logout').addEventListener('click', () => {
    //declaramos en enpoint
    // const endpoint = 'http://localhost:3000/users/logout'
    const endpoint = '/users/logout'

    const logout = async () => {
        try {
            const cerrarSesion = await fetch(endpoint)

            //espero la respuesta del backend, que tiene que eliminar la cookie
            await cerrarSesion.json()

            //eliminamos datos usuario del localStorage
            localStorage.removeItem('user')

            //redireccionamos a la raiz, para que recarge 
            window.location.href = './'

        } catch (error) {
            console.log(error)
        }
    }
    //ejecutamos la funcion creada
    logout()
})

/********************************************************/
/*                      Ver Perfil                      */
/********************************************************/
const btn_perfil = document.querySelector('.btn_perfil')
const cont_perfil = document.querySelector('#perfil')
let mostrar = false

btn_perfil.addEventListener('click', () => {
    //efecto toggle para el boton perfil
    if (mostrar) {
        cont_perfil.style.display = 'none';
        mostrar = false;
    } else {
        cont_perfil.style.display = 'block';
        mostrar = true;
    }

    //peticion al backend de los datos del usurio, armado y muestra de perfil
    const showAccount = async () => {
        // const endpoint = '`http://localhost:3000/users/account`
        const endpoint = '/users/account'
        try {
            //request al backend de los datos del usuario
            const verPerfil = await fetch(endpoint)

            //obtenemos la respuesta del backend
            const response = await verPerfil.json()

            //armamos el perfil con los datos recibidos
            let perfil = `<p>Nombre: ${response.Name}</p>
            <p>Email: ${response.Email}</p>`
            if (!response.Image) {
                perfil += `<img src="image_users/imgUserDefault.png" />`
            } else {
                perfil += `<img src="image_users/${response.Image}" />`
            }

            //mostramos el perfil
            document.querySelector('#datos_perfil').innerHTML = perfil

            //mostramos los botones de actualizacion de datos
            document.querySelector('#btn_update').style.display = 'block'

        } catch (error) {
            alert('Error')
        }
    }
    //ejecuto la funcion creada
    showAccount()
})

/********************************************************/
/*              Actualizar datos USUARIO                */
/********************************************************/

document.querySelector('#btn_act_datos').addEventListener('click', () => {

    //mostramos formulario
    document.querySelector('#update').style.display = 'block'

    //seleccionamos el formulario
    const formUpdate = document.forms['formUpdate']

    formUpdate.addEventListener('submit', (event) => {
        /**************************************************************** */
        //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
        /**************************************************************** */
        //detenemos envio de formulario
        event.preventDefault()

        //obtenemos datos del campo
        const nvoNombre = formUpdate.usuario.value

        //creamos objeto con los datos obtenidos
        const nvoUsuario = { Name: nvoNombre }

        //convertimos el objeto a json para pasarlo por la API fetch al backend
        const nvoUsuarioJson = JSON.stringify(nvoUsuario)

        /********************************************************************************************/
        //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
        /********************************************************************************************/
        //declaramos en enpoint
        // const endpoint = 'http://localhost:3000/users/upDate'
        const endpoint = '/users/upDate'

        //creamos la funcion que envia los datos al datos al backend para que sean registrados
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

                //Muestramos la respuesta
                alert(response.message)

                //guardamos nvo nombre de usuario  en el localStorage
                localStorage.setItem('user', JSON.stringify(nvoNombre))

                //mostramos el nuevo nombre en el perfil
                document.querySelector('#usuario').innerHTML = `<p class="usuario">${nvoNombre}</p>`

            } catch (error) {
                alert('Error')

            }
        }
        //ejecutamos la funcion creada
        update_User()

        //Limpiamos el  formulario
        formUpdate.reset()

        //oculto formulario
        document.querySelector('#update').style.display = 'none'

        //oculto perfil para obligar al usuario a presionar el boton, entonces actualiza
        document.querySelector('#perfil').style.display = 'none'

        //colocamos el estado del boton de perfil en false para que reinicie
        mostrar = false

    })

})


/********************************************************/
/*               subir imagen perfil                    */
/********************************************************/
document.querySelector('#btn_up_imagen').addEventListener('click', () => {

    // document.querySelector('#image').classList.toggle('oculto')
    document.querySelector('#image').style.display = 'block'

    //selecciono el formulario
    const formUpdateImage = document.forms['formImage']


    formUpdateImage.addEventListener('submit', (event) => {
        //detenemos envio de formulario
        event.preventDefault()

        const form = event.target;
        // console.log(form)
        const formData = new FormData(form);

        //declaro en enpoint
        // const endpoint = 'http://localhost:3000/users/image'
        const endpoint = '/users/image'

        const subirImagen = async () => {
            try {
                const upload = await fetch(endpoint, {
                    method: 'PUT',
                    body: formData // `FormData` se encarga del `Content-Type`
                });

                //obtengo la respuesta del backend
                const response = await upload.json()

                //Muestramos la respuesta
                alert(response.message)

            } catch (error) {
                alert('Error')
            }
        }

        //ejecuto la funcion creada
        subirImagen()

        //Limpio formulario
        formUpdateImage.reset()


        //oculto formulario
        document.querySelector('#image').style.display = 'none'

        //oculto perfil para obligar al usuario a presionar el boton, entonces actualiza
        document.querySelector('#perfil').style.display = 'none'

        //colocamos el estado del boton de perfil en false para que reinicie
        mostrar = false

    })

})


/********************************************************/
/*              Cambiar Contraseña               */
/********************************************************/

document.querySelector('#btn_change_pass').addEventListener('click', () => {

    //mostramosformulario
    // document.querySelector('#changePass').classList.toggle('oculto')
    document.querySelector('#changePass').style.display = 'block'

    //seleccionamos el formulario
    const formChangePass = document.forms['formChangePass']

    formChangePass.addEventListener('submit', (event) => {
        console.log('presione btn')
        /**************************************************************** */
        //    1RA PARTE: PREPARO EL JSON PARA ENVIAR AL BACKEND
        /**************************************************************** */
        //detenemos envio de formulario
        event.preventDefault()

        //obtenemos datos del campo
        const nvoPass = formChangePass.pass.value

        //creamos objeto con los datos obtenidos
        const nvoPassword = { Pass: nvoPass }

        //convertimos el objeto a json para pasarlo por la API fetch al backend
        const nvoPasswordJson = JSON.stringify(nvoPassword)

        /********************************************************************************************/
        //2DA PARTE: ENVIO LA PETICION Y LOS DATOS AL BACKEND Y ESPERO LA RESPUETA (REQUEST/RESPONSA)
        /********************************************************************************************/
        //declaramos en enpoint
        // const endpoint = 'http://localhost:3000/users/setPassword'
        const endpoint = '/users/setPassword'

        //creamos la funcion que envia la nueva contraseña y la actualiza
        const changePass = async () => {
            try {
                const enviarDatos = await fetch(endpoint, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: nvoPasswordJson
                })

                //obtenemos la respuesta del backend
                const response = await enviarDatos.json()

                alert(response.message)

                //redireccionamos al index para que vuelva a iniciar sesion
                window.location.href = '/'

            } catch (error) {
                console.log(error)

            }
        }
        //ejecutamos la funcion creada
        changePass()
    })
})


/********************************************************/
/*              ELIMINAR CUENTA USUARIO                 */
/********************************************************/

//declaramos el enpoint
// const endpoint = 'http://localhost:3000/users/deleteAccount'
const endpoint = '/users/deleteAccount'

//enviamos la peticion de delete al backend
const deleteAccount = async () => {
    try {
        const eliminarCuenta = await fetch(endpoint, { method: 'delete' })
        //obtenemos la respuesta del backend
        const response = await eliminarCuenta.json()

        //Mostramos mensaje
        alert(response.message)

        //eliminamos datos usuario del localStorage
        localStorage.removeItem('user')

        //redireccionamos a registro o inicio de sesion
        window.location.href = './'
    } catch (error) {
        alert('Error')
    }
}

//Esta funcion la utiliza deleteAccount para confirma la eliminacion de la cuenta antes de proceder
function confirmarAccion() {
    // Muestra el cuadro de diálogo y almacena la respuesta en userChoice
    var userChoice = confirm("¿Estás seguro de que quieres eliminar tu cuenta?");

    if (userChoice) {
        //llamada a la función eliminar
        deleteAccount()
        alert("¡Cuenta eliminada!");
    }
}

})// fin del DOMContentLoaded
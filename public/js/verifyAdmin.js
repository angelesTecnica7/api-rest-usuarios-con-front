document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = async () => {
          //declaro en enpoint
    const endpoint = 'http://localhost:3000/users/'
          const enSesion = await fetch(endpoint)
        //obtengo la respuesta del backend, en este caso un estado
        const response = enSesion.status
        console.log(response)
        if (response === 100) {
            //recuperamos el nombre del usuario del localStorage y lo mostramos
            const usuario = JSON.parse(localStorage.getItem('user'))
            document.querySelector('#usuario').innerHTML = `<p class="usuario">${usuario}</p>` 
        }else {
            window.location.href = './'
        }

    }
    //ejecutamos la funcion creada
    isAdmin()

    /********************************************************/
/*               CERRAR SESION USUARIO                  */
/********************************************************/

document.querySelector('.btn_logout').addEventListener('click', () => {
    //declaramos en enpoint
    const endpoint = 'http://localhost:3000/users/logout'

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
})
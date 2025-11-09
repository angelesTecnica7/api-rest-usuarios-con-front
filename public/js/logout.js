/********************************************************/
/*               CERRAR SESION USUARIO                  */
/********************************************************/

document.querySelector('.btn_logout').addEventListener('click', ()=> {
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
/*              Ver Perfil                 */
/********************************************************/

document.querySelector('.btn_perfil').addEventListener('click', ()=> {
 
    const data_user = JSON.parse(localStorage.getItem('user'))
    // console.log(data_user)
    
    //declaro en enpoint
    const endpoint = `http://localhost:3000/users/account/${data_user.id}`

    //funcion que envia los datos al datos al backend para que sean registrados
    const showAccount = async () => {
        try {
             const verPerfil = await fetch(endpoint)
            //obtengo la respuesta del backend
            const response = await verPerfil.json()
            console.log(response)
            const perfil = `<p>Nombre: ${response.Name}</p>
            <p>Email: ${response.Email}</p>
            <img src="${response.Image}" />`
            document.querySelector('#datos_perfil').innerHTML = perfil
        } catch (error) {
            console.log(error)
        }
    }
    //ejecuto la funcion creada
    showAccount()
})
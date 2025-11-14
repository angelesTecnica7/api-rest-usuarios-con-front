
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//Necesario para borrar el archivo de imagen previa
import path from "path"
import fs from "fs"
const __dirname = import.meta.dirname
import sharp from "sharp";

// import multer from "multer";
// const upload = multer({ dest: 'uploads/' })

import 'dotenv/config';
import * as model from '../model/users.model.js'


export const verifySesionOpen = (req, res) => {
    res.status(202).json({ message: "estamos en sesion" })
    //status(202) aceptado
}

export const register = async (req, res) => {
    // console.log(req.body)
    //desestructuro email y contraseña del body, para verificar que no esten vacios
    const { Email, Pass } = req.body

    //verifico que los datos se hayan completado
    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" })
    }

    //verifico que el usuario no exista en la db
    const exists = await model.getUserByEmail(Email)
    if (exists.errno) { return res.status(500).json({ message: `Error en consulta para verificar duplicado de usuarios ${rows.errno}` }) }
    if (exists[0]) { return res.json({ message: "Este correo ya se encuentra registrado" }) }

    //si no existe, encripto contraseña, inicializo Image y Type_user  y registro
    const passwordHash = await bcrypt.hash(Pass, 10) // console.log(req.body)
    req.body.Pass = passwordHash //coloco en req.body la contraseña encriptada
    req.body.Image = null
    req.body.Type_user = 0
    // console.log(req.body)

    const rows = await model.createUser(req.body)

    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }
    //row devuelve muchos datos entre ellos el id creado, es lo que retorno
    res.status(201).json({ message: `${req.body.Name} Usuario Creado con id ${rows.insertId} ` })
}


export const login = async (req, res) => {
    // console.log(req.body)

    // desestructuro req.boby para colocar sus valores en variables independientes
    const { Email, Pass } = req.body

    //verifico que los datos se hayan completado
    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" })
    }

    //verifico existencia del usuario por email en la db
    const user = await model.getUserByEmail(Email)

    //tomo la respuesta del modelo y actuo en consecuencia
    if (user.errno) { return res.status(500).json({ message: `Error en consulta, buscando usuario ${rows.errno}` }) }
    if (!user[0]) { return res.status(401).json({ message: "Credenciales invalidas" }) }


    // console.log(user[0])
    //si existe, comparo contraseñas
    const valid = await bcrypt.compare(Pass, user[0].Pass)
    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" })
    }

    // si la contraseña es valida, tenemos que crear una sesion
    //y para esto haremos 2 pasos: 1) crear un token y 2) guardar el token en una cookie en el cliente

    //1) crear el token
    const payload = { id: user[0].ID_user, name: user[0].Name, type: user[0].Type_user } //carga o datos del token, son publicos (puden verse)

    const expiration = { expiresIn: "24h" } // tiempo de expiracion del token
    const token = jwt.sign(payload, process.env.JWT_SECRET, expiration) //firma digital con la clave secreta
    // console.log(token)

    //2) respondo al cliente con la orden de crear una cookie
    res.cookie("access_token", token, {
        httpOnly: true, // la cookie solo se puede acceder en el servidor
        // secure: true, //para que solo funciones con https
        sameSite: 'strict', // solo se puede acceder desde el mismo dominio
        maxAge: 1000 * 60 * 60 //la cookie tiene un tiempo de validez de una hora
    })

    //creo data para enviarla al cliente con el proposito de guardarla en el localStorage,
    // para mostrar el nombre del  usuario en sesion
    const data = user[0].Name
    res.status(202).json({ message: "sesion iniciada ", data })
}

export const logout = (req, res) => {
    //eliminamos la cookie del token
    res.clearCookie("access_token").json({ message: 'session cerrada' })
}

export const showAccount = async (req, res) => {
    // console.log(req.user)
    // req.user se definio en verifyToken y contiene el payload del token
    // const id = parseInt(req.user.id)
    const rows = await model.getUserById(req.user.id)

    //si rows trae el error del catch este es un objeto que tiene una propiedad 
    // "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }

    //rows devuelve un array que contiene un objeto, con [0] tomo solo el objeto  
    (!rows[0]) ? res.status(404).json({ message: 'El usuario no existe' }) : res.json(rows[0])
}

export const updateAccount = async (req, res) => {
    // req.user se definio en verifyToken y contiene el payload del token
    const rows = await model.updateUser(req.user.id, req.body)

    //si row trae el error del catch este es un objeto que tiene una propiedad
    //  "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }
    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados,
    //  si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({ message: 'El usuario no existe' }) }
    res.json({ message: 'datos actualizados' })
}

export const setPassword = async (req, res) => {
    //desestructuro contraseña del body, para verificar que no esten vacio
    const { Pass } = req.body


    //verifico que los datos se hayan completado
    if (!Pass) {
        return res.status(422).json({ message: "Nueva contraseña requerida" })
    }
    const passwordHash = await bcrypt.hash(Pass, 10) // console.log(req.body)
    req.body.Pass = passwordHash //coloco en req.body la contraseña encriptada

    // req.user se definio en verifyToken y contiene el payload del token
    const rows = await model.updateUser(req.user.id, req.body)

    //si row trae el error del catch este es un objeto que tiene una propiedad
    //  "errno" cod. de error
    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }
    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados,
    //  si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({ message: 'El usuario no existe' }) }

    //eliminamos la cookie del token, cerranos sesion
    res.clearCookie("access_token").json({ message: 'Contraseña actualizada' })
}

export const deleteAccount = async (req, res) => {
    // req.user se definio en verifyToken y contiene el payload del token
    //  const id = parseInt(req.user.id)
    const rows = await model.deleteUser(req.user.id)

    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }

    //row devuelve muchos datos entre ellos "affectedRows" cantidad de registros afectados, 
    // si es igual a cero no se modifico ningun registro
    if (rows.affectedRows == 0) { return res.status(404).json({ message: 'El usuario no existe' }) }
    //eliminamos la cookie del token
    res.clearCookie("access_token").json({ message: 'Cuenta eliminada' })
}

export const uploadImage = async (req, res) => {
    // if(!req.file) {
    //     return res.json({message: "debe subir un a imagen"})
    // }
    // console.log(req.file)
    //Hay que contemplar que pueden suceder 3 posibilidades:

    // 1 - no se suba ninguna imagen y NO haya una imagen previa (Image = null) 
    let Image = null


    // 2 - no se suba ninguna imagen pero HAY una imagen previa (Image = imagen previa)
    let imagePreviaPath = ''
    const searchImage = await model.getUserById(req.user.id)

    if (searchImage[0].Image !== null) {
        //asignamos la imagen previa
        Image = searchImage[0].Image

        //definimos su path porque si se sube una imagen nueva hay que borrar la previa
        imagePreviaPath = path.resolve(__dirname, "../../public/image_users", searchImage[0].Image)
        // console.log(imagePath)
    }

    // 3 - Se sube una imagen, esta reemplaza al estado anterior (Image = nueva imagen ),
    // si hay una imagen previa se elimina
    if (req.file) {
        console.log(req.file)

        Image = await upload(req.file)

        if (imagePreviaPath !== '') {
            fs.unlinkSync(imagePreviaPath) //borramos la imagen previa
        }
    }

    //llamamos al modelo para actualizar la imagen
    const rows = await model.updateUser(req.user.id, { Image })
    if (rows.errno) {
        return res.status(500).json({ message: `Error en consulta ${rows.errno}` })
    }
    if (rows.affectedRows == 0) { return res.status(404).json({ message: 'El usuario no existe' }) }
    res.json({ message: 'datos actualizados' })

}

const upload = async (file) => {
    //Esta funcion se utiliza en uploadImage()
    if (!file) {
        return null;
    }
    //determinamos el nombre de la imagen a guardar 
    //path.extname(file.originalname) obtiene la extension del archivo original 
    //Date.now() Un numero que representa los milisegundos del momento actual, con lo cual es unico  
    const imageName = Date.now() + path.extname(file.originalname);

    //definimos el path(lugar) donde se va a guardar la imagen
    const imagePath = path.resolve(__dirname, "../../public/image_users", imageName);

    //redimensionamos la imagen al tamaño que necesitamos
    //resize(300) representa el ancho en px, el alto es proporcional
    //sharp toma la imagen del buffer, la redimensiona y la guarda en el desitno especificado
    await sharp(file.buffer).resize(300).toFile(imagePath);

    //retornamos el nombre de la imagen guardada
    return imageName;
};
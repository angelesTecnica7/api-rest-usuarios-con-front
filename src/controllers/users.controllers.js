// register,
// login,
// showAccount,
// updateAccount,
// uploadImage,
// setPassword,
// deleteAccount
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as model from '../model/users.model.js'

export const register = async (req, res) => {
    console.log(req.body)
    //desestructuro email y contraseña del body, para verificar que no esten vacios
    const { Email, Pass } = req.body
    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" })
    }
    //verifico que el usuario no exista en la db
    const exists = await model.getUserByEmail(Email)
    if (exists.errno) { return res.status(500).json({message: `Error en consulta para verificar duplicado de usuarios ${rows.errno}`}) }
    if (exists[0]) { return res.json({ message: "Este correo ya se encuentra registrado" }) }

    //si no existe, encripto contraseña y registro
    const passwordHash = await bcrypt.hash(Pass, 10) // console.log(req.body)
    req.body.Pass = passwordHash //coloco en req.body la contraseña encriptada
    const rows = await model.createUser(req.body)

    if (rows.errno) {
        return res.status(500).json({message: `Error en consulta ${rows.errno}`})
    }
    //row devuelve muchos datos entre ellos el id creado, es lo que retorno
    // res.status(201).send(`${req.body.Name} Usuario Creado con id ${rows.insertId} `)
    res.status(201).json({ message: `${req.body.Name} Usuario Creado con id ${rows.insertId} ` })
}


export const login = async (req, res) => {
    const { Email, Pass } = req.body
    if (!Email || !Pass) {
        return res.status(422).json({ message: "email y contraseña requeridos" })
    }

    //verifico existencia del usuario por email en la db
    const rows = await model.getUserByEmail(Email)
    if (rows.errno) { return res.status(500).send(`Error en consulta, buscando usuario ${rows.errno}`) }
    if (!rows[0]) { return res.json({ message: "Credenciales invalidas" }) }

    //si existe, comparo contraseñas
    const valid = await bcrypt.compare(Pass, rows.Pass)
    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" })
    }

    res.json({ message: "USUARIO ACEPTADO" })
}

export const showAccount = (req, res) => {
    res.send('mostrar perfil')
}

export const updateAccount = (req, res) => {
    res.send('actualizar datos')
}

export const uploadImage = (req, res) => {
    res.send('subir foto perfil')
}

export const setPassword = (req, res) => {
    res.send('cambiar contraseña')
}

export const deleteAccount = (req, res) => {
    res.send('borrar cuenta')
}
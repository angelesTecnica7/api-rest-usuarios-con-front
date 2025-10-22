import pool from '../../config/conexion.js'

export const getUserByEmail = async(email) => {
    const sql = "SELECT * FROM users WHERE Email = ?"
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [email]);
        connection.release();   
        return rows                
    } catch (error) {
        return error
    }
}

export const createUser = async(values) => {
    const sql = 'INSERT INTO users SET ?';
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [values]);
        connection.release();
        return rows 
    } catch (error) {
        return error
    }
}
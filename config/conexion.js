import mysql from 'mysql2/promise';
//pool de conexiones en vez de createConection porque el pool permite que api no se sature con muchas consultas simultaneas
  const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || 'localhost',
    user: process.env.MYSQL_ADDON_USER || 'root',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || 'latienda',
    connectionLimit: 5
  });

  // test connection
  pool.getConnection()
  .then(connection => {
    console.log('Conectados :)')
    connection.release()
  })
  .catch(error => {
    console.log('error de conexion', error)
  })
  
export default pool


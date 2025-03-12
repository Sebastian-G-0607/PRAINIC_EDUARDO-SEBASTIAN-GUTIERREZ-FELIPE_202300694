//SE IMPORTA EL MÓDULO QUE PERMITE CONECTAR CON SQL
import { createPool } from 'mysql2/promise'

//SE EXPORTA EL MÓDULO POOL
export const pool = createPool({
    host: "localhost",
    user: "root", 
    password: "1234", 
    port: "3306",
    database: "fiusac_db"
})


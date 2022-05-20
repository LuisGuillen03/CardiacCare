import connection from 'express-myconnection';
import sql from 'mssql'

export const dbSettings = {
    user: 'guillen',
    password: 'unosa',
    server: 'localhost',
    database: 'Cardiac_Care2',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export async function getConnection(){
    try{
        const pool = await sql.connect(dbSettings)
        return pool;
    } catch(errror){
        console.error(errror);
    }

}



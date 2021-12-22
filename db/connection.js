const mysql =require("mysql2")
const connection= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.DB_PW,
    database:"employee_tracker"
})
connection.connect((err)=>{if (err)throw err})
module.exports=connection
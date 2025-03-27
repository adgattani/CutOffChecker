var mysql=require("mysql2");
var con=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"root",
        database:"cutoffchecker"
    }
);


module.exports=con;
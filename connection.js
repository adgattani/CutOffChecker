var mysql=require("mysql2");
var con=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"borse@7121",
        database:"cutoffuser"
    }
);


module.exports=con;
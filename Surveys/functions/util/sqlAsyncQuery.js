const { mysqldb } = require("./admin");

exports.dbQuery = (queryString) =>{
    return new Promise(function(resolve, reject) {
        mysqldb.query(queryString, (err, rows, fields) =>{
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};
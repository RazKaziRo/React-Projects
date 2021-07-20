const { mysqldb } = require("../util/admin");

exports.promiseQuery((query) =>{
    return new Promise(function(resolve, reject) {
        mysqldb.query(query, (err, rows, fields) =>{
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
});
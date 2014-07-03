function queryDB(tx) {
    tx.executeSql('SELECT * FROM usuarios', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var len = results.rows.length;
 alert("usuarios: " + len + " rows found.");
for (var i=0; i<len; i++){
    alert("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).nombre);
    }
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

db = window.openDatabase("Seriesmarker", "1.0", "Seriesmarker", 100 * 1024);  
db.transaction(queryDB, errorCB);
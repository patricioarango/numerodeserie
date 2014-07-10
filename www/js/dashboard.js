//update images function
function traer_usuario() {
    var db = window.openDatabase("Seriesmarker", "1.0", "Seriesmarker", 100 * 1024);  
    db.transaction(queryDB_u_g, errorCB);
}
//Query the database
function queryDB_u_g(tx) {
    var query = 'SELECT * FROM usuario';
    tx.executeSql(query, [], querySuccess_u_g, errorCB);
}
//Query success callback
function querySuccess_u_g(tx, results) {
	var len = results.rows.length;
	for (var i=0; i<len; i++){
	    alert(results.rows.item(i).id);
	    alert(results.rows.item(i).firstName);
	}
}
$(document).on('deviceready', function() {
	traer_usuario();
}


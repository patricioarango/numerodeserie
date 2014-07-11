function traer_usuario() {
	$("#nombre").append(localStorage.usuario_nombre + " " + localStorage.usuario_apellido);
	$("#email").append(localStorage.usuario_email);
	$("#foto").append(localStorage.usuario_imagen);
}
//Query the database
function queryDB_u_g(tx) {
    var query = 'SELECT * FROM usuario';
    tx.executeSql(query, [], querySuccess_u_g, errorCB);
}
//Query success callback
function querySuccess_u_g(tx, results) {
	var len = results.rows.length;
	for (var i=0; i<=len; i++){
	    alert(results.rows.item(i).id);
	    alert(results.rows.item(i).firstName);
	}
}
//update images function
$(document).on('deviceready', function() {
	traer_usuario();
}


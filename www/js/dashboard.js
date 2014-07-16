function traer_usuario_local() {
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
function meter_usuario() {
	var db = window.openDatabase("Seriesmarker", "1.0", "Seriesmarker", 100 * 1024);
    db.transaction(insertar_usuario, error2, success2);
}
function insertar_usuario(tx) {
    var query = "insert into usuario (id,firstName,lastName,email,image) values ('" + localStorage.usuario_id + "','" + localStorage.usuario_nombre + "','" + localStorage.usuario_apellido + "','" + localStorage.usuario_email + "','" + localStorage.usuario_imagen + "')";                     
    tx.executeSql(query);
}
function error2(err){
        alert("data is not inserted" + err.message);
}
function success2(){
        alert("data is succesfully inserted");
}
//init
$(document).on('deviceready', function() {
		traer_usuario_local();
		meter_usuario();
});


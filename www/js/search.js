function get_usuario() {
    function queryDB(tx) {
     tx.executeSql('SELECT * FROM usuario', [], querySuccess, errorCB);
    }

    function querySuccess(tx, results) {
        var len = results.rows.length;
    //alert("DEMO table: " + len + " rows found.");
     for (var i=0; i<len; i++){
     //alert("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).firstName);
        }
    }

    function errorCB(err) {
        alert("Error processing SQL: "+err.code);
    }

   var db = window.openDatabase("Seriesmarker", "1.0", "Seriesmarker", 100 * 1024);
    db.transaction(queryDB, errorCB);
}
/*
$("#buscador").keyup(function() {
    alert();
});
*/
function resize_picture(){
   
}
$(document).on('deviceready', function() {
    get_usuario();

});


//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("opening database");
    db = window.openDatabase(shortName, version, displayName, maxSize);
  console.log("database opened");
    db.transaction(getSeriesUsuario, transaction_error);
  get_user_profile();
  //traer_series();
}
/*//traemos los datos de la db para comparar con results de busqueda
function getSeriesUsuario() {
  db.transaction(function(tx) {
    tx.executeSql('SELECT distinct id_serie FROM series_se', [],
      function(tx, result) {
          if (result != null && result.rows != null) {
            var row = result.rows.item
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                //console.log("idseries en la db" + row.id_serie);
                traer_capitulo(row.id_serie);
            }
          } else { //no hay resultados

          }
      },nullHandler("tx series en db"),transaction_error);
  });
} */
function transaction_error(tx, error) {
    console.log(tx);
}
function nullHandler(texto){
  console.log(texto);
}

function getSeriesUsuario(tx) {
  var sql = "SELECT distinct id_serie FROM series_se";
  tx.executeSql(sql, [], getSerieExito);
}

function getSerieExito(tx, result) {
  var row = result.rows.item;
  for (var i = 0; i < result.rows.length; i++) {
    var row = result.rows.item(i);
    //console.log(row);
    traer_capitulo(row.id_serie);
  }
}
function traer_capitulo(id_serie) {
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM series_se WHERE id_serie=? AND visto=1 ORDER BY id DESC LIMIT 1', [id_serie],mostrar_capitulos,nullHandler("tx datos capitulo"),transaction_error);
  });
}
function mostrar_capitulos(tx,result){
  for (var i = 0; i < result.rows.length; i++) {
      var row = result.rows.item(i);
      console.log("cap vistos" + row.cap_name);
  }
}
function get_user_profile() {
  $("#profile_img").attr("src",localStorage.usuario_imagen);
  $("#profile_name").html(localStorage.usuario_nombre + "!");
}

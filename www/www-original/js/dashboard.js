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
}

function transaction_error(tx, error) {
    //console.log(tx);
}
function getSeriesUsuario(tx) {
  //var sql = "SELECT * FROM usuario_se use left join series s ON use.id_serie=s.id_serie";
  var sql = "SELECT series.name as se_name,usuario_se.modificado, usuario_se.id_serie as serie_id, usuario_se.temporada as cap_temp, usuario_se.capitulo_num as cap_nu, usuario_se.capitulo_name as cap_na, series.poster,series.number_of_seasons as nof, series.number_of_episodes as noe, series_se.temp_max_cap as ultimo_capitulo_temporada, series_se.temp_max as ultima_temporada FROM usuario_se LEFT JOIN series ON usuario_se.id_serie=series.id_serie LEFT JOIN series_se ON series_se.id_serie=series.id_serie ORDER BY 2 DESC";
  tx.executeSql(sql, [], getSerieExito);
}

function getSerieExito(tx, result) {
  var row = result.rows.item;
  for (var i = 0; i < result.rows.length; i++) {
    var row = result.rows.item(i);
    console.log(row);
  }
}

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
  //db.transaction(creacionDB,transaction_error);
    db.transaction(getSeriesUsuario, transaction_error);
  get_user_profile();
  //traer_series();
}
function creacionDB(tx) {
      console.log("creando tabla");
      var sql3 = "CREATE TABLE IF NOT EXISTS series_se (id INTEGER PRIMARY KEY,id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_temporada,cap_num,cap_name,cap_plot,temp_max_cap,serie_poster,temp_poster,visto,modificado)";
    tx.executeSql(sql3);
}
var ids_de_series = [];
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
  var sql = "SELECT distinct id_serie,in_production FROM series_se ORDER BY modificado DESC";
  tx.executeSql(sql, [], getSerieExito);
}
function getSerieExito(tx, result) {
  var row = result.rows.item;
  for (var i = 0; i < result.rows.length; i++) {
    var row = result.rows.item(i);
    console.log(row);
    ids_de_series.push({'id_serie':row.id_serie},{'en_produccion':row.in_production});
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
      pegar_capitulo_vista(row.cap_name);
  }
}
function pegar_capitulo_vista(capitulo) {
  $(".series_one").append('' +
  '<div class="order_by row"><i class="fa fa-dot-circle-o"></i> last edited <i class="fa fa-circle-o">  </i> A-z <!--| Show finnished on-off-->'+
   ' </div>'+
  '<div class="show_finished row">'+
        '<div class="col-xs-2"><a href="#"><i style="vertical-align: middle;" class="fa fa-chevron-left fa-2x pull-left"></i></a></div>'+
       ' <div class="col-xs-8">serie</div>'+
       ' <div class="col-xs-2"><a href="#"><i style="vertical-align: middle;" class="fa fa-chevron-right fa-2x pull-right"> </i></a></div>'+
    '</div>'+
  '<div class="last_viewed row">'+
       ' <div class="col-xs-2"><a href="#"><span class="fa-stack fa-lg pull-left"><i style="vertical-align: middle;" class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-minus fa-stack-1x fa-inverse pull-left"></i></span></a></div>'+
        '<div class="col-xs-8">'+capitulo+'</div>'+
       ' <div class="col-xs-2"><a href="#"><span class="fa-stack fa-lg pull-right"><i style="vertical-align: middle;" class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></a></div>'+
    '</div>'+
   ' <div class="row">'+
      '<div class="img_serie_conte col-xs-10">'+
          '<img class="img_series img-responsive" src="img/the-sopranos-523679859129a.jpg" />'+
      '</div>'+
        '<div class="col-xs-2" style="margin-top:20px;">'+
            '<div class="row lista_serie">'+
            '<i class="fa fa-eye fa-2x"></i>'+
            '</div>'+
            '<div class="row lista_serie">'+
            '<i class="fa fa-star fa-2x"></i>'+
            '9.5'+
            '</div>'+
            '<div class="row lista_serie">'+
            '<i class="fa fa-info fa-2x"></i>'+
            '</div>'+
        '</div>'+
    '</div>');
}
function get_user_profile() {
  $("#profile_img").attr("src",localStorage.usuario_imagen);
  $("#profile_name").html(localStorage.usuario_nombre + "!");
}

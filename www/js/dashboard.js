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
      var sql3 = "CREATE TABLE IF NOT EXISTS series_se (id INTEGER PRIMARY KEY,id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_temporada,cap_num,cap_name,temp_max_cap,serie_poster,temp_poster,visto,cap_plot,cap_puntaje,modificado)";
    tx.executeSql(sql3);
}
var ids_de_series = [];
var ids_de_series_for_sync = [];

function transaction_error(tx, error) {
    console.log(tx);
}
function nullHandler(texto){
  console.log(texto);
}
function getSeriesUsuario(tx) {
  var sql = "SELECT id_serie FROM series_se GROUP BY id_serie ORDER BY max(modificado) DESC";
  tx.executeSql(sql, [], getSerieExito);
}
function getSerieExito(tx, result) {
  var row = result.rows.item;
  for (var i = 0; i < result.rows.length; i++) {
    var row = result.rows.item(i);
    console.log(row);
    ids_de_series.push(row.id_serie);
    ids_de_series_for_sync.push({'id_serie':row.id_serie,'en_produccion':row.in_production});
  }
    console.log(ids_de_series);
    traer_capitulo(result.rows.item(0).id_serie);
}
function traer_capitulo(id_serie) {
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM series_se WHERE id_serie=? AND visto=1 ORDER BY modificado DESC LIMIT 1', [id_serie],mostrar_capitulos,nullHandler("tx datos capitulo"),transaction_error);
  });
}
function mostrar_capitulos(tx,result){
  for (var i = 0; i < result.rows.length; i++) {
      var row = result.rows.item(i);
      console.log(row);
      pegar_capitulo_vista(row);
  }
}
function pegar_capitulo_vista(res) {
  var temporada_capitulo;
  var capitulo_numero;
  var img_url;

  if (res.cap_num < 10) {
    capitulo_numero = "0" + res.cap_num;
  } else {
    capitulo_numero = res.cap_num;
  }
  if (res.cap_temporada < 10) {
    temporada_capitulo = "0" + res.cap_temporada;
  } else {
    temporada_capitulo = res.cap_temporada;
  }
  //si es el 1er cap de la temp 1 no se puede updatear visto no visto
  var capitulo_original;
  if (res.cap_num == 1 && res.cap_temporada == 1){
    capitulo_original = 1;
  } else {
    capitulo_original = 0;
  }
  //si hay + de 1 serie en DB
  if (ids_de_series.length > 1) {
    series_indicators = "visible";
  } else {
    series_indicators = "hidden";
  }
  var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
  var tamanio = "original/";
  if (res.temp_poster != null) {
    img_url = res.temp_poster;
  } else {
    img_url = res.serie_poster;
  }
  var imagen = base_url + tamanio + img_url;
  var visto_o_no;
  if (res.visto == 1) {
    visto_o_no = "fa-eye";
  } else {
    visto_o_no = "fa-eye-slash";
  }
  $(".series_one").html("");
  $(".series_one").append('' +
  '<!-- <div class="order_by row"><i class="fa fa-dot-circle-o"></i> last edited <i class="fa fa-circle-o">  </i>  A-z--><!--| Show finnished on-off-->'+
   ' <!-- </div> --> '+
  '<div class="show_finished row">'+
        '<div data-id_serie="'+res.id_serie+'" class="col-xs-2 prev_serie"><a href="#"><i style="visibility:'+series_indicators+';vertical-align: middle;" class="fa fa-chevron-left fa-2x pull-left"></i></a></div>'+
       ' <div class="col-xs-8">'+res.serie_name+' ('+res.serie_episodes+' Episodes)</div>'+
       ' <div data-id_serie="'+res.id_serie+'" class="col-xs-2 next_serie"><a href="#"><i style="visibility:'+series_indicators+';vertical-align: middle;" class="fa fa-chevron-right fa-2x pull-right"> </i></a></div>'+
    '</div>'+
  '<div class="last_viewed row">'+
       ' <div data-id_serie="'+res.id_serie+'" data-cap_num="'+res.cap_num+'" data-cap_temp="'+res.cap_temporada+'" data-max_cap_temp="'+res.temp_max_cap+'" data-seasons="'+res.serie_seasons+'" class="col-xs-2 prev_cap"><a href="#"><span class="fa-stack fa-lg pull-left"><i style="vertical-align: middle;" class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-minus fa-stack-1x fa-inverse pull-left"></i></span></a></div>'+
        '<div class="col-xs-8">'+res.cap_name+' - S'+temporada_capitulo+'E'+capitulo_numero+'</div>'+
       ' <div data-id_serie="'+res.id_serie+'" data-cap_num="'+res.cap_num+'" data-cap_temp="'+res.cap_temporada+'" data-max_cap_temp="'+res.temp_max_cap+'" data-seasons="'+res.serie_seasons+'" class="col-xs-2 next_cap"><a href="#"><span class="fa-stack fa-lg pull-right"><i style="vertical-align: middle;" class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span></a></div>'+
    '</div>'+
   ' <div class="row">'+
      '<div data-visto="'+res.visto+'"  data-capitulo_original="'+capitulo_original+'" data-id="'+res.id+'" class="img_serie_conte col-xs-10">'+
          '<img class="img_series img-responsive" src="'+imagen+'" />'+
          '<div class="row cap_plot">'+res.cap_plot+'</div>'+
          '<div class="row actualizado_msg_seen" style="display:none;"><i class="fa fa-check-circle fa-2x"> seen</i></div>'+
          '<div class="row actualizado_msg_unseen" style="display:none;"><i class="fa fa-times-circle fa-2x"> unseen</i></div>'+
      '</div>'+
        '<div class="col-xs-2" style="margin-top:20px;">'+
            '<div class="row lista_serie visto_info">'+
            '<i class="fa '+visto_o_no+' fa-2x"></i>'+
            '</div>'+
            '<div class="row lista_serie">'+
            '<i class="fa fa-star fa-2x"></i>'+
            +res.cap_puntaje+
            '</div>'+
            '<div class="row lista_serie cap_info">'+
            '<i class="fa fa-info fa-2x"></i>'+
            '</div>'+
        '</div>'+
    '</div>');
}
function get_user_profile() {
  $("#profile_img").attr("src",localStorage.usuario_imagen);
  $("#profile_name").html(localStorage.usuario_nombre + "!");
}
//siguiente serie
function siguiente_id_serie(id_serie,direccion) {
  var index = $.inArray( id_serie, ids_de_series );
  if (direccion == "next") {
    index++;
    if(index >= ids_de_series.length) {
      index = 0;
    }
  } else {
    --index;
    if(index == -1) {
      index = ids_de_series.length - 1;
    }
  }
  return ids_de_series[index];
}
$(".series_one").on('click',".next_serie",function(e) {
  e.preventDefault();
  var siguiente_se = siguiente_id_serie($(this).data("id_serie"),"next");
  traer_capitulo(siguiente_se);
});
$(".series_one").on('click',".prev_serie",function(e) {
  e.preventDefault();
  var anterior_se = siguiente_id_serie($(this).data("id_serie"),"prev");
  traer_capitulo(anterior_se);
});
//cambiar de capitulo
$(".series_one").on('click',".next_cap",function(e) {
  e.preventDefault();
  var capitulo; var temporada;
  var id_serie = $(this).data("id_serie");
  var capitulo_actual = $(this).data("cap_num");
  var temporada_actual = $(this).data("cap_temp");
  var maximo_capitulo_temporada = $(this).data("max_cap_temp");
  var maxima_temporada = $(this).data("max_seasons");

  if (capitulo_actual == maximo_capitulo_temporada) {
    capitulo = 1;
    temporada = ++temporada_actual;
  } else {
    capitulo = ++capitulo_actual;
    temporada = temporada_actual;
  }
  if (temporada_actual == maxima_temporada) {
    temporada = 1;
  }
  get_otro_episodio(id_serie,capitulo,temporada);
  console.log(id_serie+ ""+capitulo + "" + temporada);
});
function get_otro_episodio(id_serie,capitulo,temporada) {
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM series_se WHERE id_serie=? AND cap_num=? AND cap_temporada=?', [id_serie,capitulo,temporada],mostrar_capitulos,nullHandler("tx datos capitulo"),transaction_error);
  });
}
//update visto no visto
function update_visto(id_capitulo,visto){
  db.transaction(function(tx) {
    tx.executeSql('UPDATE series_se SET visto=?,modificado=DateTime("now") WHERE id=?', [visto,id_capitulo], nullHandler("update capitulo" + id_capitulo), transaction_error);
  });
}

$(".series_one").on('click',".cap_info",function(e) {
  e.preventDefault();
  $(".cap_plot").fadeToggle(500);
  $(".cap_info").toggleClass('info_rojo',500);
});

$(".series_one").on('click',".img_serie_conte",function(e) {
  e.preventDefault();
  var estado_visto = $(this).data("visto");
  var capitulo_original = $(this).data("capitulo_original");
  if (capitulo_original != 1) {
    if (estado_visto == 1) {
      $(".visto_info i").removeClass("fa-eye");
      $(".visto_info i").addClass("fa-eye-slash");
          $(".actualizado_msg_unseen").show();
          $(".actualizado_msg_unseen").animate({
            opacity: 0.50,
            top: "0",
          }, 500, function() {
            $(".actualizado_msg_unseen").fadeOut(250, function(){
              $(".actualizado_msg_unseen").css({'top':'50px','opacity':'1'});
            });
        });
        $(this).data("visto", "0");
        update_visto($(this).data("id"),0);
    } else {
      $(".visto_info i").removeClass("fa-eye-slash");
      $(".visto_info i").addClass("fa-eye");
          $(".actualizado_msg_seen").show();
          $(".actualizado_msg_seen").animate({
            opacity: 0.50,
            top: "0",
          }, 500, function() {
            $(".actualizado_msg_seen").fadeOut(250, function(){
              $(".actualizado_msg_seen").css({'top':'50px','opacity':'1'});
            });
        });
       $(this).data("visto", "1");
       update_visto($(this).data("id"),1);
    }
  }
});

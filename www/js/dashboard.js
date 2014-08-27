//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

function nullHandler(testo){
alert(testo);
}

function errorHandler(tx,error) {
   console.log('OKA: ' + error.message + ' code: ' + error.code);
   alert('OKA: ' + error.message + ' code: ' + error.code);
}
function crear_array_series(){
  ids_de_series = [];
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT series.name as se_name,usuario_se.modificado, usuario_se.id_serie as serie_id FROM usuario_se INNER JOIN series ON usuario_se.id_serie=series.id_serie ORDER BY 2 DESC', [],
      function(transaction, result) {
          if (result != null && result.rows != null) {
            var row = result.rows.item;
            //ids_de_series = new Array();
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                ids_de_series.push(row.serie_id); //array global para mostrar ocultar series
            } // for
          }
      },nullHandler("select series de db"),errorHandler);
  },nullHandler("select series de db"),errorHandler);
}

  // A-z order by 1 asc last modifi 2 DESC
function traer_datos() {
	db = window.openDatabase(shortName, version, displayName, maxSize);
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT series.name as se_name,usuario_se.modificado, usuario_se.id_serie as serie_id, usuario_se.temporada as cap_temp, usuario_se.capitulo_num as cap_nu, usuario_se.capitulo_name as cap_na, series.poster,series.number_of_seasons as nof, series.number_of_episodes as noe, series_se.temp_max_cap as ultimo_capitulo_temporada, series_se.temp_max as ultima_temporada FROM usuario_se INNER JOIN series ON usuario_se.id_serie=series.id_serie INNER JOIN series_se ON series_se.id_serie=series.id_serie ORDER BY 2 DESC', [],
     	function(transaction, result) {
      		if (result != null && result.rows != null) {
            $("section").html("");
      			var row = result.rows.item;
             //altura para imagen
            var alto_serie = ( $( window ).height() - 225);
            var ancho_serie = ( alto_serie * 1000 ) / 1426; 
            var margin_serie = ( ( $( window ).width() - ancho_serie) / 2 );
            var mostrar_o_no;
            //ids_de_series = new Array();
          		for (var i = 0; i < result.rows.length; i++) {
          			var row = result.rows.item(i);
                //ids_de_series.push(row.serie_id); //array global para mostrar ocultar series
              if (i == 0) { // solo el primero visible
                mostrar_o_no = "";
                orden = 0;
              }
              else {
                mostrar_o_no = "style='display:none;'";
                orden= 1;
              } 
              $("section").append("<div class='series_one' " + mostrar_o_no + " id='contenedor_serie" + row.serie_id + "' data-id='" + row.serie_id + "' data-orden='" + orden +"'><div class='order_by'><img style='float: left;' src='img/setts.png' height='50px' /><div  class='texto23'>Order by: <img src='img/chequed.png' height='20px' style='vertical-align:text-bottom;' /> last edited  <img src='img/unchecked.png' height='20px' style='vertical-align:text-bottom;' />  A-z <!-- <span style='color:#3498db;'>&#8212;</span> Show finished? <img src='img/fini_unchecked.png' height='20px' style='vertical-align:text-bottom;' /> <img src='img/fini_checked.png' height='20px' style='vertical-align:text-bottom;' /> --></div></div><div class='show_finished'><a href='#' class='anterior_se' data-orden_bot='0' data-id='" + row.serie_id + "' id='anterior_" + row.serie_id + "'><img style='float: left;' src='img/prev2.png' height='40px' /></a><a href='#' class='siguiente_se' data-orden_bot='0' data-id='" + row.serie_id + "' id='siguiente_" + row.serie_id + "'><img style='float: right;' src='img/next.png' height='40px' /></a><div class='texto23'>" + row.se_name + " (" + row.nof + " Seasons, "+ row.noe +" Episodes)</div></div><div class='last_viewed' id='last_viewed_id" + row.serie_id + "'><a href='#' class='epi_menos' id='datos_cap_menos" + row.serie_id + "' data-temp_actual='" + row.cap_temp + "' data-cap_actual='" + row.cap_nu + "' data-serieid='" + row.serie_id + "' data-ultima_temporada='" + row.ultima_temporada + "' data-max_cap='" + row.ultimo_capitulo_temporada + "'><img style='float: left;' src='img/menos.png' height='40px' /></a><a href='#' class='epi_mas' id='datos_cap_mas" + row.serie_id + "' data-temp_actual='" + row.cap_temp + "' data-cap_actual='" + row.cap_nu + "' data-serieid='" + row.serie_id + "' data-ultima_temporada='" + row.ultima_temporada + "' data-max_cap='" + row.ultimo_capitulo_temporada + "'><img style='float: right;' src='img/mas.png' height='40px' /></a><div class='texto23' id='datos_del_capitulo" + row.serie_id + "'>" + row.cap_na + " S" + row.cap_temp + " E" + row.cap_nu + " </div></div><div class='img_serie_conte' style='margin-left:" + margin_serie + "px;'><img class='img_series' src='" + row.poster + "' width='" + ancho_serie + "' height='" + alto_serie + "' /></div></div>");
        		} // for
      		}
     	},nullHandler("select todo from db"),errorHandler);
 	},nullHandler("select todo from db"),errorHandler);
}
//mostrar siguiente serie
$("section").on('click',".siguiente_se",function(e) {
   e.preventDefault();
   var nuevo_orden;
   var orden = $(this).data("orden_bot");
   if ( ids_de_series.length == (orden + 1)) {
    nuevo_orden = 0;
   }
   else {
    nuevo_orden = orden + 1;
   }
   $(".series_one").hide();
   $("#contenedor_serie" + ids_de_series[nuevo_orden]).show(); 
   $("#siguiente_" + ids_de_series[nuevo_orden]).data("orden_bot", nuevo_orden);
   $("#anterior_" + ids_de_series[nuevo_orden]).data("orden_bot", nuevo_orden);

   console.log(orden);
});
//mostrar anterior serie
$("section").on('click',".anterior_se",function(e) {
   e.preventDefault();
   var nuevo_orden;
   var orden = $(this).data("orden_bot");
   if (orden == 0) {
    nuevo_orden = (ids_de_series.length - 1);
   }
   else {
    nuevo_orden = (orden - 1);
   }
   $(".series_one").hide();
   $("#contenedor_serie" + ids_de_series[nuevo_orden]).show();
   $("#siguiente_" + ids_de_series[nuevo_orden]).data("orden_bot", nuevo_orden);
   $("#anterior_" + ids_de_series[nuevo_orden]).data("orden_bot", nuevo_orden);
});
//traer capitulo siguiente
function traer_siguiente_capitulo(id_serie,temporada,capitulo, id_capitulo_siguiente_callback){
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) {
    tx.executeSql('SELECT series_se.id,series_se.capitulo_name,series_se.capitulo_num,series_se.temporada,series_se.temp_max_cap FROM series_se WHERE series_se.id_serie=' + id_serie + ' AND series_se.temporada="' + temporada + '" AND series_se.capitulo_num="' + capitulo + '" ', [],
      function(tx, result) {
       // console.log(result.rows);
          if (result != null && result.rows != null) {
            var row = result.rows.item(0);
            id_capitulo_siguiente_callback(row);
            return;
          }
      },nullHandler("select siguiente / anterior cap"),errorHandler);
  },nullHandler("select siguiente / anterior cap"),errorHandler);
}
//mostrar capitulo anterior
$("section").on('click',".epi_menos",function(e) {
  e.preventDefault();
  var maximo_capitulo_temporada = $(this).data("max_cap");
  var capitulo_actual = $(this).data("cap_actual");
  var maxima_temporada = $(this).data("ultima_temporada");
  var temporada_actual = $(this).data("temp_actual");
  var id_serie = $(this).data("serieid");
  var capitulo;
  var temporada = temporada_actual;
  //console.log("serieid " + $(this).data("serieid") + " epi_actual " + $(this).data("cap_actual")+ " temp_actual " + $(this).data("temp_actual"));
  if (capitulo_actual == 1 && temporada_actual != 1) {
      capitulo = maximo_capitulo_temporada;
      temporada = temporada_actual - 1;
      if (temporada == 1 && capitulo == 1) {
        temporada = 1;
        capitulo = 1;
      }
  }
  else if (capitulo_actual == 1 && temporada_actual == 1) {
        temporada = 1;
        capitulo = 1;
  }
  else {
    capitulo = capitulo_actual - 1;
  }
  traer_siguiente_capitulo(id_serie,temporada,capitulo,function(data){
        $("#datos_cap_menos"+ id_serie).data("temp_actual", data.temporada);
        $("#datos_cap_menos"+ id_serie).data("cap_actual", data.capitulo_num);
        $("#datos_cap_menos"+ id_serie).data("max_cap",data.temp_max_cap);
        $("#datos_cap_mas"+ id_serie).data("temp_actual", data.temporada);
        $("#datos_cap_mas"+ id_serie).data("cap_actual", data.capitulo_num);
        $("#datos_cap_mas"+ id_serie).data("max_cap",data.temp_max_cap);
        $("#datos_del_capitulo" + id_serie).html("");
        $("#datos_del_capitulo" + id_serie).append(data.capitulo_name + " S" + data.temporada + " E" + data.capitulo_num);
          //updateamos el capitulo en usuario_se
          update_capitulo_usuario_se(id_serie,data.temporada,data.capitulo_num,data.capitulo_name,data.id);
      });
});
$("section").on('click',".epi_mas",function(e) {
  e.preventDefault();
  var maximo_capitulo_temporada = $(this).data("max_cap");
  var capitulo_actual = $(this).data("cap_actual");
  var maxima_temporada = $(this).data("ultima_temporada");
  var temporada_actual = $(this).data("temp_actual");
  var id_serie = $(this).data("serieid");
  var capitulo;
  var temporada = temporada_actual;
  //console.log("serieid " + $(this).data("serieid") + " epi_actual " + $(this).data("cap_actual")+ " temp_actual " + $(this).data("temp_actual"));
  if (capitulo_actual == maximo_capitulo_temporada) {
      capitulo = 1;
     
      if (temporada == maxima_temporada && capitulo == 1) {
        temporada = maxima_temporada;
        capitulo = maximo_capitulo_temporada;
      }
      else {
         temporada = temporada_actual + 1;
      }
  }
  else {
    capitulo = capitulo_actual + 1;
  }
  //console.log(id_serie,temporada,capitulo);
  traer_siguiente_capitulo(id_serie,temporada,capitulo,function(data){
        $("#datos_cap_mas"+ id_serie).data("temp_actual", data.temporada);
        $("#datos_cap_mas"+ id_serie).data("cap_actual", data.capitulo_num);
        $("#datos_cap_mas"+ id_serie).data("max_cap",data.temp_max_cap);
        $("#datos_cap_menos"+ id_serie).data("temp_actual", data.temporada);
        $("#datos_cap_menos"+ id_serie).data("cap_actual", data.capitulo_num);
        $("#datos_cap_menos"+ id_serie).data("max_cap",data.temp_max_cap);
        $("#datos_del_capitulo" + id_serie).html("");
        $("#datos_del_capitulo" + id_serie).append(data.capitulo_name + " S" + data.temporada + " E" + data.capitulo_num);
          //updateamos el capitulo en usuario_se
          update_capitulo_usuario_se(id_serie,data.temporada,data.capitulo_num,data.capitulo_name,data.id);
      });
});
//update del nuevo capitulo elegido
function update_capitulo_usuario_se(id_serie,temporada,capitulo_num,capitulo_name,id_capitulo) {
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) {
    tx.executeSql('UPDATE usuario_se set temporada=?,capitulo_num=?,capitulo_name=?,id_capitulo=?,modificado=DateTime("now") WHERE id_serie=?', [temporada,capitulo_num,capitulo_name,id_capitulo,id_serie], nullHandler("update ultimo epi"), errorHandler); 
  });
} 
//init
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  checkConnection();
  traer_datos();
  crear_array_series();
}

function checkConnection() {
        var networkState = navigator.network.connection.type;
        if(networkState == "none") { 
          window.location.href="no_internet.html?location=dashboard";
        }
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
    }

    
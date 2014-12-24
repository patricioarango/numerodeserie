//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	db = window.openDatabase(shortName, version, displayName, maxSize);
 	 traer_datos();
	get_user_profile();
	//Trabajando("show",5,62);
}
//traemos los datos de la db para comparar con results de busqueda
var resultados_db = [];
function traer_datos() {
  db.transaction(function(tx) {
    tx.executeSql('SELECT distinct id_serie FROM series_se', [],
      function(tx, result) {
          if (result != null && result.rows != null) {
            var row = result.rows.item
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                console.log("idseries en la db" + row.id_serie);
                resultados_db.push(row.id_serie);
            }
          }
      },nullHandler("consulta1924"),transaction_error);
  });
}
function get_user_profile() {
  $("#profile_img").attr("src",localStorage.usuario_imagen);
  $("#profile_name").html(localStorage.usuario_nombre + "!");
}

function Trabajando(action,temporadas,capitulos) {
	if (action == "show") {
        $("#dialog-overlay").show();
    }
    if (action == "hide") {
    	$("#dialog-overlay").fadeOut(500,"linear");
    	console.log("counter closed");
    }

}
//buscador
function mySearch() {
   	var buscador = escape($("#buscador").val());
   	var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
    var tamanio = "w342/"; //'w92', 'w154', 'w185', 'w342', 'w500', 'original
    var contenedor = $("#api_results");
	contenedor.show();
	contenedor.empty();
    $.post('http://autowikipedia.es/phonegap/seriesmarker_search.php', { query: buscador}, function(data) {
    		$("#no_hay_resultados").hide();
    		//console.log(data);
     		var res_bus = data.total_results;
     		var html = "";
     		if (res_bus > 0) {
     			var nombre_serie;
     			var id_serie;
     			var poster;
     			var raiting;
     			var inicio_estructura;
     			var inicio_estructura2;
     			var cierre_estructura;
     			var add_added;
     			var status;
     			$.each(data["results"], function (i, item) {
     				if (item.poster_path != null) {
     					poster = base_url+tamanio+item.poster_path;
     				} else {
     					poster = "img/series_sinposter2.png";
     				}
	     			if (res_bus == 1){
	     				inicio_estructura = "col-xs-12 resultados_search una_columna";
	     				inicio_estructura2 = '<div data-id_serie="'+ item.id + '" class="row texto_una_columna">';
     					cierre_estructura = "</div></div>";
	     			} else {
	     				inicio_estructura = "col-xs-6 resultados_search dos_columnas";
	     				inicio_estructura2 = '</div><div data-id_serie="'+ item.id + '" class="anzuelo col-xs-6 dos_columnas texto_dos_columnas">';
     					cierre_estructura = "</div>";
	     			}
	     			if ($.inArray(item.id, resultados_db) == -1) {
	     				add_added = '<p id="add_added'+ item.id + '"><i class="fa fa-square-o"></i> Add</p>';
	     				localStorage.setItem("id_serie"+item.id,"to_add");
	     				delete_status = 'style="display:none;"';
	     			} else {
	     				add_added = '<p id="add_added'+ item.id + '"><i class="fa fa-check-square-o"></i> Added</p>';
	     				localStorage.setItem("id_serie"+item.id,"added");
	     				delete_status = 'style="display:block;"';
	     			}
	     			html += '<div id="id_serie'+ item.id + '" data-id_serie="'+ item.id + '" class="anzuelo ' + inicio_estructura + '" style="background-image:url(' + poster + ');">' +
								inicio_estructura2 +
								'<p><i class="fa fa-play"></i> '+ item.name + '</p>' +
								'<p><i class="fa fa-star-o"></i> '+ item.vote_average + '</p>' +
								add_added +
								'<p id="serie_to_delete'+ item.id + '" ' + delete_status + '><i class="fa fa-trash-o"></i> Delete</p>' +
								cierre_estructura;
     			}); //each
          		contenedor.append(html);
     		} else {
     			$("#no_hay_resultados").show();
     		}
    },"json"); //post
}
var timer = 0;
$("#buscador").keyup(function() {
	$("#hola_def").hide();
	$("#no_hay_resultados").hide();
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(mySearch, 500);
});
//click en una serie
$("#api_results").on('click',".anzuelo", function() {
	var id_serie = $(this).data("id_serie");
	console.log(window.localStorage.getItem("id_serie" + id_serie));
	if (localStorage.getItem("id_serie" + id_serie) === "to_add"){
		window.localStorage.setItem("id_serie1396","added");
		procesarSerie(id_serie);
		$("#add_added" + id_serie).html("");
		$("#add_added" + id_serie).html('<i class="fa fa-check-square-o"></i> Added').hide().fadeIn(500);
		$("#serie_to_delete" + id_serie).fadeToggle(500);
	} else {
		window.localStorage.setItem("id_serie1396","to_add");
		borrarSerie(id_serie);
		$("#add_added" + id_serie).html("");
		$("#add_added" + id_serie).html('<i class="fa fa-square-o"></i> Add').hide().fadeIn(500);
		$("#serie_to_delete" + id_serie).fadeToggle();
	}
});
function procesarSerie(id_serie){
   var url ='https://api.themoviedb.org/3/tv/' + id_serie + '?api_key=c4c226b09a5a1bb1875505ebcdafaeea';
   var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
   var tamanio = "original/"; //'w92', 'w154', 'w185', w780 'w342', 'w500', 'original
   console.log(url);
   var id_serie;
   var serie_name;
   var in_production;
   var serie_seasons;
   var serie_episodes;
   var cap_num;
   var cap_name;
   var cap_temporada;
   var temp_max_cap;
   var serie_poster;
   var temp_poster;
     $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'production',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
  						//analisis x temporada
  						id_serie = json.id;
  						serie_name = json.name;
  						serie_seasons = json.number_of_seasons;
  						serie_episodes = json.number_of_episodes;
  						in_production = json.in_production;
  						serie_poster = json.poster_path;
  						//mostramos working
  						Trabajando("show");
                      	for (var i=1; i<=json.number_of_seasons; i++) {
                         	var url2 = 'https://api.themoviedb.org/3/tv/' + id_serie + '/season/' + i + '?api_key=c4c226b09a5a1bb1875505ebcdafaeea';
                          //console.log(url2);
                         	$.ajax({
                              type: 'GET',
                              url: url2,
                              async: false,
                              //jsonpCallback: 'production',
                              contentType: 'application/json',
                              dataType: 'jsonp',
                            success: function(json2) {
                                var max_capitulos = json2.episodes.length;
                                var visto;
                                for (var j=0; j < json2.episodes.length; j++) {
                                	if (json2.episodes[j].episode_number == '1' && json2.season_number == '1') {
                                		visto = 1;
                                	} else {
                                		visto = 0;
                                	}
                                temp_max_cap = json2.episodes.length;
                                cap_num = json2.episodes[j].episode_number;
                                cap_temporada = json2.season_number;
                                cap_name = json2.episodes[j].name;
                                cap_plot = json2.episodes[j].overview;
                                cap_puntaje = json2.episodes[j].vote_average;
                                temp_poster = json2.poster_path;
                                insertSE(id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_num,cap_name,cap_temporada,temp_max_cap,serie_poster,temp_poster,visto,cap_plot,cap_puntaje);
                            	}

                            },
                              	error: function(e) {
                                  console.log("error" + e.message);
                              	}
                          	}); //second ajax call
                      	}//for

            },
            error: function(e) {
                console.log("error" + e.message);
            }
        });
}
numero_insert = 1;
function insertSE(id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_num,cap_name,cap_temporada,temp_max_cap,serie_poster,temp_poster,visto,cap_plot,cap_puntaje) {
	/*console.log("id_serie" + id_serie);
	console.log("serie_name" + serie_name);
	console.log("in_production" + in_production);
	console.log("serie_seasons" + serie_seasons);
	console.log("serie_episodes" + serie_episodes);
	console.log("cap_num" + cap_num);
	console.log("cap_name" + cap_name);
	console.log("cap_temporada" + cap_temporada);
	console.log("temp_max_cap" + temp_max_cap);
	console.log("temp_poster" + temp_poster);*/
	db.transaction(function(tx) {
    tx.executeSql('INSERT INTO series_se (id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_num,cap_name,cap_temporada,temp_max_cap,serie_poster,temp_poster,visto,modificado,cap_plot) values(?,?,?,?,?,?,?,?,?,?,?,?,DateTime("now"),?,?)', [id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_num,cap_name,cap_temporada,temp_max_cap,serie_poster,temp_poster,visto,cap_plot,cap_puntaje], function(tx, results){ //funcion para mensaje
                mostrar_stats(serie_seasons,serie_episodes,numero_insert);
                ++numero_insert;
            }, transaction_error);
  });
}
function nullHandler(texto) {
	console.log(texto);
}
function transaction_error(tx, error) {
    console.log(error);
}
function borrarSerie(id_serie){
	db.transaction(function(tx) {
    tx.executeSql('DELETE FROM series_se where id_serie=?', [id_serie], nullHandler("serie" + id_serie + "borrada"), transaction_error);
  });
}
function mostrar_stats(temporadas,capitulos,insert){
	if (numero_insert <= temporadas) {
		$("#contador").html(numero_insert);
	}
	if (numero_insert <= capitulos) {
		$("#contador2").html(numero_insert);
	}
	if (numero_insert == capitulos) {
		numero_insert = 0;
		$("#contador").html("");
		$("#contador2").html("");
		Trabajando("hide");
	}
}


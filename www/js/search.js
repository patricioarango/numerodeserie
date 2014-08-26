//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

function nullHandler(){};

function successHandler(){
  console.log("oka");
};

function errorHandler(tx,error) {
   console.log('OKA: ' + error.message + ' code: ' + error.code);
}
//traemos los datos de la db para comparar con results de busqueda
var resultados_db = [];
function traer_datos() {
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT id_serie FROM series', [],
      function(transaction, result) {
          if (result != null && result.rows != null) {
            var row = result.rows.item
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                console.log("numero de serie. series en la db" + row.id_serie);
                resultados_db.push(row.id_serie);
            }
          }
      },errorHandler);
  },errorHandler,nullHandler);
}

//ADD serie de la DB
function AddValueToDB(id_serie,series_name) {
  var query="INSERT INTO series(id_serie, name) VALUES ('" + id_serie + "','" + series_name + "')";
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) {
  tx.executeSql(query,nullHandler,errorHandler);
  });
}
//UPDATE serie de la DB
function UpdateValueFromDB(id_serie,in_production, number_of_episodes,number_of_seasons,poster) {
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) {
    tx.executeSql('UPDATE series set in_production=?,number_of_episodes=?,number_of_seasons=?,poster=? WHERE id_serie=?', [in_production,number_of_episodes,number_of_seasons,poster,id_serie], nullHandler, errorHandler); 
  });
} 
//borrar serie de la DB     
function DeleteValueFromDB(id_serie) {
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) {
    tx.executeSql('DELETE FROM series WHERE series.id_serie=?', [id_serie], nullHandler, errorHandler); 
  });
  db.transaction(function(tx) {
    tx.executeSql('DELETE FROM series_se WHERE series_se.id_serie=?', [id_serie], nullHandler, errorHandler); 
  });
  db.transaction(function(tx) {
    tx.executeSql('DELETE FROM usuario_se WHERE usuario_se.id_serie=?', [id_serie], nullHandler, errorHandler); 
  });
}
function insertSE(id_serie,temporada,capitulo_num,capitulo_name,temp_max_cap,cantidad_de_temporadas) {
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO series_se (id_serie,temporada,capitulo_num,capitulo_name,temp_max_cap,temp_max) values(?,?,?,?,?,?)', [id_serie,temporada,capitulo_num,capitulo_name,temp_max_cap,cantidad_de_temporadas], nullHandler, errorHandler); 
  });
}
function insertUserSE(id_serie,temporada,capitulo_num,capitulo_name) {
  db = window.openDatabase(shortName, version, displayName, maxSize);
  db.transaction(function(tx) { 
    tx.executeSql('INSERT INTO usuario_se (id_serie,temporada,capitulo_num,capitulo_name,modificado) values(?,?,?,?,DateTime("now"))', [id_serie,temporada,capitulo_num,capitulo_name], nullHandler, errorHandler); 
  });
}
//ADD capitulos por temporada por serie
function insertar_SE(id_serie,temporada,capitulo) {
    db = window.openDatabase(shortName, version, displayName, maxSize);
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO series_se (id_serie, temporada,capitulo) VALUES (?,?,?)', [id_serie,temporada,capitulo], nullHandler, errorHandler); 
    });
}
//buscador
function mySearch() {
   var buscador = escape($("#buscador").val());
   var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
    var tamanio = "w342/"; //'w92', 'w154', 'w185', 'w342', 'w500', 'original
    $.post('http://autoplay.es/phonegap/seriesmarker_search.php', { query: buscador}, function(data) { 
      //console.log(data);
       $("#resultados_varios_contenedor").html(""); //borramos todo
            if (data["total_results"] > 1) { //si hay mas de 1 resultado armamos la lista
                for (var i=0; i < data["results"].length; i++) { 
                   //console.log(data["results"][i].id);
                   var id_serie = data["results"][i].id;
                   var titulo = data["results"][i].name;
                   var rating = data["results"][i].vote_average;
                   if (data["results"][i].poster_path != null) {
                        var poster = base_url+tamanio+data["results"][i].poster_path;
                   }
                   else { //poster default para los que no tienen
                         var poster = "img/series_sinposter2.png";
                   }
                   //si la serie ya estaba agregada, ponemos "added"
                   if ($.inArray(id_serie, resultados_db) == -1) { //resultado no esta en la db
                      $("#resultados_varios_contenedor").append("<div class='col-1-2 mobile-col-1-2'><div class='content' id='id_serie" + id_serie + "' data-id='" + id_serie + "' data-titulo='" + titulo + "' data-added='0' data-poster='" + poster + "' style='background-image: url(" + poster + ");'><div class='varios_resultados'><span style='margin-left:5px;'>" + titulo + "</span></div><div class='varios_resultados' id='estado_added" + id_serie + "'><img src='img/add_prev_w.png' height='15px' /><span style='margin-left:5px;'>Add</span></div><div class='varios_resultados'><img src='img/rating_w.png' height='15px' /><span style='margin-left:5px;'>" + rating + "</span></div></div>");
                   }
                    else { //resultado ya esta en la db
                        $("#resultados_varios_contenedor").append("<div class='col-1-2 mobile-col-1-2'><div class='content' id='id_serie" + id_serie + "' data-id='" + id_serie + "' data-titulo='" + titulo + "' data-added='1' data-poster='" + poster + "' style='background-image: url(" + poster + ");'><div class='varios_resultados'><span style='margin-left:5px;'>" + titulo + "</span></div><div class='varios_resultados' id='estado_added" + id_serie + "'><img src='img/added_w.png' height='15px' /><span style='margin-left:5px;'>Added</span></div><div class='varios_resultados'><img src='img/rating_w.png' height='15px' /><span style='margin-left:5px;'>" + rating + "</span></div></div>");
                    }
                }  //for
                // le damos altura a los divs
                var alto_para_divs = ( ($(".content").width() * 1426) / 1000 );
                $(".content").height(alto_para_divs); 
          } //if
        else if (data["total_results"] == 1) { //si hay 1 solo resultado
            var id_serie = data["results"][0].id;
            var titulo = data["results"][0].name;
            var rating = data["results"][0].vote_average;
            if (data["results"][0].poster_path != null) {
                        var poster = base_url+tamanio+data["results"][0].poster_path;
                   }
                   else { //poster default para los que no tienen
                         var poster = "img/series_sinposter2.png";
                   }
             //si la serie ya estaba agregada, ponemos "added"
            $("#resultados").html("");
            if ($.inArray(id_serie, resultados_db) == -1) { // resultado no esta en la db
              $("#resultados").append("<div class='grid grid-pad' id='resultados_varios_contenedor'><div class='grid grid-pad'><div class='resultado_unico' id='id_serie" + id_serie + "' data-id='" + id_serie + "' data-titulo='" + titulo + "' data-added='0' data-poster='" + poster + "' style='background-image: url(" + poster + ");'><div class='varios_resultados2'><span style='margin-left:5px;'>" + titulo + "</span></div><div class='varios_resultados2' id='estado_added" + id_serie + "'><img src='img/add_prev_w.png' height='30px' /><span style='margin-left:5px;'>Add</span></div><div class='varios_resultados'><img src='img/rating_w.png' height='30px' /><span style='margin-left:5px;'>" + rating + "</span></div></div></div>");
            }
            else {  //resultado coincide con la db
              $("#resultados").append("<div class='grid grid-pad' id='resultados_varios_contenedor'><div class='grid grid-pad'><div class='resultado_unico' id='id_serie" + id_serie + "' data-id='" + id_serie + "' data-titulo='" + titulo + "' data-added='1' data-poster='" + poster + "' style='background-image: url(" + poster + ");'><div class='varios_resultados2'><span style='margin-left:5px;'>" + titulo + "</span></div><div class='varios_resultados2' id='estado_added" + id_serie + "'><img src='img/added_w.png' height='30px' /><span style='margin-left:5px;'>Added</span></div><div class='varios_resultados'><img src='img/rating_w.png' height='30px' /><span style='margin-left:5px;'>" + rating + "</span></div></div></div>");
            }       
            // le damos altura a los divs
                var alto_para_div = ( ( ($("body").height() * 0.65) * 1000) / 1426 );
                $(".resultado_unico").height(alto_para_div); 
        }
        else  { //no hay resultados
            $("#resultados_varios_contenedor").append("<div id='no_results'>" + "<img src='img/no_results2.png' width='40%' />" + "<div style='padding-top:10%;'>" + "No results. <br>Please type again to search.</div></div>");
          } 
    },"json"); //post
}
var timer = 0;
$("#buscador").keyup(function() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(mySearch, 500);
});
//add del series to db varios results
$("#resultados").on('click',".content", function() {
  if ($( this ).data('added') == 0) {
    $("#estado_added" + $( this ).data('id')).html('');
    $("#estado_added" + $( this ).data('id')).append("<img src='img/added_w.png' height='15px' /><span style='margin-left:5px;'>Added</span>");
    $( this ).data('added', '1');
    alert("procesar serie" + $( this ).data('id'));
   AddValueToDB($( this ).data('id'), $( this ).data('titulo'));
   procesarSerie($( this ).data('id'));
  }
  else if ($( this ).data('added') == 1) {
    $("#estado_added" + $( this ).data('id')).html('');
    $("#estado_added" + $( this ).data('id')).append("<img src='img/add_prev_w.png' height='15px' /><span style='margin-left:5px;'>Add</span>");
    $( this ).data('added', '0');
  DeleteValueFromDB($( this ).data('id'));
  }
  //console.log($( this ).data('id')); console.log($( this ).data('titulo')); console.log($( this ).data('poster'));
});
//funcion ADD para proceso unico
$("#resultados").on('click',".resultado_unico", function() {
  if ($( this ).data('added') == 0) {
    $("#estado_added" + $( this ).data('id')).html('');
    $("#estado_added" + $( this ).data('id')).append("<img src='img/added_w.png' height='30px' /><span style='margin-left:5px;'>Added</span>");
    $( this ).data('added', '1');
   AddValueToDB($( this ).data('id'), $( this ).data('titulo'));
   procesarSerie($( this ).data('id'));
  }
  else if ($( this ).data('added') == 1) {
    $("#estado_added" + $( this ).data('id')).html('');
    $("#estado_added" + $( this ).data('id')).append("<img src='img/add_prev_w.png' height='30px' /><span style='margin-left:5px;'>Add</span>");
    $( this ).data('added', '0');
  DeleteValueFromDB($( this ).data('id'));
  }
  //console.log($( this ).data('id')); console.log($( this ).data('titulo')); console.log($( this ).data('poster'));
});
//procesar los capitulos de la serie agregada
function procesarSerie(id_serie){
   var url ='https://api.themoviedb.org/3/tv/' + id_serie + '?api_key=c4c226b09a5a1bb1875505ebcdafaeea';
   var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
   var tamanio = "original/"; //'w92', 'w154', 'w185', w780 'w342', 'w500', 'original
     $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'production',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
              var poster = base_url + tamanio + json.poster_path;
                //update de serie
                UpdateValueFromDB(id_serie,json.in_production,json.number_of_episodes,json.number_of_seasons,poster);
                      //ahora vemos cuantos episodes tiene cada temporada
                      var cantidad_de_temporadas = json.number_of_seasons;
                      for (var i=1; i<=json.number_of_seasons; i++) { 
                          var url2 = 'https://api.themoviedb.org/3/tv/' + id_serie + '/season/' + i + '?api_key=c4c226b09a5a1bb1875505ebcdafaeea';
                          console.log(url2);
                          $.ajax({
                              type: 'GET',
                              url: url2,
                              async: false,
                              //jsonpCallback: 'production',
                              contentType: 'application/json',
                              dataType: 'jsonp',
                              success: function(json2) {
                                var max_capitulos = json2.episodes.length;
                                for (var j=0; j < json2.episodes.length; j++) { 
                                  if (json2.episodes[j].episode_number == '1' && json2.season_number == '1') {
                                    //insert default en tabla de usuario
                                   insertUserSE(id_serie,json2.season_number,json2.episodes[j].episode_number,json2.episodes[j].name);
                                  } 
                                   insertSE(id_serie,json2.season_number,json2.episodes[j].episode_number,json2.episodes[j].name,max_capitulos,cantidad_de_temporadas);
                                }   
                              },
                              error: function(e) {
                                  console.log(e.message);
                              }
                          }); //second ajax call
                      }//for 
            },
            error: function(e) {
                console.log(e.message);
            }
        });
}
   
 document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        checkConnection();
        traer_datos();
    }

    function checkConnection() {
        var networkState = navigator.network.connection.type;
        if(networkState == "none") { 
          window.location.href="no_internet.html?location=search";
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

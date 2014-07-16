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

function mySearch() {
   var buscador = escape($("#buscador").val());
   var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
    var tamanio = "w342/"; //'w92', 'w154', 'w185', 'w342', 'w500', 'original
    $.post('http://autoplay.es/phonegap/seriesmarker_search.php', { query: buscador}, function(data) { console.log(data);
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
                    $("#resultados_varios_contenedor").append("<div class='col-1-2 mobile-col-1-2'><div class='content' data-id='" + id_serie + "' data-titulo='" + titulo + "' data-temporadas='7' style='background-image: url(" + poster + ");'><div class='varios_resultados'><img src='img/add_prev_w.png' height='15px' /><span style='margin-left:5px;'>" + titulo + "</span></div><div class='varios_resultados'><img src='img/rating_w.png' height='15px' /><span style='margin-left:5px;'>" + rating + "</span></div></div>");
                }  //for
                // le damos altura a los divs
                var alto_para_divs = ( ($(".content").width() * 1426) / 1000 );
                $(".content").height(alto_para_divs); 
          } //if
         else if (data["total_results"] == 1) { //si hay 1 solo resultado
            alert("hay solo 1");
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
$(document).on('deviceready', function() {
    get_usuario();
});


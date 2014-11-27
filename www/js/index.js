//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    get_background();
    crearDB();
    //creamos la db y las tablas
    var permiso = window.localStorage.getItem("permiso_otorgado");
    var permiso = 2;
    if (permiso=="2") {
        window.location.href = 'dashboard.html';
    }
    else {

        pedir_autenticacion();
    }
}

var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
        $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }

            if (code) { 
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};
function get_background(){
    var base_url = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/";
    var tamanio = "w780/"; //"original/"; //"w780/"; // or w500 
    var query = "2";
    $.post('http://autowikipedia.es/phonegap/seriesmarker_get_fondos.php',{ buscar: query }, function(data) {
        var maximo = Number(data["results"].length);
        for (var i=0; i < maximo; i++) {
            if (data["results"][i].poster_path != null) { //solo para imagenes not null 
            rule1 = ".bg"+i+" { background: url('"+base_url+tamanio+data["results"][i].poster_path+"') center center fixed; ";
            rule2 ="background-size: cover;";
            rule3 ="background-repeat:no-repeat; transition: background 0.5s ease-in;";
            rule4 = "-webkit-background-size: cover;";
            rule5 = "-moz-background-size: cover;";
            rule6 = "-o-background-size: cover; }";
                $("style").append(rule1);
                $("style").append(rule2);
                $("style").append(rule3);
                $("style").append(rule4);
                $("style").append(rule5);
                $("style").append(rule6);
            }
        }
        //clase random para precargador
        var number = 1 + Math.floor(Math.random() * maximo);
        var claserandom = "bg" + number;
        $("#precargador").removeClass("bg2");
        $("#precargador").addClass(claserandom);
        //llamamos a la funcion que cambia el fondo cada 3s
       var intervalo = setInterval(function(){cambiar_fondo(maximo)}, 6500);
        
        function cambiar_fondo(maximo) {
            //mostramos login
            $("#login_contenedor").fadeIn(500);
            var maximo2 = (maximo - 1);
            //sacamos al body la clase que tiene y le ponemos la del precargador
            $("body").switchClass($("body").attr('class'),$('#precargador').attr('class'),"easeOutBounce");
            //clase nueva para el precargador
            var clase_nueva = $('#precargador').attr('class');
            $("#precargador").removeClass(clase_nueva);
            var numero_clase = Number(clase_nueva.substring(2));
            if (numero_clase == maximo2 || numero_clase > maximo2) {
                $("#precargador").addClass("bg1"); 
               // clearInterval(intervalo); //detener fondo giratorio
            }
            else {
                $("#precargador").addClass("bg" + (numero_clase + 1));  
            }
        }
        
    },"json");
}

function nullHandler(testo){
  //alert(testo);
};

function successHandler(){
  console.log("oka");
};

function errorHandler(tx,error) {
   console.log('OKA: ' + error.message + ' code: ' + error.code);
}

//error o success
function errorCB(err) {
        console.log("Error processing SQL: " + err.message);
//        alert("Error processing SQL: " + err.message);
}
function successCB() {
        //console.log("tablas creadas");
//       alert("tablas creadas");
}
//crear db y tablas
function crearDB() { 
    var db = window.openDatabase(shortName, version, displayName, maxSize);
    db.transaction(creacionDB, nullHandler, errorHandler);
}
function creacionDB(tx) {
      var sql3 = "CREATE TABLE IF NOT EXISTS series_se (id unique,id_serie ,serie_name,in_production,serie_seasons,serie_episodes,cap_temporada,cap_num,cap_name,temp_max_cap,serie_poster,temp_poster)";
    tx.executeSql(sql3);
    //crear tabla usuario_serie_temporada para guardar los valores del usuario
    var sql4 = "CREATE TABLE IF NOT EXISTS usuario_se (id unique,id_serie,serie_name,in_production,serie_seasons,serie_episodes,cap_temporada,cap_num,cap_name,temp_max_cap,serie_poster,temp_poster)";
    tx.executeSql(sql4);
}

function pedir_autenticacion() {
    var $loginButton = $('#login_img');
    var $loginStatus = $('#login_div');
    $loginButton.on('click', function() { 
        googleapi.authorize({
            client_id: '150881333908-1ar412eou7ovegc9brhkuhjde4kr5d44.apps.googleusercontent.com',
            client_secret: 'ZG_u5iJYAnTjL3u72lxQEpQr',
            redirect_uri: 'http://localhost',
            //redirect_uri: 'http://localhost/numerodeserie/www/',
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        }).done(function(data) {
            //$loginStatus.html('Access Token: ' + data.access_token);
            var toka_toka=data.access_token;
            //ocultar boton
            $("#login").hide();
            $.post('http://autowikipedia.es/phonegap/seriesmarker_get_data.php', { parametro: toka_toka}, function(data23) {
                //insertamos el usuario en la db
                window.localStorage.setItem("usuario_id", data23.id);   
                window.localStorage.setItem("usuario_nombre", data23.given_name );   
                window.localStorage.setItem("usuario_apellido", data23.family_name);   
                window.localStorage.setItem("usuario_email", data23.email);   
                window.localStorage.setItem("usuario_imagen", data23.picture);   
                window.localStorage.setItem("permiso_otorgado","2");
                window.location.href = 'dashboard.html';
            },"json");
        }).fail(function(data) {
            $loginStatus.html(data.error);
        });
    });
}




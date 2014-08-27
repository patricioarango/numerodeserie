//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

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

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
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
    $.post('http://autoplay.es/phonegap/seriesmarker_get_fondos.php',{ buscar: query }, function(data) {
        var maximo = Number(data["results"].length);
        for (var i=0; i<data["results"].length; i++) { 
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
        setInterval(function(){cambiar_fondo(maximo)}, 6500);
        
        function cambiar_fondo(maximo) {
            var maximo2 = maximo;
            //sacamos al body la clase que tiene y le ponemos la del precargador
            $("body").switchClass($("body").attr('class'),$('#precargador').attr('class'),"easeOutBounce");
            //clase nueva para el precargador
            var clase_nueva = $('#precargador').attr('class');
            $("#precargador").removeClass(clase_nueva);
            var numero_clase = clase_nueva.substring(2);
            numero_clase = Number(numero_clase);
            if (numero_clase == maximo2) {
                $("#precargador").addClass("bg1"); 
            }
            else {
                $("#precargador").addClass("bg" + (numero_clase + 1));  
            }
        }
        
    },"json");
}


//error o success
function errorCB(err) {
        console.log("Error processing SQL: " + err.message);
        alert("Error processing SQL: " + err.message);
}
function successCB() {
        console.log("tablas creadas");
       alert("tablas creadas");
}
//funcion crear db y tablas
function crearDB() { 
    var db = window.openDatabase(shortName, version, displayName, maxSize);
    db.transaction(populateDB, errorCB, successCB);
}
function populateDB(tx) { 
      //tabla usuario
  var sql = "CREATE TABLE IF NOT EXISTS usuario (id INTEGER NOT NULL PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT, image TEXT)";
    tx.executeSql(sql);
    //tabla series
    var sql2 = "CREATE TABLE IF NOT EXISTS series (id unique, id_serie,name,in_production,number_of_seasons, number_of_episodes,poster)";
    tx.executeSql(sql2);
    //guardar temporadas y capitulos de cada una test_serie.php
     var sql3 = "CREATE TABLE IF NOT EXISTS series_se (id unique,id_serie,temporada,capitulo_num,capitulo_name, capitulo_orden,temp_max,temp_max_cap)";
    tx.executeSql(sql3);
    //crear tabla usuario_serie_temporada para guardar los valores del usuario
    var sql4 = "CREATE TABLE IF NOT EXISTS usuario_se (id unique,id_serie,temporada,capitulo_num,capitulo_name,modificado)";
/*
    //tabla usuario
    var sql = "CREATE TABLE IF NOT EXISTS usuario (id INTEGER NOT NULL PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT, image TEXT)";
    tx.executeSql(sql);
    //tabla series
    var sql2 = "CREATE TABLE IF NOT EXISTS series (id INTEGER NOT NULL PRIMARY KEY, id_serie INTEGER,name TEXT, in_production TEXT,number_of_seasons INTEGER, number_of_episodes INTEGER, poster TEXT)";
    tx.executeSql(sql2);
    //guardar temporadas y capitulos de cada una test_serie.php
     var sql3 = "CREATE TABLE IF NOT EXISTS series_se (id INTEGER NOT NULL PRIMARY KEY,id_serie INTEGER,temporada INTEGER, capitulo_num INTEGER,capitulo_name TEXT, capitulo_orden INTEGER,temp_max INTEGER,temp_max_cap INTEGER)";
    tx.executeSql(sql3);
    //crear tabla usuario_serie_temporada para guardar los valores del usuario
    var sql4 = "CREATE TABLE IF NOT EXISTS usuario_se (id INTEGER NOT NULL PRIMARY KEY,id_serie INTEGER,temporada INTEGER, capitulo_num INTEGER,capitulo_name TEXT,modificado TEXT)";
    tx.executeSql(sql4); */
}
//insertar usuario 
function meter_usuario() {
    db = window.openDatabase(shortName, version, displayName, maxSize);
    db.transaction(insertar_usuario, errorCB, successCB);
}
function insertar_usuario(tx) {
    var query = "insert into usuario (id,firstName,lastName,email,image) values ('" + localStorage.usuario_id + "','" + localStorage.usuario_nombre + "','" + localStorage.usuario_apellido + "','" + localStorage.usuario_email + "','" + localStorage.usuario_imagen + "')";                     
    tx.executeSql(query);
}              
function pedir_autenticacion() {
    $("#login").show();
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
            $.post('http://autoplay.es/phonegap/seriesmarker_get_data.php', { parametro: toka_toka}, function(data23) {
                //alert("id: "+ data23.id + "nom: " + data23.given_name + "ape: " + data23.family_name + "email: " + data23.email + "foto: " + data23.picture);
                //insertamos el usuario en la db 
                //meter_usuario();
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


function onDeviceReady() {
    get_background();
    crearDB();
    //creamos la db y las tablas
    var permiso = window.localStorage.getItem("permiso_otorgado");
    //var permiso = 0;
    if (permiso=="2") {
        window.location.href = 'dashboard.html';
    }
    else {
        
        pedir_autenticacion();
    }
}

document.addEventListener("deviceready", onDeviceReady, false);

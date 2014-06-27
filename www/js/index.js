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
    var tamanio = "w780"; // or w500 
    var query = "2";
    $.post('test2.php',{ buscar: query }, function(data) { 
        var maximo = Number(data["results"].length);
        for (var i=0; i<data["results"].length; i++) { 
            rule1 = ".bg"+i+" { background: url('"+base_url+tamanio+data["results"][i].poster_path+"') center center fixed; ";
            rule2 ="background-size: cover;";
            rule3 ="background-repeat:no-repeat; transition: background 0.5s ease-in;}";
                $("style").append(rule1);
                $("style").append(rule2);
                $("style").append(rule3);
        }
        //clase random para precargador
        var number = 1 + Math.floor(Math.random() * maximo);
        var claserandom = "bg" + number;
        $("#precargador").removeClass("bg2");
        $("#precargador").addClass(claserandom);
        //llamamos a la funcion que cambia el fondo cada 3s
        setInterval(function(){cambiar_fondo(maximo)}, 5000);
        
        function cambiar_fondo(maximo) {
            var maximo2 = maximo;
            //sacamos al body la clase que tiene y le ponemos la del precargador
            $("body").switchClass($("body").attr('class'),$('#precargador').attr('class'),"easeOutBounce");
            //$("body").removeClass($("body").attr('class'));
            //$("body").addClass($('#precargador').attr('class')); 
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
$(document).on('deviceready', function() {
    get_background();
    var $loginButton = $('#login_img');
    var $loginStatus = $('#login_div');

    $loginButton.on('click', function() {
        googleapi.authorize({
            client_id: '150881333908-1ar412eou7ovegc9brhkuhjde4kr5d44.apps.googleusercontent.com',
            client_secret: 'ZG_u5iJYAnTjL3u72lxQEpQr',
            redirect_uri: 'http://localhost',
            //scope: 'https://www.googleapis.com/auth/plus.login'
            scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
        }).done(function(data) {
            $loginStatus.html('Access Token: ' + data.access_token);
            //ocultar boton
            $("#login").hide();
           /*for (var i in data) {
            out = "";
            alert(data[i]);
            }*/
           //acá hay que hacer una llamada tipo "me" porque ya logueado va a traer la info de la persona 
           //gapi.client.load('plus','v1', loadProfile); 
           var url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+data.access_token;
           $.getJSON(url, function(data2){
		        //alert(data2);
                alert(data.name);
		        //id
		        //link
		        //picture
		    });
           /*$.post(url, {}, function(data) {
               alert(data.name);
           },"json");*/
           
        }).fail(function(data) {
            $loginStatus.html(data.error);
        });
    });
});


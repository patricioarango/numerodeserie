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

$(document).on('deviceready', function() {
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
           gapi.client.load('plus','v1', loadProfile); 
        }).fail(function(data) {
            $loginStatus.html(data.error);
        });
    });
});

function loadProfile(){
    var request = gapi.client.plus.people.get( {'userId' : 'me'} );
    request.execute(loadProfileCallback);
  }

  function loadProfileCallback(obj) {
    profile = obj;

    // Filter the emails object to find the user's primary account, which might
    // not always be the first in the array. The filter() method supports IE9+.
    email = obj['emails'].filter(function(v) {
        return v.type === 'account'; // Filter out the primary email
    })[0].value; // get the email from the filtered results, should always be defined.
    displayProfile(profile);
  }

  /**
   * Display the user's basic profile information from the profile object.
   */
  function displayProfile(profile){
    alert(profile['displayName']);
    alert(email);
    //document.getElementById('name').innerHTML = profile['displayName'];
    //document.getElementById('pic').innerHTML = '<img src="' + profile['image']['url'] + '" />';
    //document.getElementById('email').innerHTML = email;
    //toggleElement('profile');
  }

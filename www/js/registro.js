function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
var nombre = decodeURIComponent(getUrlParameter('nombre'));
var email = decodeURIComponent(getUrlParameter('email'));
$.post('http://autowikipedia.es/phonegap/seriesmarker_insert_user.php', {nombre: nombre, email: email}, function(data) {
    window.localStorage.setItem("permiso_otorgado","2");
    window.localStorage.setItem("usuario_nombre", nombre);
    window.localStorage.setItem("usuario_email", email);
    window.localStorage.setItem("usuario_imagen", "img/usuario_default.jpg");
    window.location.href = "dashboard.html";
});




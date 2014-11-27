//variables globales de DDBB
var db;
var shortName = 'Seriesmarker';
var version = '1.0';
var displayName = 'Seriesmarker';
var maxSize = 65535;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  //traer_datos();
  get_user_profile();
}

function get_user_profile() {
  $("#profile_img").attr("src",localStorage.usuario_imagen);
  $("#profile_name").html(localStorage.usuario_nombre + "!");
}

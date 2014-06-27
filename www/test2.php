<?php
//MovieDB.org
//api key api_key=c4c226b09a5a1bb1875505ebcdafaeea
//base url images http://d3gtl9l2a4fn1j.cloudfront.net/t/p/	
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.themoviedb.org/3/tv/popular?api_key=c4c226b09a5a1bb1875505ebcdafaeea");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, FALSE);

curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  "Accept: application/json"
));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
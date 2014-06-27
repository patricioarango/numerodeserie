<?php
$accessToken = $_POST["parametro"];
$userDetails = file_get_contents('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' . $accessToken);
echo $userDetails;
?>
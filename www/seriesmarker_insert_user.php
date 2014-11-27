<?php
$dbHost = "";
$dbUser = "";
$dbPass = "";
$dbName = "";

$conn = new mysqli($dbHost, $dbUser, $dbPass , $dbName);
if ($conn->connect_errno) {
    echo "Falló la conexión a MySQL: (" . $conn->connect_errno . ") " . $conn->connect_error;
}
$stmt = $conn->prepare("INSERT INTO z_phonegap_seriesmarker (nombre,email) VALUES (?,?)");
$stmt->bind_param('ss', $_POST[nombre],$_POST[email]);
$stmt->execute();
$stmt->close();
echo "OK";
?>

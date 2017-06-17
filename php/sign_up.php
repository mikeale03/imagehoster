<?php
session_start();
require_once 'Connector.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$email = $request->email;
$pass = $request->password;
$response = array();
$stmt = $con->prepare(" INSERT INTO users (email_ad,password)
         VALUES (:email_ad,:password) ");
$stmt->bindParam(":email_ad", $email);
$stmt->bindParam(':password',$pass);
try {
  $stmt->execute();
    $_SESSION["email"] = $email;
    $_SESSION["id"] = $con->lastInsertId();;
    $_SESSION["log_in"] = true;
    echo json_encode($_SESSION);

} catch (PDOException $e) {
  //var_dump($e->getCode());
  if($e->getCode() == 23000 ) {
    $response["log_in"] = null;
    $response["error_msg"] = "Email already exist!";
  } else {
    echo $e;
    $response["log_in"] = null;
    $response["error_msg"] = "Registration Error!";
  }
  echo json_encode($response);
}
$connector->disconnect();

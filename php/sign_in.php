<?php
  session_start();
  require_once 'Connector.php';
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $email = $request->email;
  $pass = $request->password;
  $response = array();
  $stmt = $con->prepare(" SELECT * FROM users where email_ad = :email_ad ");
  $stmt->bindParam(':email_ad',$email);
  
  $stmt->execute();
  if($user=$stmt->fetch(PDO::FETCH_ASSOC)) {
    if($user["password"] == $pass) {
      $user["log_in"] = true;
      $_SESSION["email"] = $user['email_ad'];
      $_SESSION["id"] = $user['user_id'];
      $_SESSION["log_in"] = true;
      //echo json_encode($user);
    } else {
      $user["log_in"] = null;
      $user["error_num"] = 2;
      $user["error_msg"] = "Password is Incorrect!";
    }
  } else {
    $user["log_in"] = null;
    $user["error_num"] = 1;
    $user["error_msg"] = "Invalid Email!";
  }
  echo json_encode($user);
  $connector->disconnect();

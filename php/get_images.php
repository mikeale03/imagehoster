<?php
  session_start();
  if(isset($_SESSION['id'])) {
    require_once 'Connector.php';
    $stmt = $con->prepare(" SELECT * FROM images where user_id = :user");
    $stmt->bindParam(':user',$_SESSION['id']);
    $stmt->execute();
    $response = array();
    while($result=$stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($response, $result);
    }
    echo json_encode($response);
  }

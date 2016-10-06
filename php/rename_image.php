<?php
  session_start();
  if(isset($_SESSION['id'])) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once 'Connector.php';
    $stmt = $con->prepare(" UPDATE images SET image_name = :name WHERE image_id = :id");
    $stmt->bindParam(':name',$request->imageName);
    $stmt->bindParam(':id',$request->imageId);
    $response = array();
    if($stmt->execute()) {
      $response["updated"] = true;
    } else {
      $response["updated"] = false;
    }
    echo json_encode($response);
  }

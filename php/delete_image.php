<?php
  session_start();
  if(isset($_SESSION['id'])) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once 'Connector.php';
    $stmt = $con->prepare(" DELETE FROM images where image_id = :id");
    $stmt->bindParam(':id',$request->imageId);

    $response = array();
    if($stmt->execute()) {
      $response["deleted"] = true;
    } else {
      $response["deleted"] = false;
    }
    echo json_encode($response);
  }

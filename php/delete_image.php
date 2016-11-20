<?php
  session_start();
  if(isset($_SESSION['id'])) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once 'Connector.php';
    $sql = "SELECT * FROM images where image_id = ".$request->imageId;
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $result=$stmt->fetch(PDO::FETCH_ASSOC);
    //var_dump($sql);
    //var_dump($result['image_url']);
    $stmt = $con->prepare(" DELETE FROM images where image_id = :id");
    $stmt->bindParam(':id',$request->imageId);
    $response = array();
    if($stmt->execute() && unlink("../".$result['image_url'])) {
      $response["deleted"] = true;
    } else {
      $response["deleted"] = false;
    }
    echo json_encode($response);
  }

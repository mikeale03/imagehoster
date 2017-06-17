<?php
  session_start();
  if(isset($_SESSION['id'])) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    require_once 'Connector.php';
    $sql = "SELECT * FROM images where image_id = :id";
    $stmt = $con->prepare($sql);
    $stmt->bindParam(':id',$request->image_id);
    $stmt->execute();
    $response = array();
    if($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $stmt = $con->prepare(" DELETE FROM images where image_id = :id");
      $stmt->bindParam(':id',$result['image_id']);
      if( unlink("../".$result['image_url']) && $stmt->execute()) {
        $response["deleted"] = true;
      } else {
        $response["deleted"] = false;
      }
    } else {
      $response["deleted"] = false;
      //var_dump($result);
    }
    echo json_encode($response);
  }

<?php
session_start();

//header('Content-Type: text/plain; charset=utf-8');
require_once 'Connector.php';
if(isset($_SESSION["id"])) {

  $user_id = $_SESSION["id"];
  //var_dump($_FILES);
} else {
  $user_id ="";
}
try {

    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (
        !isset($_FILES['file']['error']) ||
        is_array($_FILES['file']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    // Check $_FILES['file']['error'] value.
    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // You should also check filesize here.
    if ($_FILES['file']['size'] > 1000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }

    // DO NOT TRUST $_FILES['file']['mime'] VALUE !!
    // Check MIME Type by yourself.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($_FILES['file']['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }

    // You should name it uniquely.
    // DO NOT USE $_FILES['file']['name'] WITHOUT ANY VALIDATION !!
    // On this example, obtain safe unique name from its binary data.
    $path = sprintf('uploads/'.$user_id.'_%s.%s',
        sha1_file($_FILES['file']['tmp_name']),
        $ext
    );
    if (!move_uploaded_file(
        $_FILES['file']['tmp_name'],
        '../'.$path
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }
    $response = array();
    if($user_id) {
      $stmt = $con->prepare("INSERT INTO images VALUES (NULL,:image_url,:image_name,:user_id)");
      $stmt->bindParam(':image_url',$path);
      $stmt->bindParam(':image_name',$_FILES['file']['name']);
      $stmt->bindParam(':user_id',$user_id);
      if($stmt->execute()) {
        $response["success"] = true;
        $response["url"] = $path;
        echo json_encode($response);
      }
    } else {
      $response["success"] = true;
      $response["url"] = $path;
      echo json_encode($response);
    }

} catch (RuntimeException $e) {

    echo $e->getMessage();
}
$connector->disconnect();

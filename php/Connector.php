<?php
  class Connector{
    private $servername;
    private $dbname;
    private $password;
    private $username;
    private $conn;
    /*private var $stmt;
    function __construct(){
      $this->servername = "localhost";
      $this->dbname = "gotquiz";
      $this->username = "root";
      $this->password = "";
    }*/
    function setConnect($serv, $db, $user, $pass){
      $this->servername = $serv;
      $this->dbname = $db;
      $this->password = $pass;
      $this->username = $user;
    }
    function getConnect(){
      try{
        $this->conn = new PDO("mysql:host=$this->servername;dbname=$this->dbname", $this->username, $this->password);
      	$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //echo "Connected successfully";
        return $this->conn;
      }
      catch(PDOException $e)
      {
         	echo "Connection failed: " . $e->getMessage();
      }
    }

    function disconnect(){
      $this->conn = null;
    }
    function getConn(){
      return $this->conn;
    }
  }
  $connector = new Connector;
  $connector->setConnect("localhost", "ImageHost", "root", "");
  $con = $connector->getConnect();

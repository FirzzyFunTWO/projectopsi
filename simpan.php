<?php
$data = file_get_contents("php://input");
file_put_contents("data.json", $data);
echo "OK";
?>

<?php  
header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type');
header('Access-Control-Allow-Origin: *');
// header('Content-Type: application/json, charset=utf-8');

// echo '<pre>';echo $_REQUEST; exit;  
$_POST = json_decode(file_get_contents('php://input'), true);
$newJsonString = json_encode($_POST);
file_put_contents('../assets/data.json', $newJsonString);
// print_r($_POST);
$jsonString = file_get_contents('../assets/data.json');
echo $jsonString."<br><br><br><br><br><br><br><br><br>";



if (($json = file_get_contents('../assets/data.json')) == false)
        die('Error reading json file...');
    $data = json_decode($json, true);
    $fp = fopen('../assets/data.csv', 'w');
    $header = false;
    foreach ($data as $row)
    {
        if (empty($header))
        {
            $header = array_keys($row);
            fputcsv($fp, $header);
            $header = array_flip($header);
        }
        fputcsv($fp, array_merge($header, $row));
    }
    fclose($fp);
    return;
print_r('Converted Successfully');
 ?>
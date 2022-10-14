<?php  
error_reporting(0);
if (($handle = fopen("../assets/data.csv", "r")) !== FALSE) {
    $csvs = [];
    while(! feof($handle)) {
       $csvs[] = fgetcsv($handle);
    }
    $datas = [];
    $column_names = [];
    foreach ($csvs[0] as $single_csv) {
        $column_names[] = $single_csv;
    }
    foreach ($csvs as $key => $csv) {
        if ($key === 0) {
            continue;
        }
        foreach ($column_names as $column_key => $column_name) {
            $datas[$key-1][$column_name] = $csv[$column_key];
        }
    }
    $json = json_encode($datas);
    fclose($handle);
    print_r($json);die;
//$jsonString = file_get_contents('../assets/data.json');
echo $jsonString;die;

}
 ?>
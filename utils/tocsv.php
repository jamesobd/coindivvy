<?php
header('Content-type: application/json');

// Set your CSV feed
$feed = 'csv.csv';

// Arrays we'll use later
$keys = array();
$newArray = array();

// Function to convert CSV into associative array
function csvToArray($file, $delimiter)
{
    if (($handle = fopen($file, 'r')) !== FALSE) {
        $i = 0;
        while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
            for ($j = 0; $j < count($lineArray); $j++) {
                $arr[$i][$j] = $lineArray[$j];
            }
            $i++;
        }
        fclose($handle);
    }
    return $arr;
}

// Do it
$data = csvToArray($feed, ',');

// Set number of elements (minus 1 because we shift off the first row)
$count = count($data) - 1;

//Use first row for names  
$labels = array_shift($data);

foreach ($labels as $label) {
    $keys[] = $label;
}

// Add Ids, just in case we want them later
//$keys[] = 'id';

//for ($i = 0; $i < $count; $i++) {
//    $data[$i][] = $i;
//}

// Bring it all together
for ($j = 0; $j < $count; $j++) {
    $d = array_combine($keys, $data[$j]);


    $newArray[$j] = $d;
}

$accounts = array();
$currentAccount = "";
$i = -1;
foreach ($newArray as $address) {
    if ($currentAccount != $address['account']) {
        $currentAccount = $address['account'];
        $accounts[] = array('name' => $address['account'],
                            'address' => 'asdf',
                            'owner' => 'delmonger',
                            'coin_type' => 'bitcoin',
                            'addresses' => array());
        $i++;
    }
    $accounts[$i]['addresses'][] = array('address' => $address['address'],
                                         'name' => $address['address_name'],
                                         'hashes' => $address['hashes'] * 1000000000);
}


// Print it out as JSON
echo json_encode($accounts);

?>
<?php
$dataSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ1poMxatFwcquqhIH57EPlaVLYCcRs4a3a0hUv643uNRo7jKPKdMu_Ez2OBkJX3ifWGJb_ODz9s0E/pub?gid=1257776065&single=true&output=csv";

// hilangkan "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8XV9YgALoPQqoBRuqvieyC0rd8BMSgtlIjqokk0q406jdfWzfejpTEwfjqxwqiGYNL_JfGyL9sPnz/pub?gid=556714957&single=true&output=csv";


//"https://docs.google.com/spreadsheets/d/e/2PACX-1vQSuXDoyif4yWwso4vWw0LVEHSG5dm9tJtatBAIH8WxAkxMr-LnuBXdppEQWjQ6xG75JcO4xsjCdZzv/pub?gid=2144842770&single=true&output=csv";

$rowCount = 0;
$features = array();
$error = FALSE;
$output = array();

// attempt to set the socket timeout, if it fails then echo an error
if (!ini_set('default_socket_timeout', 15)) {
  $output = array('error' => 'Unable to Change PHP Socket Timeout');
  $error = TRUE;
} // end if, set socket timeout

// if the opening the CSV file handler does not fail
if (!$error && (($dataHandle = fopen($dataSpreadsheetUrl, "r")) !== FALSE)) {
  // while CSV has data, read up to 10000 rows
  while (($csvRow = fgetcsv($dataHandle, 10000, ",")) !== FALSE) {
    $rowCount++;
    if ($rowCount == 1) {
      continue;
    } // skip the first/header row of the CSV

    $output[] = array(
      'type' => 'Feature',
      'properties' => array(
        'Enumerator' => $csvRow[1],
        'PekerjaanResponden' => $csvRow[6],
        'PendidikanTerakhir' => $csvRow[7],
        'Kalurahan' => $csvRow[5],
        'Kecamatan' => $csvRow[4],
        'FotoNarasumber' => $csvRow[24],
        'FotoRumah' => $csvRow[25],
        'Koordinat_X' => $csvRow[27],
        'Koordinat_Y' => $csvRow[26]
      ),
      'geometry' => array(
        'type' => 'Point',
        'coordinates' => array(
          $csvRow[27], $csvRow[26], '0.0'
        )
      )

    );
  } // end while, loop through CSV data

  fclose($dataHandle); // close the CSV file handler

}  // end if , read file handler opened

// else, file didn't open for reading
else {
  $output = array('error' => 'Problem Reading Google CSV');
}  // end else, file open fail

$output_new = array(
  'type' => 'FeatureCollection',
  'name' => 'Data_Alumni_Geografi_UNY',
  'crs' => [
    'type' => 'name',
    'properties' => [
      'name' => 'urn:ogc:def:crs:OGC:1.3:CRS84'
    ]
  ],
  'features' => $output
);

//Convert ke geojson//
$json_dataalumnigeografiuny = json_encode($output_new, JSON_NUMERIC_CHECK);
echo $json_dataalumnigeografiuny;

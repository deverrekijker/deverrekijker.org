
<?php

define('BLOCK_SIZE',15);

define('SECONDS_PER_MINUTE',60);
define('SECONDS_PER_DAY',86400);
define('BLOCKS_PER_DAY',(1440)/BLOCK_SIZE);

function coordinates($timestamp,$init_ts){

	$seconds_since_init = $timestamp-$init_ts; // always 00:00 (start of first open day)
	$x = intval(floor($seconds_since_init/SECONDS_PER_DAY));

	$seconds_since_midnight = intval(floor($seconds_since_init%SECONDS_PER_DAY));
	$y = intval(floor(floor($seconds_since_midnight/SECONDS_PER_MINUTE)/BLOCK_SIZE));

	return array($x,$y);
}

function get_coordinates($data){
    $init_day = new DateTime();
    $init_day->setTimestamp($data[0][0]);
    $init_day->setTime(0,0);
	$init_ts = $init_day->getTimestamp();

	$r = [];

    array_push($r,$init_ts);
	array_push($r,coordinates($init_ts,$init_ts));

	for ($i=0;$i<count($data);$i++){
		for ($j=0;$j<2;$j++){
			$co = coordinates($data[$i][$j],$init_ts);
			if (count($data[$i])==3){
				// undefined data
				array_push($co,0);
			}
			array_push($r,$co);
		}
	}
	return $r;
}

$data = file_get_contents('../../../private_html/data.json');
$decoded = json_decode($data);
$coordinates = get_coordinates($decoded);
echo json_encode($coordinates);

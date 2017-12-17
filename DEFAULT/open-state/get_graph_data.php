<?php

require_once('config.php');

$contents = json_decode(file_get_contents(DATA));

setlocale(LC_TIME, "nl_NL");
$format = '%e.%m.%Y';
$hourmin_format = $format . ' %H:%M';
$first_day = intval((strtotime(strftime($format, $contents[0][0]))) / (24 * 60 * 60));

$MIN_PER_BLOCK = 15;

$res = array();

for ($i = 0; $i < count($contents); $i++) {
    if (count($contents[$i]) === 2) {
        $ars = array();
        for ($j = 0; $j < 2; $j++) {
            $timestr = trim(strftime($hourmin_format, $contents[$i][$j]));
            $p = explode(':', trim(explode(' ', $timestr)[1]));
            $x = intval(intval($p[0]) * 4 + intval(intval($p[1]) / $MIN_PER_BLOCK));
            $y = intval((strtotime(strftime($format, $contents[$i][$j]))) / (24 * 60 * 60)) - $first_day;
            $ars[count($ars)] = array($y,$x,$timestr);
        }
        $res[count($res)] = $ars;
    }
}

echo json_encode([$contents[0][0],$contents[count($contents)-1][1], $res]);
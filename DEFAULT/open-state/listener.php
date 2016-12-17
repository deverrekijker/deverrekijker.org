<?php
require_once("../config.php");

// file_put_contents('log2.txt',file_get_contents('log2.txt').json_encode($_POST));

require_once("data-interface/validate_datapush.php");
if (!validate_datapush($_POST)) {exit(0);}

function stop_index($posted,$i){
    $i++;
    for (;$i<count($posted);$i++){
        if (intval($posted[$i])-intval($posted[$i-1])>WAIT_BEFORE_CLOSE*60){
            break;
        }
    }
    return $i-1;
}

function parse_incoming_blocks($posted){
    $times = array();
    $now = time();
    for ($i = 0; $i < count($posted);$i++){
        $v = intval($posted[$i]);
        if ($v < 1400000000||$v>$now) continue;
        $i = stop_index($posted,$i);
        array_push($times,array($v,intval($posted[$i])));
    }
    return $times;
}

function get_stored_blocks(){
    if (!file_exists(DATA)) {return array();}
    return json_decode(file_get_contents(DATA));
}

function merge($data){
    // http://stackoverflow.com/questions/3630500/
    $n = 0; $len = count($data);
    for ($i = 1; $i < $len; ++$i) {
        if ($data[$i][0] > $data[$n][1] + WAIT_BEFORE_CLOSE*60) $n = $i;
        else {
            if ($data[$n][1] < $data[$i][1]) $data[$n][1] = $data[$i][1];
            unset($data[$i]);
        }
    }
    return array_values($data);
}

function get_split_str($data){
    if      (strpos($data, '\\\\n') !== false) return '\\\\n';
    else if (strpos($data, '\\\n')  !== false) return '\\\n';
    else if (strpos($data, '\n')    !== false) return '\n';
    else if (strpos($data, PHP_EOL) !== false) return PHP_EOL;
    else return 'naaaa';
}

function cmp($a, $b){return $a[0] - $b[0];}
$split = get_split_str($_POST['data']);
$exploded = explode($split,$_POST['data']);
$new = parse_incoming_blocks($exploded);
$old = get_stored_blocks();
$merged = array_merge($new,$old);
usort($merged, "cmp");
$merged = merge($merged);
file_put_contents(DATA,json_encode($merged));
echo "okidok";


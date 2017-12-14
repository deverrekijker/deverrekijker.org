<?php


// paths
define('DATA_DIR', '../../private_html/'); // should point outside public_html

define('DATA', DATA_DIR . 'data.json');
define("SECRET_PATH", DATA_DIR . 'secrets.php');

// graph
define("WAIT_BEFORE_CLOSE", 10); // number of minutes to wait after last signal before assuming institution is closed
define("UNI_FILTER", 20); // length of largest gap to filter out
define("MINUTES_INTERVAL", 5); // number of minutes for each block

<?php

// 1: localhost, 0: employment
define('LOCAL',0);

// list of tuples indicating start and end of data gaps
// numbers are epoch timestamps
define("MISSING_DATA",json_encode(array(array(1461794400,1461841800),array(1462773600,1463464800))));

// url to parent folder of open-state
define('ROOT_HREF',((LOCAL)?"http://localhost/deverrekijker.org/DEFAULT/":"http://deverrekijker.org/"));

// under maintenance?
define("MAINTENANCE",0); // 1: under maintenance, 0: normal operation

// paths
define('PRIVATE_HTML','../../private_html/'); // should point outside public_html
define("CODE_FOLDER",'open-state/');
define('REQ_LOG',PRIVATE_HTML.'log.txt');
define('DATA',PRIVATE_HTML.'data.json');
define('LAST_SIGNAL',PRIVATE_HTML.'last_signal.txt');
define("SECRET_PATH",PRIVATE_HTML.'secrets.php');

// graph
define("WAIT_BEFORE_CLOSE",10); // number of minutes to wait after last signal before assuming institution is closed
define("UNI_FILTER",20); // length of largest gap to filter out
define("MINUTES_INTERVAL",5); // number of minutes for each block

// source
define("SOURCE_TEXT","source"); // link text for source
define("SOURCE","https://github.com/deverrekijker/deverrekijker.org"); // link to source. set to false to not show

// institution name
define("INSTITUTION_ACRONYM","DV");
define("INSTITUTION_NAME","De Verrekijker");

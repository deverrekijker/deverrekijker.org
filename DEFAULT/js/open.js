
var OPEN_COL = "rgb(132,211,107)", CLOSED_COL = "rgb(208, 68, 69)";

function refreshOpenBox(is_open,last_signal){

    document.getElementById('open-box-load').style.display = 'none';
    document.getElementById('open-text').style.display = 'inline-block';

    document.getElementById('open-text').style.backgroundColor = (is_open==1)?OPEN_COL:CLOSED_COL;
    document.getElementById('open-text').innerHTML = (is_open)
        ? "<h2>Currently open</h2>"
        : "<h2>Currently closed</h2><span style='font-size:12px'> (or the VU network sucks)</span>";
    document.getElementById('open-text').title = "Last signal received " + last_signal;
}

var callback = function(res) {
    console.log(res)
    var d = JSON.parse(res);
    refreshOpenBox(
        d['is_open'],
        d['last_signal']
    );
};

var request_opentimes = function() {
    request(ENDPOINT, "post", "", callback);
};


var OPEN_COL = "#c2f0c0", CLOSED_COL = "#eebec1";

function refreshOpenBox(is_open,last_signal){
    
    document.getElementById('open-box-load').style.display = 'none';
    document.getElementById('open-text').style.display = 'inline-block';

    document.getElementById('container').style.backgroundColor = (is_open==1)?OPEN_COL:CLOSED_COL;
    document.getElementById('open-text').innerHTML = (is_open) ? "Open" : "Closed";
    document.getElementById('open-text').title = "Last signal received " + last_signal;
}

var callback = function(res) {
    var d = JSON.parse(res);
    refreshOpenBox(
        d['is_open'],
        d['last_signal']
    );
};

var request_opentimes = function() {
    request(ENDPOINT, "post", "", callback);
};

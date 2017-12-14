function refreshOpenBox(is_open, last_signal) {

    const last_rcv_msg = "Last signal: " + last_signal;

    document.getElementById('open-box-load').className = 'hidden';

    document.getElementById('open-text').className = 'opentext ' + ((is_open === 1) ? 'open_' : 'closed_');

    document.getElementById('open-text').innerHTML = (is_open)
        ? "<h2>We are open!</h2> <span>(within the last 5 minutes)</span>"
        : "<h2>We are closed!</h2> <span>(or the VU network sucks)<br><i>" + last_rcv_msg + "</i></span>";

    document.getElementById('open-text').title = last_rcv_msg
}

const callback = function (res) {

    const d = JSON.parse(res);
    refreshOpenBox(d['is_open'], d['last_signal']);
};


const request_opentimes = function () {
    request("/open-state/open_info.php", "post", "", callback);
};

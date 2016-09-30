
function prezero(val) {
    if (val < 10) return "0" + val;
    else return val
}

function setTime(time) {
    return prezero(time.getHours()) + ":" + prezero(time.getMinutes());
}

function setDate(time) {
    return time.getFullYear() + "-" + prezero(time.getMonth() + 1) + "-" + prezero(time.getDate());
}

function setTimeAndDate(time) {
    return setDate(time) + "T" + setTime(time);
}

function get_date_limit(key,default_date){

    var date;
    if (document.getElementById(key).value==""){
        date = default_date;
        document.getElementById(key).value = setTimeAndDate(date);
    }
    else date = new Date(document.getElementById(key).value);
    return date;
}

function get_dps(d){

    var dps = [];

    var date_limits = [
        get_date_limit('from',new Date(d[0][0]*1000)), // from date: take from input or use first datapoint
        get_date_limit('to',new Date()) // to date: take from input or use current time
    ];

    var open, close;

    for (var i in d){

        open = new Date(d[i][0]*1000);
        close = new Date(d[i][1]*1000);

        if (close < date_limits[0]) continue;
        else if (open > date_limits[1]) break;

        if (d[i].length > 2 && d[i][2] == 0.5 ){
            // [start of missing data, end of missing data]
            dps.push({x:open,y:0.5});
            dps.push({x:close,y:0.5});
        } else {
            // [opening time, closing time]
            dps.push({x:open,y:1});
            dps.push({x:close,y:0});
        }
    }

    dps.push({
        x:new Date(),
        y:dps[dps.length-1].y
    });

    return dps;
}

function updateDatapoints(){

    request(
        get_dps_url,
        "get",
        null,
        function (server_response) {
            var data = JSON.parse(server_response);
            if (data['error']=='error') console.log('Server reported error:',res['error']);
            else document.getElementById('chartContainer').appendChild(constructGraph(get_dps(data), minutes_interval));
        }
    );
}

function constructGraph(dps, minutes_interval){

    var to_restore = [];

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function dateDifference(d1, d2) {
        return Math.ceil(((new Date(d2.getFullYear(), d2.getMonth(), d2.getDate())).getTime()
            - (new Date(d1.getFullYear(), d1.getMonth(), d1.getDate())).getTime()) / (1000 * 3600 * 24));
    }

    function compute_w(d, first) {
        return dateDifference(first, d);
    }

    function compute_h(d, interval) {
        return Math.floor(d.getHours() * (60 / interval) + d.getMinutes() / interval);
    }

    function toMin(h, hour, minutes_interval) {
        return ((h - (hour * (60 / minutes_interval))) * minutes_interval + 60) % 60;
    }

    function toHour(h, height) {
        return Math.ceil((h / height) * 24) - 1;
    }

    function getDayStr(first_date, w, addone) {
        var day = addDays(first_date, w + ((addone) ? 1 : 0));
        return day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();
    }

    function getTimeString(w, h, height, first_date, minutes_interval, addone) {

        var hours = toHour(h, height);
        var minutes = toMin(h, hours, minutes_interval);
        if (minutes == 0) hours++;
        if (minutes.toString().length == 1) minutes = "0" + minutes;
        hours %= 24;
        if (hours.toString().length == 1) hours = "0" + hours;
        return getDayStr(first_date, w, addone) + " " + hours + ":" + minutes;
    }

    function hoverAbove(w, h, v, width, height, first_date, minutes_interval,datapoints) {

        // todo make a lot more efficient

        var from_time,to_time;

        fromloop: for (var x = w; x >= 0; x--){
            for (var y = (x==w)?h:((24*60)/minutes_interval); y > 0; y--){
                if (datapoints[x][y]==undefined) continue;
                if (datapoints[x][y]!=v){
                    if (y+1<(24*60)/minutes_interval){
                        from_time = [x,y+1];
                    } else {
                        from_time = [x+1,1];
                    }
                    break fromloop;
                }
            }
        }

        if (from_time==undefined) from_time=[0,0];

        toloop: for (var x = w; x <datapoints.length; x++){
            for (var y = (x==w)?h:0; y < datapoints[x].length; y++){

                if (datapoints[x][y]==v){
                    continue;
                }
                if (datapoints[x][y]!=v){
                    if (y-1<0){
                        to_time = [x-1,(24*60)/minutes_interval];
                    } else {
                        to_time = [x,y-1];
                    }
                    break toloop;
                }
            }
        }

        if (to_time==undefined)to_time=[datapoints.length-1,datapoints[datapoints.length-1].length-1];

        var from_time_str = getTimeString(from_time[0]
            , from_time[1]
            , height, first_date, minutes_interval);
        var to_time_str = (to_time==undefined)?"": getTimeString(to_time[0], to_time[1]+1, height, first_date, minutes_interval, h == height - 1);

        var tds_to_highlight = {coords:[]}; // array of coordinates

        for (var x = from_time[0]; x <= to_time[0]; x++){
            for (var y = ((x==from_time[0])?from_time[1]:0);y<((x==to_time[0])?to_time[1]+1:((24*60)/minutes_interval));y++){
                tds_to_highlight.coords.push([x,y]);
            }
        }

        for (var i in to_restore.coords){
            document.getElementById(to_restore.coords[i][0] + '-' + to_restore.coords[i][1]).style.backgroundColor = to_restore.original_color;
        }

        var val = datapoints[tds_to_highlight.coords[0][0]][tds_to_highlight.coords[0][1]];

        var col;
        if (val==1){
            tds_to_highlight.original_color = '#4aff3d';
            col = "green";
        } else if (val == 0){
            tds_to_highlight.original_color = '#838B8B';
            col = "darkgrey";
        } else {
            tds_to_highlight.original_color = 'white';
            col = "lightgrey";
        }

        for (var i in tds_to_highlight.coords){
            if (tds_to_highlight.coords[i][1]==288){
                tds_to_highlight.coords[i][0]++;
                tds_to_highlight.coords[i][1]=0;
            }
            document.getElementById(tds_to_highlight.coords[i][0] + '-' + tds_to_highlight.coords[i][1]).style.backgroundColor = col;
        }

        to_restore = tds_to_highlight;

        var state = 'error';

        switch (v) {
            case 1:
                state = 'Open';
                break;
            case 0:
                state = 'Closed';
                break;
            case '?':
                state = 'Future';
                break;
            case 0.5:
                state = 'no data';
                break;
        }



        var tooltipSpan = document.getElementById('tooltip-span');

        function getWidth() {
            if (self.innerHeight) {
                return self.innerWidth;
            }

            if (document.documentElement && document.documentElement.clientWidth) {
                return document.documentElement.clientWidth;
            }

            if (document.body) {
                return document.body.clientWidth;
            }
        }
        var wid = getWidth();

        window.onmousemove = function (e) {
            var x = e.clientX,
                y = e.clientY;

            if (x>wid/2 && wid-x<100){
                tooltipSpan.style.top = (y + 20) + 'px';
                tooltipSpan.style.left = (x - 200) + 'px';
            } else {
                tooltipSpan.style.top = (y + 20) + 'px';
                tooltipSpan.style.left = (x + 20) + 'px';
            }

        };
        
        var legent_text = " <div style='display:inline;width=6em;font-size:20px;'><b>" + state + "</b></div> from " + from_time_str +( (to_time_str==="")?"":(" to " + to_time_str));
        document.getElementById('legend').innerHTML = legent_text;
    }

    document.getElementById('chartContainer').innerHTML = "";

    var datapoints = [];

    var first_date = dps[0].x;
    var last_date = dps[dps.length - 1].x;

    var height = (24 * 60) / minutes_interval;
    var width = dateDifference(first_date, last_date) + 1 ;

    for (var a = 0; a < width; a++) {
        datapoints[a] = [];
        for (var b = 0; b < height; b++) {
            datapoints[a][b] = 0;
        }
    }

    for (var i = 0; i < dps.length - 1; i++) {
        if (dps[i].y == 0) continue;
        var next_w = compute_w(dps[i + 1].x, first_date),
            next_h = compute_h(dps[i + 1].x, minutes_interval),
            w = compute_w(dps[i].x, first_date),
            h = compute_h(dps[i].x, minutes_interval);

        for (var x = w; x <= next_w; x++) {

            for (var y = ((x == w) ? h : 0); y <= ((x == next_w) ? next_h : height); y++) {
                datapoints[x][y] = dps[i].y;
            }
        }
    }

    for (var c = compute_h(dps[dps.length - 1].x, minutes_interval); c < height; c++) {
        datapoints[width - 1][c] = '?';
    }

    // cell widths, as percentages
    var cellWidth = width / 100;
    var cellHeight = height / 100;

    var table = document.createElement('table');

    function prezero(n){
        n = ""+n;
        if (n.length==1)return 0+n;
        else return n;
    }

    var num_hour_labels = 6;
    var rowspan = height/num_hour_labels;

    var td;

    for (var d = 0; d < height; d++) {

        var tr = document.createElement('tr');
        if (d%rowspan==0) {
            td = document.createElement('td');
            if (d!=0){
                td.style.borderTop = '1px solid black';
            }
            td.rowSpan = rowspan;
            td.innerHTML = prezero((d/12))+":00 &#8594; "+prezero((d/12)+3)+":59";
            td.style.width = cellWidth*3 + "%";
            tr.appendChild(td);
        }
        for (var e = 0; e < width; e++) {
            td = document.createElement('td');
            td.id = e + '-' + d;

            switch (datapoints[e][d]) {
                case 1:
                    td.style.backgroundColor = '#4aff3d';
                    break;
                case 0:
                    td.style.backgroundColor = '#838B8B';
                    break;
                case '?':
                case 0.5:
                    td.style.backgroundColor = 'none';
                    break;
            }

            td.onmouseover = (function(w, h, v, width, height, first_date, minutes_interval,datapoints) {
                return function() {
                    hoverAbove(w, h, v, width, height, first_date, minutes_interval,datapoints)
                };
            }(e, d, datapoints[e][d], width, height, first_date, minutes_interval,datapoints));

            td.style.height = cellHeight + "%";
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
};
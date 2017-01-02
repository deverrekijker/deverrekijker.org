var VERTICAL = true;

var PX_PER_X = 10,
    PX_PER_Y = 16;

var init_ts, init_date;

var CLOSED_COLOR = 'grey',
    OPEN_COLOR = '#4aff3d',
    OPEN_HIGHLIGHT = 'darkgreen',
    CLOSED_HIGHLIGHT = 'black';

var num_days;
var num_divs = 0;

var superdiv = document.createElement('div');
superdiv.id = 'superdiv';
superdiv.style.display = "block";

var tooltip = makeTooltip();
tooltip.id = 'tooltip';

superdiv.appendChild(tooltip);

var UNITS_PER_DAY = 4 * 24;

function makeDiv(x, y, width, height, color) {
    var d = document.createElement('div');
    d.className = 'cell';
    d.style.position = "absolute";
    d.style.display = "block";
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.height = height + 'px';
    d.style.width = width + 'px';
    d.style.backgroundColor = color;
    return d;
}

function makeTooltip() {
    var d = document.createElement('div');
    d.style.position = "absolute";
    d.style.display = "none"
    return d;
}

function putRect(x1, y1, x2, open) {

    var d;

    if (VERTICAL) {

        d = makeDiv(
            x1 * PX_PER_X, (num_days - y1) * PX_PER_Y,
            x2 * PX_PER_X - x1 * PX_PER_X,
            PX_PER_Y, (open) ? OPEN_COLOR : CLOSED_COLOR
        );

    } else {

        d = makeDiv(
            y1 * PX_PER_Y,
            x1 * PX_PER_X,
            PX_PER_Y,
            x2 * PX_PER_X - x1 * PX_PER_X, (open) ? OPEN_COLOR : CLOSED_COLOR
        );
    }
    d.open = open;
    return d;
}

var highlighted = [];

function isOpen(id) {
    return document.getElementById(id).open
}

function highlight(id) {
    highlighted.push(id);
    document.getElementById(id).style.backgroundColor = isOpen(id) ? OPEN_HIGHLIGHT : CLOSED_HIGHLIGHT;
}

function unhighlight(id) {
    document.getElementById(id).style.backgroundColor = isOpen(id) ? OPEN_COLOR : CLOSED_COLOR;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function coordinates_to_time(coordinates) {
    var times = [];
    for (var i in coordinates) {
        var minutes = 15 * coordinates[i][1] + 24 * 60 * coordinates[i][0];
        times.push(addMinutes(init_date, minutes));
    }
    return times;
}

function fn(e) {
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY - 80) + 'px';
}

document.addEventListener('mousemove', fn, false);

function prezero(val) {
    if (val < 10) return "0" + val;
    else return val
}

function timestring(d, no_hours) {
    try {
        if (isNaN(d.getDate()) || isNaN(d.getMonth())) {
            console.log(d)
            return "";
        }
        var s = prezero(d.getDate()) + "." + prezero(d.getMonth() + 1) + "." + d.getFullYear();
        if (!no_hours) s += " " + prezero(d.getHours()) + ":" + prezero(d.getMinutes());
        return s;
    } catch (e) {
        console.log(e);
        return e;
    }
}

function updateTooltip(t, o) {
    document.getElementById('tooltip').style.display = "block";
    document.getElementById('tooltip').innerHTML = ((o) ? "Open" : "Closed") + "<br>fr " + timestring(t[0]) + "<br>to " + timestring(t[1]);

}

function createHandler(ds) {
    return function() {
        while (highlighted.length > 0) unhighlight(highlighted.pop());
        for (var d in ds) {
            highlight(ds[d]);
            updateTooltip(coordinates_to_time(document.getElementById([ds[d]]).coordinates), isOpen(ds[d]))
        }
    }
}
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

function putDateCol(days_since_init) {

    var e = putRect(4 * 24, days_since_init, UNITS_PER_DAY + 10);
    e.className = 'datecell';
    console.log(days_since_init)
    e.innerHTML = timestring(init_date.addDays(days_since_init), true);
    return e;
}

function visualize(data) {


    var x1, y1, x2, y2;

    var y;

    var divs = [];

    num_days = data[data.length - 1][0];

    for (var i = 0; i < data.length - 1; i++) {

        if (data[i].length == 3) {
            continue;
        }

        var open = (i % 2 == 1);

        x1 = data[i][1];
        y1 = data[i][0];
        x2 = data[i + 1][1];
        y2 = data[i + 1][0];

        y = y1;

        var these_divs = []; // the set of divs added for this time period

        // if same day as next change until another point this day
        if (y1 == y2) {
            // until next change
            these_divs.push(putRect(x1, y1, x2, open));
            these_divs[these_divs.length - 1].coordinates = [
                [y1, x1],
                [y2, x2], open
            ];
        } else {
            // until midnight
            these_divs.push(putRect(x1, y1, UNITS_PER_DAY, open));
            divs.push(putDateCol(y));
            these_divs[these_divs.length - 1].coordinates = [
                [y1, x1],
                [y2, x2], open
            ];

            var full_days = y2 - y1 - 1;

            // for all full days
            while (full_days-- > 0) {

                these_divs.push(putRect(0, ++y, UNITS_PER_DAY, open));
                these_divs[these_divs.length - 1].coordinates = [
                    [y1, x1],
                    [y2, x2], open
                ];
                divs.push(putDateCol(y));
            }

            // from midnight until next coordinate
            these_divs.push(putRect(0, y2, x2, open));
            these_divs[these_divs.length - 1].coordinates = [
                [y1, x1],
                [y2, x2], open
            ];
            divs.push(putDateCol(y));
        }

        var ids = [];

        for (var d in these_divs) {
            these_divs[d].id = 'div_' + num_divs++;
            ids.push(these_divs[d].id);
        }
        var f = createHandler(ids);
        for (var d in these_divs) {
            these_divs[d].onmouseover = f;
            divs.push(these_divs[d]);
        }
    }
    for (var d in divs) {
        superdiv.appendChild(divs[d]);
    }

    for (var i = 1; i <= 3; i++) {
        //document.getElementById('b'+i).style.height = PX_PER_Y * (num_days-4) + "px";
        document.getElementById('b' + i).style.height = PX_PER_Y * (num_days + 2) + "px";
        document.getElementById('b' + i).style.left = (i * 232) + "px";
        document.getElementById('b' + i).style.position = "absolute";
    }

    document.getElementById('vis-container').appendChild(superdiv);
}

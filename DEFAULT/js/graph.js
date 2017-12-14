const VERTICAL = true;
const PX_PER_X = 10, PX_PER_Y = 16;
const CLOSED_COLOR = 'grey',
    OPEN_COLOR = '#4aff3d',
    OPEN_HIGHLIGHT = 'darkgreen',
    CLOSED_HIGHLIGHT = 'black';


let highlighted = [];
let init_ts, init_date;
let num_days, num_divs = 0;


const superdiv = document.createElement('div');
superdiv.className = "block-thing";
let tooltip = document.createElement('div');
tooltip.className = 'tooltip hidden';
superdiv.appendChild(tooltip);

const UNITS_PER_DAY = 4 * 24;

function makeDiv(x, y, width, height, color) {
    let d = document.createElement('div');
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


function putRect(x1, y1, x2, open) {

    let d;

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
    let times = [];
    for (let i in coordinates) {
        times.push(addMinutes(init_date, 15 * coordinates[i][1] + 24 * 60 * coordinates[i][0]));
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
            return "";
        }
        let s = prezero(d.getDate()) + "." + prezero(d.getMonth() + 1) + "." + d.getFullYear();
        if (!no_hours) s += " " + prezero(d.getHours()) + ":" + prezero(d.getMinutes());
        return s;
    } catch (e) {
        return e;
    }
}

function updateTooltip(t, o) {
    tooltip.className = 'tooltip shown';
    tooltip.innerHTML = ((o) ? "Open" : "Closed") + "<br>fr " + timestring(t[0]) + "<br>to " + timestring(t[1]);
}

function createHandler(ds) {
    return function () {
        while (highlighted.length > 0) unhighlight(highlighted.pop());
        for (let d in ds) {
            highlight(ds[d]);
            updateTooltip(coordinates_to_time(document.getElementById(ds[d]).coordinates), isOpen(ds[d]))
        }
    }
}

Date.prototype.addDays = function (days) {
    const dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

function putDateCol(days_since_init) {

    const e = putRect(4 * 24, days_since_init, UNITS_PER_DAY + 10);
    e.className = 'datecell';
    e.innerHTML = timestring(init_date.addDays(days_since_init), true);
    return e;
}

function visualize(data) {


    let x1, y1, x2, y2, y;

    let divs = [];

    num_days = data[data.length - 1][0];

    for (let i = 0; i < data.length - 1; i++) {

        if (data[i].length === 3) {
            continue;
        }

        const open = (i % 2 === 1);

        x1 = data[i][1];
        y1 = data[i][0];
        x2 = data[i + 1][1];
        y2 = data[i + 1][0];

        y = y1;

        let these_divs = []; // the set of divs added for this time period

        // if same day as next change until another point this day
        if (y1 === y2) {
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

            let full_days = y2 - y1 - 1;

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

        let ids = [];

        for (const these_div of these_divs) {
            these_div.id = 'div_' + num_divs++;
            ids.push(these_div.id);
        }
        let f = createHandler(ids);
        for (const these_div of these_divs) {
            these_div.onmouseover = f;
            these_div.onmouseout = function () {
                tooltip.className = 'tooltip hidden';
                while (highlighted.length > 0) {
                    unhighlight(highlighted.pop());
                }
            };
            divs.push(these_div);
        }
    }
    for (const div of divs) {
        superdiv.appendChild(div);
    }

    for (let j = 1; j <= 3; j++) {
        //document.getElementById('b'+i).style.height = PX_PER_Y * (num_days-4) + "px";
        document.getElementById('b' + j).style.height = PX_PER_Y * (num_days + 2) + "px";
        document.getElementById('b' + j).style.left = (j * 232) + "px";
        document.getElementById('b' + j).style.position = "absolute";
    }

    document.getElementById('vis-container').appendChild(superdiv);
}

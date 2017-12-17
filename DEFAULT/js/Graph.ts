const BLOCK_SIZE = 15; // min

const UNITS_PER_DAY = (60 / BLOCK_SIZE) * 24;

const MARGIN = 0;

const PERCENT_PER_UNIT = (100-MARGIN) / UNITS_PER_DAY;

class Graph {

    visualization: HTMLDivElement;
    graph_container: HTMLDivElement;
    margin: HTMLDivElement;
    data: any[];
    bottom: number;
    cell_dim: number;
    last_ts: number;



    constructor(data) {

        this.visualization = document.createElement('div');
        this.visualization.className = 'outer'

        this.graph_container = document.createElement('div');
        this.graph_container.className = 'graphVisualization';

        this.margin = document.createElement('div');
        this.margin.className = 'margin';

        this.visualization.appendChild(this.margin);
        this.visualization.appendChild(this.graph_container);
        this.last_ts = data[1];
        this.data = data[2];
        this.bottom = this.data[this.data.length - 1][1][0];
        this.cell_dim = 10;

    }



    public build() {

        let num = this.data[this.data.length-1][1][0];

        for (let y = 0; y < num; y++){
            this.margin.appendChild(
                this.makedate(y)
            );
        }

        for (let i = 0; i < this.data.length; i++) {
            for (let block of this.get_divs(this.data[i])) {
                this.graph_container.appendChild(block);
            }
        }
    }

    private makedate(y){


        let d = new Date(this.last_ts*1000);
        d.setDate(d.getDate()-y);
        let e = document.createElement('div');
        e.innerHTML = d.toLocaleDateString('nl');
        e.className = 'datenote';
        e.style.top = y * this.cell_dim + 'px';
        return e;
    }

    private get_div(from_x, to_x, y, tooltip_text) {


        let e = document.createElement('div');
        e.className = 'cell';
        e.style.left = MARGIN + Math.round(from_x * PERCENT_PER_UNIT) + '%';
        e.style.width = Math.round((to_x - from_x) * PERCENT_PER_UNIT) + '%';
        e.style.top = (Math.round((this.bottom - y) * this.cell_dim)) + 'px';
        e.style.height = this.cell_dim + 'px';


        return e;
    }


    private named_time_data(o) {
        return {
            x: o[1],
            y: o[0],
            tooltip: o[2]
        };
    }

    private get_divs(objs): HTMLDivElement[] {


        let t1 = this.named_time_data(objs[0]);
        let t2 = this.named_time_data(objs[1]);

        let divs = [];

        let tooltip_text = 'Open from ' + t1.tooltip + ' to ' + t2.tooltip;

        for (let y = t2.y; y >= t1.y; y--) {

            let e = this.get_div(
                (y == t1.y) ? t1.x : 0,
                (y == t2.y) ? t2.x : UNITS_PER_DAY,
                y,
                tooltip_text
            );

            divs.push(e);

        }

        for (let d of divs) {

            d.onmouseover = function () {
                document.getElementById('tooltip').innerHTML = tooltip_text;
                document.getElementById('tooltip').style.display = 'inline-block';
                for (let d1 of divs) {
                    d1.className = 'cell highlighted'
                }
            };
            d.onmouseout = function () {
                document.getElementById('tooltip').innerHTML = ''
                document.getElementById('tooltip').style.display = 'none';
                for (let d1 of divs) {

                    d1.className = 'cell'
                }
            };
        }


        return divs;
    }
}




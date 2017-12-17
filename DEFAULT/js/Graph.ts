const UNITS_PER_DAY = 4 * 24;




class Graph {

    visualization: HTMLDivElement;
    data: any[];
    bottom: number;
    cell_dim: number;

    constructor(data) {
        this.visualization = document.createElement('div');
        this.visualization.className = 'graphVisualization';
        this.data = data;
        this.bottom = data[data.length - 1][1][0];

        // todo adapt to container
        this.cell_dim = parseInt((document.body.clientWidth / UNITS_PER_DAY).toFixed(0));

    }

    public build() {

        for (let i = 0; i < this.data.length; i++) {
            for (let block of this.get_divs(this.data[i])) {
                this.visualization.appendChild(block);
            }
        }
    }

    private get_div(from_x, to_x, y, tooltip_text) {


        let e = document.createElement('div');
        e.className = 'cell';
        e.style.left = Math.round(from_x * this.cell_dim) + 'px';
        e.style.width = Math.round((to_x - from_x) * this.cell_dim) + 'px';
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

            divs.push(
                this.get_div(
                    (y == t1.y) ? t1.x : 0,
                    (y == t2.y) ? t2.x : UNITS_PER_DAY,
                    y,
                    tooltip_text
                )
            )
        }

        for (let d of divs){

            d.onmouseover = function () {
                document.getElementById('tooltip').innerHTML = tooltip_text;
                document.getElementById('tooltip').style.display = 'inline-block';
                for (let d1 of divs){

                    d1.className = 'cell highlighted'
                }
            };
            d.onmouseout = function () {
                document.getElementById('tooltip').innerHTML = ''
                document.getElementById('tooltip').style.display = 'none';
                for (let d1 of divs){

                    d1.className = 'cell'
                }
            };
        }


        return divs;
    }
}




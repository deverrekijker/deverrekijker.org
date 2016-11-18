<?php
require_once('config.php');
?>

<html>

    <head>
        <meta charset="utf-8">
        <script src="js/ajax.js"></script>
        <script src="js/graph.js"></script>
        <link rel="stylesheet" href="js/graph.css">
    </head>

    <body>

        <div style="width:<?php echo 4*24*10?>px;height:10%;background-color: ">
            <p>
                This graph shows the history of De Verrekijker's open times.
                Hover segments with your mouse for details.
                Green means open, grey means closed, and empty bits are missing data.
                At the top is today, at the bottom is a long time ago.
            </p>
        </div>


        <div id="bordercontainer">
            <div id="b1" class="yalign border">06:00</div>
            <div id="b2" class="yalign border">12:00</div>
            <div id="b3" class="yalign border">18:00</div>
        </div>
        <div id="vis-container" style="top:15%;position:absolute">

        </div>
        <script>
            request(
                'open-state/data-interface/get_coordinates.php',
                'get',
                null,
                function (server_response) {
                    var data = JSON.parse(server_response);
                    if (data['error']=='error') console.log('Server reported error:',data['error']);
                    else {
                        init_ts = data.shift();
                        init_date = new Date(init_ts*1000);
                        visualize(data);
                    }
                });
        </script>
    </body>

</html>

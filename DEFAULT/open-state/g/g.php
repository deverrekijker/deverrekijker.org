
<html>

<head>

    <title>
        <?php echo INSTITUTION_NAME; ?>'s Open Hours History
    </title>


    <style>
        .tooltip {
            text-decoration: none;
            position: relative;
        }

        .tooltip span {
            display: none;
        }

        .tooltip:hover span {
            display: block;
            position: fixed;
            overflow: hidden;
        }

        table,
        tr,
        td {
            border: 0;
            margin: 0;
            border-collapse: collapse
        }
    </style>

    <script type="text/javascript" src='<?php echo ROOT_HREF.CODE_FOLDER;?>g/g.js'></script>
    <script type="text/javascript" src="<?php echo ROOT_HREF;?>libs/ajax.js"></script>
    <script type="text/javascript" src="<?php echo ROOT_HREF; ?>libs/canvasjs.min.js"></script>
    <script type="text/javascript" src="<?php echo ROOT_HREF.CODE_FOLDER; ?>g/graph.js"></script>
    <script>
        // php constants to js
        var minutes_interval = <?php echo MINUTES_INTERVAL ?>;
        var get_dps_url = "open-state/data-interface/get_dps.php";
    </script>

</head>

<body>

<?php if (MAINTENANCE==1&&!isset($_GET['ok'])) {echo "<script>alert('under maintenance. check back in a bit');</script>";}?>

<div style="font-size: 0.8em;width:100%;text-align: center">
    from <input style="font-size: 1em;" id="from" type="datetime-local"> to <input style="font-size:1em" id="to" type="datetime-local">
    <button style="font-size: 1em;" onclick="updateDatapoints()">Set</button>
</div>

<div id="hover_instruct" style="text-align:center"></div>

<div class="tooltip">

    <div id="chartContainer" style="height: 100%; width: 100%;">
        loading...
    </div>
    <span id="tooltip-span">
            <div style="background-color: white;border:2px solid black;border-radius: 5px;padding:2px">
                <em id="legend"><b style='font-size:20px'>Hover</b> your mouse over the graph</em>

            </div>
    </span>
</div>
<script>
    (function() {
        setInterval(updateDatapoints(), 1000 * 60);
    })();
</script>

</body>

</html>

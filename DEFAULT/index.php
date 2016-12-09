<?php
   require_once ('config.php');
   ?>

<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=0.75">
      <link rel="stylesheet" type="text/css" href="css/style.css">
      <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
      <title><?php echo INSTITUTION_NAME ?></title>
      <script type="text/javascript" src="js/ajax.js"></script>
      <script type="text/javascript" src="js/open.js"></script>
   </head>
   <body>
      <div class="container">
         <div class="jumbotron" id="container" style="margin-bottom:0;border-radius:0">
            <header id='header' class='row'>
               <div id='header-left' class='left col-xs-8'>
                  <h1><?php echo INSTITUTION_NAME ?></h1>
                  <em>Opening doors on VU Campus, <a target="_blank" href="http://www.advalvas.vu.nl/nieuws/vu-niet-blij-met-academisch-caf%C3%A9-de-verrekijker">since May 2015</a></em>
               </div>
               <div id='header-right' class='right col-xs-4'>
                  <?php
                     if (MAINTENANCE) echo "<br /><em>Open-times tracker is under maintenance</em>";
                     ?>
                  <?php
                     // No maintenance

                     if (MAINTENANCE != 1) {
                     	echo "<a id='open-box' target='_blank' href='" . ROOT_HREF . "graph.php'><em id='open-box-load'>loading...</em><span id='open-text'></span></a>";
                     }

                     ?>
               </div>
            </header>
            <nav class='navbar navbar-default'>
               <ul class="nav navbar-nav">
                  <li>
                     <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSe_zm8Hpga7YRd-D5lcWZU1RXoauezNNycTyWhKXQdLENl5LA/viewform">
                        <h3>Event Form</h3>
                     </a>
                  </li>
                  <li>
                     <a target="_blank" href="https://radar.squat.net/en/amsterdam/de-verrekijker">
                        <h3>Radar</h3>
                     </a>
                  </li>
                  <li>
                     <a target="_blank" href="https://www.facebook.com/deverrekijkervu/">
                        <h3>Facebook</h3>
                     </a>
                  </li>
                  <li>
                     <a href="mailto:de.verrekijker.vu@gmail.com">
                        <h3>Email</h3>
                     </a>
                  </li>
                  <li>
                     <a target="_blank" href="https://www.google.com/maps/place/De+Verrekijker/@52.333419,4.8629908,17z/data=!3m1!4b1!4m5!3m4!1s0x47c60a085459df69:0x2293a00c7f66cb6e!8m2!3d52.333419!4d4.8651795">
                        <h3>Map</h3>
                     </a>
                  </li>
               </ul>
            </nav>
            <div id='txt'><?php
               require_once ('text.html');

               ?></div>
         </div>
      </div>
      <footer>
        <span class="left">
          <strong>Bitcoin!</strong> <em>1LxgQ5pJdRpPpdUzVpu7tF2wt1MQuMCAvu</em>
        </span>
         <span class="right">
         <em>Think our website sucks? <a target="_blank" href="https://github.com/deverrekijker/deverrekijker.org">Help improve it!</a></em>
         </span>
      </footer>
      <script type="text/javascript">
         var ENDPOINT = "open-state/data-interface/open_info.php";
         request_opentimes(); // load open times
         setInterval(request_opentimes, 1000 * 60); // reload open times once per minute
      </script>
   </body>
</html>

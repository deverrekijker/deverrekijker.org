<html>

<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="libs/bootstrap.min.css">
	<title>De Verrekijker</title>
	<?php require_once('config.php');?>
	<script type="text/javascript" src="libs/ajax.js"></script>
	<script type="text/javascript" src="open-state/open.js"></script>
	<style>a{cursor:pointer}</style>
</head>

<body>

<div class="container">
	<div class="jumbotron" id="container" style="margin-bottom:0;border-radius:0">
		<h1>De Verrekijker</h1>

		<em>Do good and feel free</em>

		<?php if (MAINTENANCE) echo "<br><em>Open-times tracker is under maintenance</em>"; ?>

		<p>
			<?php 
				if (MAINTENANCE!=1) {
					echo "<a href='". ROOT_HREF."g.php'><em id='open-box-load'>loading...</em><span style='font-size:16px' id='open-text'></span></a><br>";
				}
			?>
			<a href="https://docs.google.com/forms/d/e/1FAIpQLSe_zm8Hpga7YRd-D5lcWZU1RXoauezNNycTyWhKXQdLENl5LA/viewform">organize with us</a>
			| <a href="https://twitter.com/verrekijker_vu">twitter</a>
			| <a href="https://www.facebook.com/deverrekijkervu/">facebook</a>
			| <a href="mailto:de.verrekijker.vu@gmail.com">email</a>
			| <a href="https://www.google.com/maps/place/De+Verrekijker/@52.333419,4.8629908,17z/data=!3m1!4b1!4m5!3m4!1s0x47c60a085459df69:0x2293a00c7f66cb6e!8m2!3d52.333419!4d4.8651795">map</a>
			| <a id="expand" onclick="expand()">more</a><a id="collapse" onclick="collapse()">less</a>
		</p>

			<p id='txt'><?php require_once('text.html'); ?></p>

	</div>
</div>

<script>
	function expand(){
		document.getElementById('expand').style.display="none";
		document.getElementById('collapse').style.display="inline";
		document.getElementById('txt').style.display="block";
	}
	function collapse(){
		document.getElementById('expand').style.display="inline";
		document.getElementById('collapse').style.display="none";
		document.getElementById('txt').style.display="none";
	}
	   collapse();
</script>

<script type="text/javascript">
    var ENDPOINT = "o" +
		"pen-state/data-interface/open_info.php";
    request_opentimes(); // load open times
    setInterval(request_opentimes, 1000 * 60); // reload open times once per minute
</script>

</body>

</html>



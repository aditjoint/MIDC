<?php
// This file simply redirects to the HTML file
header("Location: index.html");
exit();
?>


<?php
  // Get today's day number (1-31)
  $day = date("j");

  // Build background image path (example: bg1.jpg, bg2.jpg, etc.)
  $bgImage = "images/daily-backgrounds/bg{$day}.jpg";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dynamic Background Example</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: background-image 1s ease-in-out;
    }
  </style>
</head>
<body style="background-image: url('<?php echo $bgImage; ?>');">
  <h1 style="color:white; text-align:center; padding-top:50px;">
    Welcome! Today’s background is <?php echo basename($bgImage); ?>
  </h1>
</body>
</html>

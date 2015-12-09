<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>QBF - Guideline</title>
      <link href="css/reset.css" rel="stylesheet">
      <link href="css/grid.css" rel="stylesheet">
      <link href="css/typo.css" rel="stylesheet">
      <link href="css/icons.css" rel="stylesheet">
      <link href="css/bg.css" rel="stylesheet">
      <link href="css/gallery.css" rel="stylesheet">
      <link href="css/blocks.css" rel="stylesheet">
      <link href="css/forms.css" rel="stylesheet">
      <link href="css/guideline.css" rel="stylesheet">
      <!-- HTML5 for IE8 -->
      <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
      <![endif]-->
      <style type="text/css">
        body{
          font-family: 'LatoLight', sans-serif;
          @font-face {
              font-family: 'LatoLight';
              src: url('fonts/LatoLight/LatoLight.eot');
              src: url('fonts/LatoLight/LatoLight.eot?#iefix')format('embedded-opentype'),
              url('fonts/LatoLight/LatoLight.woff') format('woff'),
              url('fonts/LatoLight/LatoLight.ttf') format('truetype');
              font-style: normal;
              font-weight: normal;
          }
        }
      </style>
    </head>
    <body>
      <div id="menu-mobile" class="size-3 uppercase">
        <a class="active" href="index.php?grid">Сетка</a>
        <a href="index.php?typo">Типография</a>
        <a href="index.php?icons">Иконки</a>
        <a href="index.php?gallery">Галерея</a>
        <a href="index.php?blocks">Блоки</a>
        <a href="index.php?forms">Формы</a>
      </div>
      <div class="header">
        <div id="logo">
          <img src="img/logo.jpg" alt="QBF Investment" />
        </div>
        <div id="menu" class="size-3 uppercase">
          <a class="active" href="index.php?grid">Сетка</a>
          <a href="index.php?typo">Типография</a>
          <a href="index.php?icons">Иконки</a>
          <a href="index.php?gallery">Галерея</a>
          <a href="index.php?blocks">Блоки</a>
          <a href="index.php?forms">Формы</a>
        </div>
      </div>
      <div class="header-placeholder"></div>
      <div class="container">
        <p>
            <?php
                if(isset($_GET['grid'])) include 'grid.html';
                elseif(isset($_GET['typo'])) include 'typo.html';
                elseif(isset($_GET['icons'])) include 'icons.html';
                elseif(isset($_GET['gallery'])) include 'gallery.html';
                elseif(isset($_GET['blocks'])) include 'blocks.html';
                elseif(isset($_GET['forms'])) include 'forms.html';
                else include 'grid.html';
            ?>
        </p>
      </div>
      <script src="js/jquery.min.js"></script>
    </body>
  </html>

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
          font-family: 'LatoRegular', sans-serif;
          @font-face {
              font-family: 'LatoRegular';
              src: url('fonts/LatoRegular/LatoRegular.eot');
              src: url('fonts/LatoRegular/LatoRegular.eot?#iefix')format('embedded-opentype'),
              url('fonts/LatoRegular/LatoRegular.woff') format('woff'),
              url('fonts/LatoRegular/LatoRegular.ttf') format('truetype');
              font-style: normal;
              font-weight: normal;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="index.php?grid">Сетка</a>
        <a href="index.php?typo">Типография</a>
        <a href="index.php?icons">Иконки</a>
        <a href="index.php?gallery">Галерея</a>
        <a href="index.php?blocks">Блоки</a>
        <a href="index.php?forms">Формы</a>
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

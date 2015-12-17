<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>QBF - Guideline</title>
      <link href="/css/reset.css" rel="stylesheet">
      <link href="/css/grid.css" rel="stylesheet">
      <link href="/css/typo.css" rel="stylesheet">
      <link href="/css/icons.css" rel="stylesheet">
      <link href="/css/bg.css" rel="stylesheet">
      <link href="/css/gallery.css" rel="stylesheet">
      <link href="/css/blocks.css" rel="stylesheet">
      <link href="/css/forms.css" rel="stylesheet">
      <link href="/css/guideline.css" rel="stylesheet">
      <!-- HTML5 for IE8 -->
      <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
      <![endif]-->
    </head>
    <body>
      <?php 
        include 'html/guideline/header.html';
        if(isset($_GET['grid'])){ 
          include 'html/guideline/grid.html';
        }elseif(isset($_GET['typo'])){
          include 'html/guideline/typo.html';
        }elseif(isset($_GET['icons'])){
          include 'html/guideline/icons.html';
        }elseif(isset($_GET['gallery'])){
          include 'html/guideline/gallery.html';
        }elseif(isset($_GET['forms'])){
          include 'html/guideline/forms.html';
        }elseif(isset($_GET['blocks'])){
          include 'html/guideline/blocks.header.html';
          include 'html/guideline/blocks.titles.html';
          include 'html/guideline/blocks.text.html';
          include 'html/guideline/blocks.gallery.html';
          include 'html/guideline/blocks.feeds.html';
          include 'html/guideline/blocks.parallax.html';
        }else{
          include 'html/guideline/grid.html';
        }
        include 'html/guideline/footer.html';
      ?>
      <script src="/js/jquery.min.js"></script>
      <script src="/js/main.js"></script>
    </body>
  </html>

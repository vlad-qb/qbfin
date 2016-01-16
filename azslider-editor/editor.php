<?php

error_reporting(0);

/*-------------------
Configuration
-------------------*/
$admin_user = 'admin';
$admin_pwd = 'temporary';
$is_login = false;

$azslider_url = '//test/azslider-editor/';
$upload_dir = 'uploads/';
$upload_url = $azslider_url.'uploads/';
$js_dir = $azslider_url.'js/';
$css_dir = $azslider_url.'css/';
$skin_dir = $azslider_url.'skins/';

$default_actions = array(
	"card" => array(
		"in"  => array(
			"commands" => array(array("cmd" => "bring-to-front"), array("cmd" => "prepare", "target" => "objects"), "short-in-left", array("cmd" => "play-action-after-anim", "target" => "objects"))
		),
		"out" => array(
			"commands"	=> array(array("cmd" => "send-to-back"), array("cmd" => "play-action"), "short-out-right", array("cmd" => "next-frame"))
		)
	),
	"film" => array(
		"in"  => array(
			"commands" => array(array("cmd" => "bring-to-front"), array("cmd" => "prepare", "target" => "objects"), array("cmd" => "play-action", "target" => "objects"))
		),
		"out" => array(
			"commands"	=> array(array("cmd" => "send-to-back"), array("cmd" => "play-action"), array("cmd" => "next-frame"))
		)
	)
);
/*-------------------
End Configuration
-------------------*/




























































if(!function_exists('stripslashes_deep')){
	function stripslashes_deep($value) {
		$value = is_array($value) ?
				array_map('stripslashes_deep', $value) :
				stripslashes($value);

		return $value;
	}
}

$_POST = array_map('stripslashes_deep', $_POST);
$_GET = array_map('stripslashes_deep', $_GET);
$_REQUEST = array_map('stripslashes_deep', $_REQUEST);

session_start();

if($_GET['page'] == 'logout'){
	$_SESSION['is_login'] = null;
	unset($_SESSION['is_login']);
	header('Location: ?page=login');
	die();
}else if($_GET['page'] == 'login'){
	if(count($_POST) > 0){
		if($_POST['username'] == $admin_user && $_POST['password'] == $admin_pwd){
			$_SESSION['is_login'] = true;
			header('Location: ?page=sliders');
			die();
		}
	}
}

if(isset($_SESSION['is_login'])){
	$is_login = true;
}else if($_GET['page'] != 'login'){
	header('Location: ?page=login');
	die();
}

function is_slider_existed($slider_alias){
	if(file_exists(__DIR__.'/data/'.$slider_alias.'.js')){
		return true;
	}
	return false;
}

function save_slider($data){
	$fp = fopen(__DIR__.'/data/'.$data['alias'].'.js', "w");
	fwrite($fp, json_encode($data));
	fclose($fp);
	return true;
}

function delete_slider($slider_alias){
	unlink(__DIR__.'/data/'.$slider_alias.'.js');
}

function get_slider_data($slider_alias){
	
	if(preg_match('#^[a-z0-9_-]*$#',$slider_alias)){
		$json = file_get_contents(__DIR__.'/data/'.$slider_alias.'.js');
		if(empty($json)) return null;
		$slider = json_decode($json, true);
		if(empty($slider)) return null;
		
		return $slider;
	}else return null;
}

function save_slider_data($slider_alias, $data){
	if(preg_match('#^[a-z0-9_-]*$#',$slider_alias)){
		$fp = fopen(__DIR__.'/data/'.$slider_alias.'.js', "w");
		fwrite($fp, json_encode($data));
		fclose($fp);
		return true;
	}
	return false;
}

function json_to_js_object($json){
	//remove \n
	$json = preg_replace('/\\\n/', '', $json, -1);
	$json = preg_replace('#\\\/#', '/', $json, -1);
	//remove x.x00em
	$json = preg_replace('/\.([1-9]{1})00em/', '.$1em', $json, -1);
	//remove x.000em
	$json = preg_replace('/\.000em/', 'em', $json, -1);
	//remove empty key
	$json = preg_replace('/,"[a-z0-9_-]+":""/', '', $json, -1);
	//remove function quote ""
	$json = preg_replace('/"function([^"]*)"/', 'function$1', $json, -1);
	//remove number quote ""
	return preg_replace('/"([\-]?[0-9]+[\.]?[0-9]*)"/', '$1', $json, -1);
}

if(empty($_GET['page'])) $_GET['page'] = 'sliders';

if(in_array($_GET['page'], array('login', 'slides', 'sliders', 'create-new-slider'))){

$slider_alias = $_GET['slider'];
if(!empty($slider_alias)){
	$slide_id = $_GET['slide_id'];
	$slider = get_slider_data($slider_alias);
	
	if(empty($slide_id)){
		foreach($slider['actions'] as $slide_id_ => $objects) :
			header('Location: ?page=slides&slider='.$slider_alias.'&slide_id='.$slide_id_);
			die();
			break;
		endforeach;
	}
}
?>

<!DOCTYPE html>
<head>
<title>AZSlider Editor <?php echo empty($slider['name']) ? '' : ' - '.$slider['name'];?></title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta http-equiv="cleartype" content="on">
<link type="image/x-icon" href="favicon.png" rel="icon" />
<link rel="SHORTCUT ICON" href="favicon.png"/>
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320">
<meta name="viewport" content="width=device-width">

<link rel="stylesheet" href="vendor/foundation-5.2.2/css/normalize.css">
<link rel="stylesheet" href="vendor/foundation-5.2.2/css/foundation.min.css">
<style>
	/* Foundation custom */
table .button, table button, .slide-tab.button{
	margin: 0;	
}

#slides-tabs, #slides-buttons{
	float: left;
}
#slides-buttons button{
	margin: 0;
}
.slide-tab.button{
	margin-right: 5px;
	background-color:#ccc;
}
.slide-tab.button.selected{
	background-color:#43a047;
}

/* Custom Dev Slider Styles */
.slide-wrapper{
	background: url(images/bg-transparent.png);
	overflow: hidden;
	padding: 20px 0;
}

.slide-wrapper .az-slider{
	margin: 0 auto;
}
.slide-wrapper img{
	pointer-events: none;	
}

.az-dev .az-frame{
	background-color:#fff;
}

/* Jquery UI Custom */
.ui-draggable{
	cursor: move;	
}

.row.slide-action, .row.anim, .row.object-selector{
	border:1px solid #ccc;
	border-bottom: none;
}
.row.slide-action:last-child, .row.anim:last-child, .row.object-selector:last-child{
	border-bottom: 1px solid #ccc;
}

.item-obj{
	padding: 10px;	
	margin-bottom:2px;
	background-color:#f2f2f2;
	cursor: move;
}
.item-obj.selected{
	background-color: #2ba6cb;
}

.object-selector.even{
	background-color:#f2f2f2;	
}

/* Slider */
.az-viewport{
	overflow: hidden;
}
.az-frame{
	overflow: hidden;
}

/** Text **/
.az-text-wrapper{
	display: inline-block;
	overflow: hidden;
	padding: 2.8em;
}
.az-text{
	font-size: 2.2em;
}

/** Image **/
.az-image-wrapper{
	overflow: hidden;
}
.az-image-wrapper img{
	max-width: none !important;
	position: relative;
}
/** Background **/
.az-bg{
	position: absolute;
	z-index: 1;
}
.az-bg-wrapper{
	position: absolute !important;
}
.az-bg-wrapper img{
	max-width: none !important;
	overflow: hidden;
}

/** Background : Grid **/
.az-bg-wrapper .az-cell{
	overflow: hidden;
	position: absolute !important;
}
.az-bg-wrapper .az-cell img{
	position: absolute;
}

.az-html-wrapper{
	padding: 2em;
}

.az-iframe-wrapper{
	padding: 2em;
}


/* Clearfix */
.clearfix:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
}
 
.clearfix {
    display: inline-block;
}
 
html[xmlns] .clearfix {
    display: block;
}
 
* html .clearfix {
    height: 1%;
}
</style>
<script src="//code.jquery.com/jquery-2.0.2.min.js"></script>
<script src="vendor/foundation-5.2.2/js/vendor/modernizr.js"></script>
<script src="vendor/foundation-5.2.2/js/foundation.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.7.5/less.min.js"></script>
</head>
<body>
<div class="sticky">
	<nav class="top-bar" data-topbar>
		<ul class="title-area">
			<li class="name">
			<h1><a href="?page=sliders">AZSlider</a></h1>
			</li>
			<li class="toggle-topbar menu-icon"><a href="javascript:void(0);"><span>Menu</span></a></li>
		</ul>

		<section class="top-bar-section">
			<ul class="left">
			<?php if($_GET['page'] == 'slides') : ?>
				<li class="has-dropdown"><a href="javascript:void(0);">Slider</a>
					<ul class="dropdown">
						<li><a href="javascript:void(0);" data-reveal-id="data-source">Data Source</a></li>
						<!--<li><a href="javascript:void(0);" onclick="$.azt_export_zip()">Export</a></li>-->
						<li><a href="?page=embed&slider=<?php echo $_GET['slider'];?>" target="_blank">Embed</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="slider-settings">Settings</a></li>
					</ul>
				</li>
				<li class="has-dropdown"><a href="javascript:void(0);">Slide</a>
					<ul class="dropdown">
						<li><a href="javascript:void(0);" onclick="$.azt_save_slide('?page=save', '<?php echo $_GET['slider'];?>', slide_id)">Save Slide</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="add-new-slide">Add New Slide</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="duplicate-slide">Duplicate Slide</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="remove-slide">Remove Slide</a></li>
					</ul>
				</li>
				<li class="has-dropdown">
					<a href="javascript:void(0);">Objects</a>
					<ul class="dropdown">
						<li><a href="javascript:void(0);" data-reveal-id="add-bg-modal">Add Background</a></li>
						<li><a href="javascript:void(0);" onclick="$.azt_add_text('Text Object');">Add Text</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="add-image-modal">Add Image</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="add-iframe-modal">Add Iframe</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="add-video-modal">Add HTML5 Video</a></li>
						<li><a href="javascript:void(0);" data-reveal-id="add-html-modal">Add HTML Content</a></li>
						<li><a href="javascript:void(0);" onclick="$.azt_add_tooltip('Tooltip Object');">Add Tooltip</a></li>
						<li><a href="javascript:void(0);" id="btn-remove-object">Remove Object</a></li>
					</ul>
				</li>
				<li class="has-dropdown">
					<a href="javascript:void(0);">Position</a>
					<ul class="dropdown">
						<li><a href="javascript:void(0);" onclick="$.azt_set_xy('zero');">Zero</a></li>
						<li class="has-dropdown">
							<a href="javascript:void(0);">Horizontal</a>
							<ul class="dropdown">	
								<li><a href="javascript:void(0);" onclick="$.azt_set_xy('left');">Left</a></li>
								<li><a href="javascript:void(0);" onclick="$.azt_set_xy('right');">Right</a></li>
								<li><a href="javascript:void(0);" onclick="$.azt_set_xy('x-center');">Center</a></li>
							</ul>
						</li>
						<li class="has-dropdown">
							<a href="javascript:void(0);">Vertical</a>
							<ul class="dropdown">
								<li><a href="javascript:void(0);" onclick="$.azt_set_xy('top');">Top</a></li>
								<li><a href="javascript:void(0);" onclick="$.azt_set_xy('bottom');">Bottom</a></li>
								<li><a href="javascript:void(0);" onclick="$.azt_set_xy('y-center');">Middle</a></li>
							</ul>
						</li>
					</ul>
				</li>
				<!--<li><a href="one.php?slider=<?php echo $_GET['slider'];?>&slide_id=<?php echo $_GET['slide_id'];?>" target="_blank" onclick="return $.azt_play_slide(this.href);">Play Slide</a></li>-->
				<li><a href="?page=play&slider=<?php echo $_GET['slider'];?>" target="_blank" onclick="$.azt_play_slider('?page=save', '<?php echo $_GET['slider'];?>', slide_id, this.href); return false;">Play Slider</a></li>
			<?php endif; ?>
			</ul>
			
			<ul class="right">
				<li><a href="" id="azt-status"></a></li>	
				<?php if($is_login == false ) { ?>
				<li><a href="?page=login">Login</a></li>
				<?php }else{ ?>
				<li><a href="?page=logout">Logout</a></li>
				<?php } ?>
			</ul>
		</section>
	</nav>
</div>
	<?php
	switch($_GET['page']){
	
		case 'create-new-slider':
?>
<form action="?page=save&act=create_slider" method="post">
  <div class="row">
    <div class="large-12 columns">
      <h1>Create Slider</h1>
    </div>
  </div>
  <div class="row">
    <div class="large-4 columns">
      <label>Name *
        <input type="text" name="name" placeholder="Slider Name" />
      </label>
    </div>
    <div class="large-4 columns">
      <label>Alias *
        <input type="text" name="alias" placeholder="Slider Alias" />
      </label>
    </div>
    <div class="large-4 columns">

    </div>
  </div>
  <div class="row">
    <div class="large-4 columns">
      <label>Max Width *
        <div class="row collapse">
          <div class="small-9 columns">
            <input type="text" name="width" placeholder="Max Width of Slider" />
          </div>
          <div class="small-3 columns">
            <span class="postfix">px</span>
          </div>
        </div>
      </label>
    </div>
    <div class="large-4 columns">
      <label>Height *
        <div class="row collapse">
          <div class="small-9 columns">
            <input type="text" name="height" placeholder="Height of Slider" />
          </div>
          <div class="small-3 columns">
            <span class="postfix">px</span>
          </div>
        </div>
      </label>
    </div>
    <div class="large-4 columns">

    </div>
  </div>
  <div class="row">
    <div class="large-4 columns">
      <label>Responsive
        <select name="responsive">
          <option value="auto">Auto</option>
        </select>
      </label>
    </div>
    <div class="large-4 columns">
      <label>Slides Layout
        <select name="frames_layout">
          <option value="card">Card</option>
          <option value="film">Film (Support Touch Swipe)</option>
        </select>
      </label>
    </div>
    <div class="large-4 columns">

    </div>
  </div>
  <div class="row">
    <div class="large-12 columns">
      <button class="small">Create</button>
      <a href="?page=sliders" class="small button alert">Cancel</a>
    </div>
  </div>

</form>
<?php
		break;
		
		case 'sliders':
			if ($handle = opendir('data')) {
			    while (false !== ($entry = readdir($handle))) {
			        if ($entry != '.' && $entry != '..') {
			        	if($entry == 'index.html') continue;
			            $sliders[] = json_decode(file_get_contents('data/'.$entry), true);
			        }
			    }
			    closedir($handle);
			}
			?>

<div class="row">
	<div class="large-12 columns">
		<div class="row">
			<div class="small-6 columns">
				<h1>Sliders</h1>
			</div>
			<div class="small-6 columns" style="text-align: right">
				<br>
				<a href="?page=create-new-slider" class="small button">Create Slider</a>
			</div>
		</div>
		<table width="100%">
		  <thead>
			<tr>
			  <th width="50">#</th>
			  <th>Slider Name</th>
			  <th>Slider Alias</th>
			  <th>Slides</th>
			  <th>Layout</th>
			  <th>Skin</th>
			  <th>Size</th>
			  <th width="170">Actions</th>
			</tr>
		  </thead>
		  <tbody>
		  <?php 
			foreach($sliders as $idx => $slider):
			?>
			<tr>
				<td><?php echo ($idx + 1);?></td>
				<td><?php echo $slider['name'];?></td>
				<td><?php echo $slider['alias'];?></td>
				<td><?php echo count($slider['actions']);?></td>
				<td><?php echo ($slider['frames_layout'] == 'film' ? $slider['film_dir'].' '.$slider['frames_layout'] : $slider['frames_layout']);?></td>
				<td><?php echo $slider['skin'];?></td>
				<td><?php echo $slider['width'];?>x<?php echo $slider['height'];?></td>
				<td>
					<a href="?page=slides&slider=<?php echo $slider['alias'];?>" class="tiny button">Slides</a>
					<a href="?page=save&act=delete_slider&slider=<?php echo $slider['alias'];?>" class="tiny button alert" onclick="return confirm('Are you sure?');">Delete</a>
				</td>
			</tr>
			<?php
			endforeach
			?>
		  </tbody>
		</table>
	</div>
</div>
<?php
		break;
		
		case 'slides':
?>
<link href='<?php echo $slider['web_font_url']; ?>' rel='stylesheet' type='text/css'>
<style type="text/css" media="screen">
    #aztp_css, #txt-ds-json{ 
        position: absolute;
        top: 80px;
        right: 0;
        bottom: 0;
        left: 0;
        height: 500px;
        margin-bottom: 30px;
    }
    #txt-ds-json{
    	top: 170px;
    }
    <?php echo $slider['css'];?>
</style>
<div class="clearfix">
	<div id="slides-tabs">
		<?php $idx = 0; foreach($slider['actions'] as $slide_id_ => $actions) : $idx++; ?><a href="?page=slides&slider=<?php echo $slider_alias;?>&slide_id=<?php echo $slide_id_;?>" class="slide-tab button <?php if($slide_id == $slide_id_) echo 'selected'; ?>" data-slide_id="<?php echo $slide_id_;?>"><?php echo $idx.'. '.$slide_id_;?></a><?php endforeach; ?>
	</div>
	<div id="slides-buttons">
		<button type="button" onclick="$.azt_save_slides_order('?page=save', '<?php echo $_GET['slider'];?>')">Save the order</button>
	</div>
</div>

<div class="slide-wrapper az-dev">
	<div id="<?php echo $slider_alias;?>"></div>
</div>
<div class="row">
	<div class="large-12 columns">
		<dl class="tabs" data-tab>
			
		  <dd class="active"><a href="#panel2-5">Objects</a></dd>
		  <dd><a href="#panel2-1">Design</a></dd>
		  <dd><a href="#panel2-2">Slide Actions</a></dd>
		  <dd><a href="#panel2-3">Target Actions</a></dd>
		  <dd><a href="#panel2-4">Custom Animations</a></dd>
		  <dd><a href="#panel2-6">CSS</a></dd>
		</dl>
		<div class="tabs-content">
			
			<div class="content active" id="panel2-5">
				<div class="row">
					<div class="large-6 columns">
						<div id="list-of-objects"></div>
					</div>
					<div class="large-6 columns">
						<button type="button" id="" onclick="$.azt_save_list_of_objects('?page=save', '<?php echo $_GET['slider'];?>', '<?php echo $_GET['slide_id'];?>')">Save the order</button>
					</div>
				</div>
			</div>
			
			<div class="content" id="panel2-1">
				<div id="aztp-text" style="display: none">
					<div class="row">
						<div class="large-4 columns">
							<label>Text
								<input type="text" placeholder="Content of Text Object" id="aztp_text_content" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_id" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_zindex" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Background Color
								<input type="text" placeholder="" id="aztp_bgcolor" />
							</label>
						</div>
					</div>
					
					<div class="row">
						
						<div class="large-3 columns">
							<label>Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Top Position" id="aztp_text_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Left Position" id="aztp_text_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						
						<div class="large-2 columns">
							<label>Transform Origin X
								<div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_text_transform_origin_x" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">%</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Transform Origin Y
								  <div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_text_transform_origin_y" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">%</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Perspective
								  <div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_text_perspective" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">em</span>
									</div>
								</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-2 columns">
							<label>Font Size
								  <div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_text_font_size" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">em</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-4 columns">
							<label>Font Family
								<input type="text" id="aztp_text_font_family" />
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Font Weight
								<input type="text" id="aztp_text_font_weight" />
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Text Color
								<input type="text" id="aztp_text_color" />
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Padding
								<div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_text_padding" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">em</span>
									</div>
								</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-12 columns">
							<label>More CSS
								<textarea id="aztp_more_styles"></textarea>
							</label>
						</div>
					</div>
			
				</div>
				
				
				
				<div id="aztp-image" style="display: none">
					<div class="row">
						<div class="large-6 columns">
							<label>Image URL
							<div class="row collapse">
								<div class="small-10 columns">
								  <input type="text" placeholder="" id="aztp_image_url" disabled />
								</div>
								<div class="small-2 columns">
								  <span class="postfix button">View</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_image_id" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_image_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_image_zindex" />
							</label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Wrapper Width
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_wimage_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Wrapper Height
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_wimage_height" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Image Width
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_image_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Image Height
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_image_height" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Wrapper Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Top Position of Wrapper" id="aztp_wimage_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Wrapper Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Left Position of Wrapper" id="aztp_wimage_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Image Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Top Position of Image" id="aztp_image_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Image Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Left Position of Image" id="aztp_image_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Transform Origin X
								<div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_image_transform_origin_x" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">%</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Transform Origin Y
								  <div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_image_transform_origin_y" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">%</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Perspective
								  <div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_image_perspective" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">em</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-3 columns"><br></div>
					</div>
					
					<div class="row">
						<div class="large-12 columns">
							<label>More CSS
								<textarea id="aztp_more_image_styles"></textarea>
							</label>
						</div>
					</div>
				</div>
				
				
				
				<div id="aztp-video" style="display: none">
					<div class="row">
						<div class="large-6 columns">
							<label>Video URL
							<div class="row collapse">
								<div class="small-10 columns">
								  <input type="text" placeholder="" id="aztp_video_url" disabled />
								</div>
								<div class="small-2 columns">
								  <span class="postfix button">View</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_video_id" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_video_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_video_zindex" />
							</label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Width
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_video_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Height
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_video_height" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_video_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_video_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-2 columns">
							<label>Autoplay
							<select id="aztp_video_autoplay">
								<option value="0">No</option>
								<option value="1">Yes</option>
							</select>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Controls
							<select id="aztp_video_controls">
								<option value="0">No</option>
								<option value="1">Yes</option>
							</select>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Loop
							<select id="aztp_video_loop">
								<option value="0">No</option>
								<option value="1">Yes</option>
							</select>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Muted
							<select id="aztp_video_muted">
								<option value="0">No</option>
								<option value="1">Yes</option>
							</select>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Preload
							<select id="aztp_video_preload">
								<option value="0">No</option>
								<option value="1">Yes</option>
							</select>
						  </label>
						</div>
						<div class="large-2 columns"></div>
					</div>
					<div class="row">
						<div class="large-6 columns">
							<label>Poster URL
							<div class="row collapse">
								<div class="small-10 columns">
								  <input type="text" placeholder="" id="aztp_video_poster" />
								</div>
								<div class="small-2 columns">
								  <span class="postfix button">View</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Transform Origin X
								<div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_video_transform_origin_x" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">%</span>
									</div>
								</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Transform Origin Y
								  <div class="row collapse">
									<div class="small-9 columns">
									  <input type="text" id="aztp_video_transform_origin_y" />
									</div>
									<div class="small-3 columns">
									  <span class="postfix">%</span>
									</div>
								</div>
						  </label>
						</div>
					</div>
				</div>
				
				<div id="aztp-tooltip" style="display: none">
					<div class="row">
						<div class="large-3 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_tooltip_id" />
							</label>
						</div>
						<div class="large-3 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_tooltip_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_tooltip_zindex" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_tooltip_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_tooltip_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
						</div>
					</div>
					<div class="row">
						<div class="large-3 columns">
							<label>Max Width
								<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_tooltip_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">px</span>
								</div>
							</div>
							</label>
						</div>
						<div class="large-3 columns">
							<label>Position
								<select id="aztp_tooltip_position">
									<option value="top">Top</option>
									<option value="right">Right</option>
									<option value="bottom">Bottom</option>
									<option value="left">Left</option>
								</select>
							</label>
						</div>
						<div class="large-3 columns">
							<label>In Animation
								<select id="aztp_tooltip_in_anim">
								</select>
							</label>
						</div>
						<div class="large-3 columns">
							<label>Out Animation
								<select id="aztp_tooltip_out_anim">
								</select>
							</label>
						</div>
					</div>
					<div class="row">
						<div class="large-12 columns">
							<label>
								Text
							<textarea id="aztp_tooltip_text" style="height:100px"></textarea>
							</label>
						</div>
					</div>
				</div>
				
				<div id="aztp-html" style="display: none">
					<div class="row">
						<div class="large-3 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_html_id" />
							</label>
						</div>
						<div class="large-3 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_html_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_html_zindex" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_html_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_html_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
						</div>
					</div>
					<div class="row">
						<div class="large-12 columns">
							<label>
								HTML
							<textarea id="aztp_html" style="height:300px"></textarea>
							</label>
						</div>
					</div>
				</div>
				
				
				<div id="aztp-iframe" style="display: none">
					<div class="row">
						<div class="large-6 columns">
							<label>URL
								<input type="text" placeholder="" id="aztp_iframe_url" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_iframe_id" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_iframe_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_iframe_zindex" />
							</label>
						</div>
					</div>
					<div class="row">
						<div class="large-3 columns">
							<label>Width
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_iframe_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Height
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_iframe_height" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_iframe_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_iframe_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
					</div>
					<div class="row">
						<div class="large-12 columns">
							<label>Attributes
								<input type="text" placeholder="" id="aztp_iframe_attrs" />
							</label>
						</div>
					</div>
				</div>
				
				
				
				<div id="aztp-bg" style="display: none">
					<div class="row">
						<div class="large-6 columns">
							<label>Background URL
							<div class="row collapse">
								<div class="small-10 columns">
								  <input type="text" placeholder="" id="aztp_bg_url" disabled />
								</div>
								<div class="small-2 columns">
								  <span class="postfix button">View</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-2 columns">
							<label>Id
								<input type="text" placeholder="" id="aztp_bg_id" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Class
								<input type="text" placeholder="" id="aztp_bg_class" />
							</label>
						</div>
						<div class="large-2 columns">
							<label>Z-Index
								<input type="text" placeholder="" id="aztp_bg_zindex" />
							</label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Wrapper Width
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_wbg_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Wrapper Height
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_wbg_height" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label class="bg-s" style="display: none">Background Size
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_bg_size" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">%</span>
								</div>
							</div>
						  </label>
						  
							<label class="bg-wh">Background Width
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_bg_width" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label class="bg-wh">Background Height
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="" id="aztp_bg_height" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Wrapper Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Top Position of Wrapper" id="aztp_wbg_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Wrapper Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Left Position of Wrapper" id="aztp_wbg_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Background Top
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Top Position of Image" id="aztp_bg_top" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Background Left
							<div class="row collapse">
								<div class="small-9 columns">
								  <input type="text" placeholder="Left Position of Image" id="aztp_bg_left" />
								</div>
								<div class="small-3 columns">
								  <span class="postfix">em</span>
								</div>
							</div>
						  </label>
						</div>
					</div>
					
					<div class="row">
						<div class="large-3 columns">
							<label>Background Mode
								<select id="bg_mode">
								  <option value="norepeat">No Repeat</option>
								  <option value="xy">Repeat-XY</option>
								  <option value="x">Repeat-X</option>
								  <option value="y">Repeat-Y</option>
								  <option value="grid">Grid</option>
								</select>
							  </label>
						</div>
					</div>
					
					<div class="row" id="pnl_bg_grid_info2" style="display: none">
						<div class="large-3 columns">
							<label>Rows
								  <input type="text" placeholder="" id="aztp_rows" />
						  </label>
						</div>
						<div class="large-3 columns">
							<label>Cols
								  <input type="text" placeholder="" id="aztp_cols" />
						  </label>
						</div>
						<div class="large-3 columns">
							<br>
						</div>
						<div class="large-3 columns">
							<br>
						</div>
					</div>
					
					<div class="row" id="pnl_bg_grid_scripts" style="display: none">
						<div class="large-12 columns">
							<label>Grid Scripts
								<textarea id="aztp_grid_scripts" style="height:300px"></textarea>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div class="content" id="panel2-2">
				<div id="slide-actions-holder">
					
				</div>
				<div class="row">
					<div class="large-12 columns">
						<br>
						<button type="button" id="slide-btn-add-action" onclick="$.azt_add_slide_action('');">Add Action</button>
					</div>
				</div>
			</div>
			<div class="content" id="panel2-3">
				<div id="object-selectors-holder">
					
				</div>
				<div class="row">
					<div class="large-12 columns">
						<br>
						<button type="button" id="object-btn-add-action" onclick="$.azt_add_object_selector('');">Add Target</button>
					</div>
				</div>
			</div>
			
			<div class="content" id="panel2-4">
				<div id="custom-anims-holder">
					
				</div>
				<div class="row">
					<div class="large-12 columns">
						<br>
						<button type="button" id="slide-btn-add-anim" onclick="$.azt_add_custom_anim('');">Add Custom Animation</button>
					</div>
				</div>
			</div>
			
			<div class="content" id="panel2-6">
				<div id="aztp_css"><?php echo $slider['less'];?></div>
			</div>
		</div>
	</div>
</div>


<div id="add-image-modal" class="reveal-modal" data-reveal>
	
	<form id="frm-add-image" enctype="multipart/form-data" method="post" action="?page=save&act=upload_image">
		<div class="row">
			<div class="large-12 columns">
				<h2>Add Image</h2>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<label id="pnl_image_source">Image Source
					<select id="image_source">
					  <option value="upload">Upload</option>
					  <option value="url">From URL</option>
					</select>
				  </label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns" id="pnl_upload_image">
				<label> Upload Image
					<input type="file" id="upload_image" name="image">
				</label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns" id="pnl_url_image" style="display: none">
				<label> Image Url
					<input type="text" id="url_image">
				</label>
			</div>
		</div>
		<div class="row" id="pnl-add-image-info" style="display: none">
			<div class="large-6 columns">
				<p id="upload_image_info"></p>
			</div>
			<div class="large-6 columns">
				<label>Wrapper Width
					<div class="row collapse">
						<div class="small-9 columns">
						  <input type="text" placeholder="" id="add-image-wrapper-width" />
						</div>
						<div class="small-3 columns">
						  <span class="postfix">em</span>
						</div>
					</div>
				  </label>
				<label>Wrapper Height
					<div class="row collapse">
						<div class="small-9 columns">
						  <input type="text" placeholder="" id="add-image-wrapper-height" />
						</div>
						<div class="small-3 columns">
						  <span class="postfix">em</span>
						</div>
					</div>
				  </label>
				<div data-alert class="alert-box alert round close" id="image-size-alert" style="display: none">
					At least Image Width or Image Height cannot empty (Unit: em)
				</div>

				<label>Image Width
					<div class="row collapse">
						<div class="small-9 columns">
						  <input type="text" placeholder="" id="add-image-width" />
						</div>
						<div class="small-3 columns">
						  <span class="postfix">em</span>
						</div>
					</div>
				  </label>
				<label>Image Height
					<div class="row collapse">
						<div class="small-9 columns">
						  <input type="text" placeholder="" id="add-image-height" />
						</div>
						<div class="small-3 columns">
						  <span class="postfix">em</span>
						</div>
					</div>
				  </label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<button type="button" id="btn-add-image" style="display: none">Add Image</button>
				<button type="button" id="btn-uploading-image" style="display: none">Uploading...</button>
				<button type="submit" id="btn-upload-image">Upload Image</button>
			</div>
		</div>
	</form>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="add-bg-modal" class="reveal-modal" data-reveal>
	
	<form id="frm-add-bg" enctype="multipart/form-data" method="post" action="?page=save&act=upload_image">
		<div class="row">
			<div class="large-12 columns">
				<h2>Add Background</h2>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<label id="pnl_bg_source">Background Source
					<select id="bg_source">
					  <option value="upload">Upload</option>
					  <option value="url">From URL</option>
					</select>
				  </label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns" id="pnl_upload_bg">
				<label> Upload Background
					<input type="file" id="upload_bg" name="bg">
				</label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns" id="pnl_url_bg" style="display: none">
				<label> Background Url
					<input type="text" id="url_bg">
				</label>
			</div>
		</div>
		<div class="row" id="pnl-add-bg-info" style="display: none">
			<div class="large-6 columns">
				<p id="upload_bg_info"></p>
			</div>
			<div class="large-6 columns">
				<label>Background Mode
					<select id="bg_type">
					  <option value="norepeat">No Repeat</option>
					  <option value="xy">Repeat-XY</option>
					  <option value="x">Repeat-X</option>
					  <option value="y">Repeat-Y</option>
					  <option value="grid">Grid</option>
					</select>
				  </label>
				  <div id="pnl_bg_grid_info" style="display: none">
					<label>Number of Columns
						<input type="text" placeholder="" value="6" id="add-bg-cols" />
					  </label>
					<label>Number of Rows
						<input type="text" placeholder="" value="4" id="add-bg-rows" />
					  </label>
				  </div>
				    
				<div data-alert class="alert-box alert round close" id="bg-size-alert" style="display: none">
					At least Image Width or Image Height cannot empty (Unit: em)
				</div>

				<label>Image Width
					<div class="row collapse">
						<div class="small-9 columns">
						  <input type="text" placeholder="" id="add-bg-width" />
						</div>
						<div class="small-3 columns">
						  <span class="postfix">em</span>
						</div>
					</div>
				  </label>
				<label>Image Height
					<div class="row collapse">
						<div class="small-9 columns">
						  <input type="text" placeholder="" id="add-bg-height" />
						</div>
						<div class="small-3 columns">
						  <span class="postfix">em</span>
						</div>
					</div>
				  </label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<button type="button" id="btn-add-bg" style="display: none">Add Background</button>
				<button type="button" id="btn-uploading-bg" style="display: none">Uploading...</button>
				<button type="submit" id="btn-upload-bg">Upload Background</button>
			</div>
		</div>
	</form>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="add-new-slide" class="reveal-modal" data-reveal>
	
	<form id="frm-add-bg" enctype="multipart/form-data" method="post" action="?page=save&act=add_new_slide&slider=<?php echo $slider_alias;?>">
		<div class="row">
			<div class="large-12 columns">
				<h2>Add New Slide</h2>
			</div>
		</div>
		<div class="row">
			<div class="large-6 columns">
				<label>Slide ID
					<input type="text" name="slide_id">
				</label>
			</div>
			<div class="large-6 columns">
				<label>Template
					<select name="template">
					  <option value="default">Default</option>
					  <option value="blank">Blank</option>
					</select>
				  </label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<button type="submit" id="btn-upload-bg">Add Slide</button>
			</div>
		</div>
	</form>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="duplicate-slide" class="reveal-modal" data-reveal>
	
	<form id="frm-add-bg" enctype="multipart/form-data" method="post" action="?page=save&act=duplicate_slide&slider=<?php echo $slider_alias;?>">
		<div class="row">
			<div class="large-12 columns">
				<h2>Duplicate Slide</h2>
			</div>
		</div>
		<div class="row">
			<div class="large-6 columns">
				<label>New Slide ID
					<input type="text" name="new_slide_id">
					<input type="hidden" name="slide_id" value="<?php echo $slide_id;?>">
				</label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<button type="submit" id="btn-upload-bg">Duplicate Slide</button>
			</div>
		</div>
	</form>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="remove-slide" class="reveal-modal" data-reveal>
	
	<form id="frm-add-bg" enctype="multipart/form-data" method="post" action="?page=save&act=remove_slide&slider=<?php echo $slider_alias;?>&slide_id=<?php echo $slide_id;?>">
		<div class="row">
			<div class="large-12 columns">
				<h2>Remove Slide</h2>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<label>Are You Sure To Remove Slide ID?
					<input type="text" name="slide_id" value="<?php echo $slide_id;?>" disabled>
				</label>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<button type="submit">Remove Slide</button>
			</div>
		</div>
	</form>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="embed-slider" class="reveal-modal" data-reveal>
	<h2>Embed Code</h2>
	<textarea id="txt-embed" style="width: 100%; height: 500px"></textarea>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="data-source" class="reveal-modal" data-reveal>
	<h2>Data Source</h2>
	<label>Type
		<select name="template" id="ds-type">
			<option value="" <?php echo $slider['datasource']['type'] == '' ? 'selected' : ''?>>None</option>
		  <option value="json" <?php echo $slider['datasource']['type'] == 'json' ? 'selected' : ''?>>JSON</option>
		  <!--<option value="url" <?php echo $slider['datasource']['type'] == 'url' ? 'selected' : ''?>>URL</option>-->
		</select>
	  </label>
	<input type="text" id="txt-ds-url" value="" style="display: none">
	<?php
	$json = preg_replace('/\}\],\[\{/', "}],\n[{", json_encode($slider['datasource']['data']));
	$json = preg_replace('#\\\/#', '/', $json);
	?>
	<div id="txt-ds-json" style="width: 100%; height: 400px; display: none"><?php echo $json; ?></div>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="slider-settings" class="reveal-modal" data-reveal>
	<form action="?page=save&act=save_slider_settings" method="post">
	<div class="row">
		<div class="large-12 columns">
			<h2>Slider Settings</h2>
		</div>
	</div>
	<div class="row">
		<div class="large-4 columns">
			<label>
				Slider Max Width
				<div class="row collapse">
					<div class="small-9 columns">
						<input type="text" name="width" value="<?php echo $slider['width']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">px</span>
					</div>
				</div>
			</label>
		</div>
		<div class="large-4 columns">
			<label>
				Slider Height
				<div class="row collapse">
					<div class="small-9 columns">
						<input type="text" name="height" value="<?php echo $slider['height']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">px</span>
					</div>
				</div>
			</label>
		</div>
		<div class="large-4 columns">
			<label>
				Viewport Wrapper Max Length
				<div class="row collapse">
					<div class="small-9 columns">
						<input type="text" name="wwidth" value="<?php echo $slider['wwidth']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">em</span>
					</div>
				</div>
			</label>
		</div>
	</div>
		
	
	<div class="row">
		<div class="large-3 columns">
			<label>
				Slides Layout
				<select name="frames_layout" id="frames_layout">
					<option value="card" <?php echo $slider['frames_layout'] == 'card' ? 'selected' : ''?>>Card</option>
					<option value="film" <?php echo $slider['frames_layout'] == 'film' ? 'selected' : ''?>>Film</option>
				</select>
			</label>
		</div>
		<div class="large-3 columns">
			<label>
				Skin
				<select name="slider_skins" id="slider_skins">
					<?php
					if ($handle = opendir('skins')) {
					    while (false !== ($entry = readdir($handle))) {
					        if ($entry != '.' && $entry != '..') {
					        	if($entry == 'index.html') continue;
					        	echo '<option value="'.$entry.'" '.($entry == $slider['skin'] ? 'selected' : '').'>'.$entry.'</option>';
					        }
					    }
					    closedir($handle);
					}
					?>
				</select>
			</label>
		</div>
		<div class="large-3 columns">
			<label>
				Loop Slides
				<select name="loop">
					<option value="0" <?php echo $slider['loop'] == 0 ? 'selected' : ''?>>No</option>
					<option value="1" <?php echo $slider['loop'] == 1 ? 'selected' : ''?>>Yes</option>
				</select>
			</label>
		</div>
		<div class="large-3 columns">
			<label>
				SEO
				<select name="slider_seo">
					<option value="0" <?php echo $slider['seo'] == 0 ? 'selected' : ''?>>No</option>
					<option value="1" <?php echo $slider['seo'] == 1 ? 'selected' : ''?>>Yes</option>
				</select>
			</label>
		</div>
	</div>
	
	<div class="row" id="film-layout-settings" style="display: none; background-color:#f2f2f2; margin-bottom: 30px">
		<div class="large-2 columns">
			<label>
				Direction
				<select name="film_dir">
					<option value="horizontal" <?php echo $slider['film_dir'] == 'horizontal' ? 'selected' : ''?>>Horizontal</option>
					<option value="vertical" <?php echo $slider['film_dir'] == 'vertical' ? 'selected' : ''?>>Vertical</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Animation
				<select name="glide_animation" id="glide-animation">
					
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Duration
				<div class="row collapse">
					<div class="small-9 columns">
						<input type="text" name="glide_time" value="<?php echo $slider['glide_time']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">ms</span>
					</div>
				</div>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Easing
				<select name="glide_easing" id="glide-easing">
					
				</select>
			</label>
		</div>		
		<div class="large-2 columns">
			<label>
				Distance Ratio
				<input type="text" name="film_layout_ratio" value="<?php echo $slider['film_layout_ratio']; ?>" />
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Play Slide When
				<select name="play_slide_when">
					<option value="released" <?php echo $slider['play_slide_when'] == 'release' ? 'selected' : ''?>>Touch Released</option>
					<option value="completed" <?php echo $slider['play_slide_when'] == 'completed' ? 'selected' : ''?>>Animation Completed</option>
				</select>
			</label>
		</div>
	</div>
	
	
	<div class="row">
		<div class="large-2 columns">
			<label>
				Is Autoplay?
				<select name="autoplay">
					<option value="0" <?php echo $slider['autoplay'] == 0 ? 'selected' : ''?>>No</option>
					<option value="1" <?php echo $slider['autoplay'] == 1 ? 'selected' : ''?>>Yes</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Autoplay Duration
				<div class="row collapse">
					<div class="small-9 columns">
						<input type="text" name="autoplay_time" value="<?php echo $slider['autoplay_time']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">ms</span>
					</div>
				</div>
			</label>
		</div>
		<div class="large-3 columns">
			<label>Slides Transform Origin X
				<div class="row collapse">
					<div class="small-9 columns">
					  <input type="text" name="slides_trans_ox" value="<?php echo $slider['slides_trans_ox']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">%</span>
					</div>
				</div>
		  </label>
		</div>
		<div class="large-3 columns">
			<label>Slides Transform Origin Y
				  <div class="row collapse">
					<div class="small-9 columns">
					  <input type="text" name="slides_trans_oy" value="<?php echo $slider['slides_trans_oy']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">%</span>
					</div>
				</div>
		  </label>
		</div>
		<div class="large-2 columns">
			<label>Slides Perspective
				  <div class="row collapse">
					<div class="small-9 columns">
					  <input type="text" name="slides_perspective" value="<?php echo $slider['slides_perspective']; ?>" />
					</div>
					<div class="small-3 columns">
					  <span class="postfix">em</span>
					</div>
				</div>
		  </label>
		</div>
	</div>
	<div class="row">
		<div class="large-4 columns">
			<label>
				Show Arrows Navigator
				<select name="nav_arrows">
					<option value="0" <?php echo $slider['nav_arrows'] == 0 ? 'selected' : ''?>>No</option>
					<option value="1" <?php echo $slider['nav_arrows'] == 1 ? 'selected' : ''?>>Yes</option>
				</select>
			</label>
		</div>
		<div class="large-4 columns">
			<label>
				Show Bullets Navigator
				<select name="nav_bullets">
					<option value="0" <?php echo $slider['nav_bullets'] == 0 ? 'selected' : ''?>>No</option>
					<option value="1" <?php echo $slider['nav_bullets'] == 1 ? 'selected' : ''?>>Yes</option>
				</select>
			</label>
		</div>
		<div class="large-4 columns">
			<label>
				Show Thumbnails Navigator
				<select name="nav_thumbs">
					<option value="0" <?php echo $slider['nav_thumbs'] == 0 ? 'selected' : ''?>>No</option>
					<option value="1" <?php echo $slider['nav_thumbs'] == 1 ? 'selected' : ''?>>Yes</option>
				</select>
			</label>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
		<label>
			Web Font URL
			<input type="text" name="web_font_url" value="<?php echo $slider['web_font_url']; ?>" />
		</label>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<button type="submit">Save</button>
		</div>
	</div>
	<input type="hidden" name="slider" value="<?php echo $slider_alias;?>">
	<input type="hidden" name="slide_id" value="<?php echo $slide_id;?>">
	</form>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="add-video-modal" class="reveal-modal" data-reveal>
	<form id="frm-add-video" enctype="multipart/form-data" method="post" action="?page=save&act=upload_image">
	<div class="row">
		<div class="large-12 columns">
			<h2>Add HTML5 Video</h2>
			<label id="pnl_video_source">Video Source
				<select id="video_source">
				  <option value="upload">Upload</option>
				  <option value="url">From URL</option>
				</select>
			  </label>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns" id="pnl_upload_video">
			<label> Upload Video
				<input type="file" id="upload_video" name="video">
			</label>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns" id="pnl_url_video" style="display: none">
			<label> Video URL
				<input type="text" id="url_video">
			</label>
		</div>
	</div>
	
	<div class="row">
		<div class="large-2 columns">
			<label>
				Autoplay
				<select id="video_autoplay">
					<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Show Controls
				<select id="video_controls">
					<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Loop
				<select id="video_loop">
					<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Muted
				<select id="video_muted">
					<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns">
			<label>
				Preload
				<select id="video_preload">
					<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
			</label>
		</div>
		<div class="large-2 columns"></div>
	</div>
	<div class="row">
		<div class="large-6 columns">
			<label>
			Width
			<div class="row collapse">
				<div class="small-9 columns">
				  <input type="text" placeholder="" id="video_width" />
				</div>
				<div class="small-3 columns">
				  <span class="postfix">em</span>
				</div>
			</div>
		</label>
		</div>
		<div class="large-6 columns">
			<label>
			Height
			<div class="row collapse">
				<div class="small-9 columns">
				  <input type="text" placeholder="" id="video_width" />
				</div>
				<div class="small-3 columns">
				  <span class="postfix">em</span>
				</div>
			</div>
		</label>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<button type="button" id="btn-add-video" style="display: none">Add Video</button>
			<button type="button" id="btn-uploading-video" style="display: none">Uploading...</button>
			<button type="submit" id="btn-upload-video">Upload Video</button>
		</div>
	</div>
	<a class="close-reveal-modal">&#215;</a>
	</form>
</div>

<div id="add-html-modal" class="reveal-modal" data-reveal>
	<h2>HTML Code</h2>
	<textarea id="html-code" style="width: 100%; height: 500px"></textarea>
	<button type="button" id="btn-add-html">Add HTML</button>
	<a class="close-reveal-modal">&#215;</a>
</div>

<div id="add-iframe-modal" class="reveal-modal" data-reveal>
	<div class="row">
		<div class="large-12 columns">
			<h2>Add Iframe</h2>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<label>URL
				<input type="text" id="iframe_url">
			</label>
		</div>
	</div>
	<div class="row">
		<div class="large-8 columns">
			<label>
			Attributes
			<input type="text" id="iframe_attrs" value="" />
		</label>
		</div>
		<div class="large-2 columns">
			<label>
			Width
			<div class="row collapse">
				<div class="small-9 columns">
				  <input type="text" placeholder="" id="iframe_width" />
				</div>
				<div class="small-3 columns">
				  <span class="postfix">em</span>
				</div>
			</div>
		</label>
		</div>
		<div class="large-2 columns">
			<label>
			Height
			<div class="row collapse">
				<div class="small-9 columns">
				  <input type="text" placeholder="" id="iframe_height" />
				</div>
				<div class="small-3 columns">
				  <span class="postfix">em</span>
				</div>
			</div>
		</label>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<button type="button" id="btn-add-iframe">Add Iframe</button>
		</div>
	</div>
	<a class="close-reveal-modal">&#215;</a>
	</form>
</div>

<!-- JQUERY UI -->
<link rel="stylesheet" href="vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.4.custom.min.css" media="screen">
<script src="vendor/jquery-ui/js/jquery-ui-1.10.4.custom.min.js"></script>


<script src="vendor/jquery.transit.js"></script>

<script src="js/az-slider.js"></script>
<script src="js/az-slider-tools.js"></script>

<script>
	var slider_id = '<?php echo $slider_alias;?>';
	var slide_id = '<?php echo $slide_id;?>';
	$(function(){
		
		var slider = $('#'+slider_id).azslider_init({
			is_tool: true,
			wait_image: false,
			data: {
				'<?php echo $slider_alias;?>': {
					skin: '<?php echo $slider['skin'] ?>',
					skin_url: '<?php echo $skin_dir; ?>',
					size: {
						width: '<?php echo $slider['width'] ?>',
						height: '<?php echo $slider['height'] ?>'
					},
					actions: {},
					objects: {
						'<?php echo $slide_id;?>': <?php echo json_encode($slider['objects'][$slide_id]); ?>
					}
				}
			},
			custom_anims: <?php echo $slider['custom_animations'] ? json_encode($slider['custom_animations']) : '{}'; ?>
		}).get(0);
		
		$('#'+slider_id).azt_init({
			slide_id: '<?php echo $slide_id;?>',
			actions: {
				<?php 
				foreach($slider['actions'] as $sid => $act){
					echo '\''.$sid.'\':'.json_encode($slider['actions'][$sid]).',';
				}
				?>
			},
			custom_animations: <?php echo $slider['custom_animations'] ? json_encode($slider['custom_animations']) : '{}'; ?>
		});
		
	    load_film_easing_options('#glide-easing', '<?php echo $slider['glide_easing']; ?>' || slider.data.film_layout_easing);
	    load_film_animation_options('#glide-animation', '<?php echo $slider['glide_animation']; ?>'  || slider.data.film_layout_animation);
	});
	
    var aztp_css_editor = ace.edit("aztp_css");
    aztp_css_editor.setTheme("ace/theme/textmate");
    aztp_css_editor.getSession().setMode("ace/mode/less");
    
    var aztp_ds_editor = ace.edit("txt-ds-json");
    aztp_ds_editor.setTheme("ace/theme/textmate");
    aztp_ds_editor.getSession().setMode("ace/mode/json");
    
</script>
<?php
		break;
		
		case 'login':
		?>
<div class="row">
	<div class="large-4 columns">
	    <h1>Login</h1>
	    <form action="" method="post">
	        <label>
	            Username:
	            <input type="text" name="username">
	        </label>
	        <label>
	            Password:
	            <input type="password" name="password">
	        </label>
	        <button type="submit">Login</button>
	    </form>
	</div>
</div>
		<?php
		break;
		
	}
	?>
	<script>
	$(document).foundation({tab: {toggleable: false}});
	</script>
<body>
</html>
<?php

}else if($_GET['page'] == 'play'){

$slider_alias = $_GET['slider'];
$slider_data = get_slider_data($slider_alias);
?>

<!DOCTYPE html>
<head>
<title>AZ SLIDER - <?php echo $slider_alias; ?></title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta http-equiv="cleartype" content="on">
<link type="image/x-icon" href="favicon.png" rel="icon" />
<link rel="SHORTCUT ICON" href="favicon.png"/>
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320">
<meta name="viewport" content="width=device-width">

<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="js/az-slider.js"></script>
<script src="vendor/jquery.transit.js"></script>

<link href='<?php echo $slider_data['web_font_url']; ?>' rel='stylesheet' type='text/css'>
<style>
	body{
		margin: 0;
	}
	<?php echo $slider_data['css'];?>
</style>
</head>
<body>
	<div id="<?php echo $slider_alias;?>"></div>
	
	<br><br><br><br><br><br>
	<button id="back">Back</button>
	<button id="next">Next</button>
	<input type="checkbox" id="chk-autoplay"/> Autoplay
	<select id="select-wait-time" style="display: none">
		<option value="0">0ms</option>
		<option value="2000">2000ms</option>
		<option value="4000">4000ms</option>
		<option value="6000">6000ms</option>
		<option value="8000">8000ms</option>
		<option value="10000">10000ms</option>
	</select>
	
<script>
	var slider_id = '<?php echo $slider_alias;?>';
	$(function(){
		$('#'+slider_id).azslider_init({
			data: {
				'<?php echo $slider_alias;?>': {
					skin: '<?php echo $slider_data['skin'] ?>',
					skin_url: '<?php echo $skin_dir; ?>',
					slides_layout: '<?php echo $slider_data['frames_layout'] ?>',
					size: {
						width: '<?php echo $slider_data['width'] ?>',
						height: '<?php echo $slider_data['height'] ?>',
						wrapper_width: '<?php echo $slider_data['wwidth'] ?>'
					},
					actions: {
						<?php
						$i = 0;
						foreach($slider_data['actions'] as $slide_id => $actions){
							echo ($i > 0 ? ',' : '').'\''.$slide_id.'\': '.json_to_js_object(json_encode($actions));
							$i++;
						}
						?>
					},
					objects: {
						<?php
						$i = 0;
						foreach($slider_data['objects'] as $slide_id => $objects){
							echo ($i > 0 ? ',' : '').'\''.$slide_id.'\': '.json_to_js_object(json_encode($objects));
							$i++;
						}
						?>
						
					},
					datasource: <?php echo json_encode($slider_data['datasource']); ?>,
					autoplay: <?php echo $slider_data['autoplay'] == 1 ? 'true' : 'false'; ?>,
					autoplay_time: '<?php echo $slider_data['autoplay_time'] ?>',
					loop: <?php echo $slider_data['loop'] == 1 ? 'true' : 'false' ?>,
					is_nav_arrows: <?php echo $slider_data['nav_arrows'] == 1 ? 'true' : 'false'; ?>,
					is_nav_bullets: <?php echo $slider_data['nav_bullets'] == 1 ? 'true' : 'false'; ?>,
					is_nav_thumbs: <?php echo $slider_data['nav_thumbs'] == 1 ? 'true' : 'false'; ?>,
					slides_trans_ox: '<?php echo $slider_data['slides_trans_ox'] ?>',
					slides_trans_oy: '<?php echo $slider_data['slides_trans_oy'] ?>',
					slides_perspective: '<?php echo $slider_data['slides_perspective'] ?>'<?php if($slider_data['frames_layout'] == 'film') {?>,
					film_dir: '<?php echo empty($slider_data['film_dir']) ? 'horizontal' : $slider_data['film_dir'] ?>',
					film_layout_easing: '<?php echo $slider_data['glide_easing'] ?>',
					film_layout_duration: <?php echo $slider_data['glide_time'] ? $slider_data['glide_time'] : 3000; ?>,
					film_layout_animation: '<?php echo $slider_data['glide_animation'] ?>',
					film_layout_ratio: '<?php echo $slider_data['film_layout_ratio'] ?>',
					play_slide_when: '<?php echo $slider_data['play_slide_when'] ?>'
					<?php } ?>
					
				}
			},
			custom_anims: <?php echo json_to_js_object(json_encode($slider_data['custom_animations'])); ?>	
		});
		
		
		$('#next').click(function(){
			$('#'+slider_id).azslider_play('next', true);	
		});
		$('#back').click(function(){
			$('#'+slider_id).azslider_play('back', true);
		});
			
		$('#chk-autoplay').click(function(){
			if(this.checked){
				$('#select-wait-time').show();
				$('#'+slider_id).get(0).data.autoplay = true;
			}else{
				$('#select-wait-time').hide();
				$('#'+slider_id).get(0).data.autoplay = false;
			}
		});
		
		$('#select-wait-time').change(function(){
			$('#'+slider_id).get(0).data.autoplay_time = this.value;
		});
	});
</script>
</body>
</html>
<?php

}//end if page == play
else if($_GET['page'] == 'embed'){
	
header('X-XSS-Protection: 0');

if (get_magic_quotes_gpc ()) {
    function stripslashes_deep($value) {
        $value = is_array($value) ?
                array_map('stripslashes_deep', $value) :
                stripslashes($value);

        return $value;
    }

    $_POST = array_map('stripslashes_deep', $_POST);
    $_GET = array_map('stripslashes_deep', $_GET);
	$_REQUEST = array_map('stripslashes_deep', $_REQUEST);
}

if(isset($_POST['test'])){
	echo '<!DOCTYPE html><html><head>';
	echo $_POST['scripts'];
	echo $_POST['webfont'];
	echo $_POST['css'];
	echo '</head><body>';
	echo $_POST['html'];
	echo $_POST['init'];
	echo '</body></html>';
	die();
}else if(isset($_POST['download'])){
	$file = array();
	$file['alias'] = $_POST['slider_alias'];
	$file['name'] = $_POST['slider_name'];
	
	if(!empty($_POST['scripts'])){
		$file['scripts'] = $_POST['scripts'];
	}
	if(!empty($_POST['webfont'])){
		$file['webfont'] = $_POST['webfont'];
	}
	if(!empty($_POST['css'])){
		$file['css'] = $_POST['css'];
	}
	$file['html'] = $_POST['html'];
	$file['init'] = $_POST['init'];
	
	$json = json_encode($file);
	$size = strlen($json);
	$filename = $_POST['slider_alias'].'.json';
	
	header('Content-Description: File Transfer');
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename=' . $filename); 
	header('Content-Transfer-Encoding: binary');
	header('Connection: Keep-Alive');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Content-Length: ' . $size);
	
	echo $json;
	die();
}

$slider_alias = $_GET['slider'];
$slider_data = get_slider_data($slider_alias);

if(empty($slider_data)) die();
?>
<!DOCTYPE html>
<html>
<head>
	<title>Embed Code - <?php echo $slider_data['name'] ;?></title>
	<style type="text/css">
		textarea{
			width: 100%;
		}
	</style>
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>

<script src="vendor/jquery.transit.js"></script>
<script src="js/az-slider.js"></script>


</head>	
<body>
<form action="" method="post">
<h1>Embed Code - <?php echo $slider_data['name'] ;?> <span id="buttons" style="display: none;"><button type="submit" name="test">Test</button> <button type="submit" name="download">Download</button></span></h1>

<h3>SCRIPTS</h3>
<p>Place inside head tag</p>
<textarea style="height: 100px;" id="az-embed-scripts" name="scripts">
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="<?php echo $azslider_url; ?>vendor/jquery.transit.js"></script>
<script src="<?php echo $js_dir; ?>az-slider.min.js"></script>
</textarea>

<?php if(!empty($slider_data['web_font_url'])){ ?>
<h3>WEB FONT</h3>
<p>Place inside head tag</p>
<textarea style="height: 50px;" id="az-embed-webfont" name="webfont">
<link href="<?php echo $slider_data['web_font_url']; ?>" rel="stylesheet" type="text/css">
</textarea>
<?php } ?>

<?php if(!empty($slider_data['css'])){ ?>
<h3>CSS</h3>
<p>Place inside head tag</p>
<textarea style="height: 200px;" id="az-embed-css"  name="css">
<style type="text/css">
<?php echo $slider_data['css']; ?>

</style>
</textarea>

<?php } ?>


<h3>HTML</h3>
<p>Place inside body tag</p>
<textarea style="height: 300px;" id="az-embed-html" name="html">
<div id="<?php echo $slider_alias;?>">{{HTML}}</div>
</textarea>

<h3>INIT SCRIPT</h3>
<p>Place at the end of body tag</p>
<textarea style="height: 500px;" id="az-embed-init" name="init">
<script>
	(function($) {
		$('#<?php echo $slider_alias;?>').azslider_init({
			data: {
				'<?php echo $slider_alias;?>': {
					skin: '<?php echo $slider_data['skin'] ?>',
					skin_url: '<?php echo $skin_dir; ?>',
					slides_layout: '<?php echo $slider_data['frames_layout'] ?>',
					size: {
						width: '<?php echo $slider_data['width'] ?>',
						height: '<?php echo $slider_data['height'] ?>',
						wrapper_width: '<?php echo $slider_data['wwidth'] ?>'
					},
					actions: {
						<?php
						$i = 0;
						foreach($slider_data['actions'] as $slide_id => $actions){
							echo ($i > 0 ? ',' : '').'\''.$slide_id.'\': '.json_to_js_object(json_encode($actions));
							$i++;
						}
						?>
						
					},
					objects: {
						<?php
						$i = 0;
						foreach($slider_data['objects'] as $slide_id => $objects){
							echo ($i > 0 ? ',' : '').'\''.$slide_id.'\': '.json_to_js_object(json_encode($objects));
							$i++;
						}
						?>
						
					},
					datasource: <?php echo json_encode($slider_data['datasource']); ?>,
					autoplay: <?php echo $slider_data['autoplay'] == 1 ? 'true' : 'false'; ?>,
					autoplay_time: '<?php echo $slider_data['autoplay_time'] ?>',
					loop: <?php echo $slider_data['loop'] == 1 ? 'true' : 'false' ?>,
					is_seo: <?php echo $slider_data['seo'] == 1 ? 'true' : 'false'; ?>,
					is_nav_arrows: <?php echo $slider_data['nav_arrows'] == 1 ? 'true' : 'false'; ?>,
					is_nav_bullets: <?php echo $slider_data['nav_bullets'] == 1 ? 'true' : 'false'; ?>,
					is_nav_thumbs: <?php echo $slider_data['nav_thumbs'] == 1 ? 'true' : 'false'; ?>,
					slides_trans_ox: '<?php echo $slider_data['slides_trans_ox'] ?>',
					slides_trans_oy: '<?php echo $slider_data['slides_trans_oy'] ?>',
					slides_perspective: '<?php echo $slider_data['slides_perspective'] ?>'<?php if($slider_data['frames_layout'] == 'film') {?>,
					film_dir: '<?php echo empty($slider_data['film_dir']) ? 'horizontal' : $slider_data['film_dir'] ?>',
					film_layout_easing: '<?php echo $slider_data['glide_easing'] ?>',
					film_layout_duration: <?php echo $slider_data['glide_time'] ? $slider_data['glide_time'] : 3000; ?>,
					film_layout_animation: '<?php echo $slider_data['glide_animation'] ?>',
					film_layout_ratio: '<?php echo $slider_data['film_layout_ratio'] ?>',
					film_length: '<?php echo $slider_data['film_length'] ?>',
					play_slide_when: '<?php echo $slider_data['play_slide_when'] ?>'
					<?php } ?>
					
				}
			},
			custom_anims: <?php echo json_to_js_object(json_encode($slider_data['custom_animations'])); ?>	
		});
	})(jQuery);
</script>
</textarea>
<br><br><br><br>
<input type="hidden" name="slider_alias" value="<?php echo $slider_alias;?>" />
<input type="hidden" name="slider_name" value="<?php echo $slider_data['name'];?>" />
</form>

<div style="display: none">
<div id="<?php echo $slider_alias;?>"></div>
</div>
<script>
		
	$(function(){
		var is_seo = <?php echo $slider_data['seo'] == 1 ? 'true' : 'false'; ?>;
		$('#<?php echo $slider_alias;?>').azslider_init({
			data: {
				'<?php echo $slider_alias;?>': {
					skin: '<?php echo $slider_data['skin'] ?>',
					skin_url: '<?php echo $skin_dir; ?>',
					slides_layout: '<?php echo $slider_data['frames_layout'] ?>',
					size: {
						width: '<?php echo $slider_data['width'] ?>',
						height: '<?php echo $slider_data['height'] ?>',
						wrapper_width: '<?php echo $slider_data['wwidth'] ?>'
					},
					actions: {
						<?php
						$i = 0;
						foreach($slider_data['actions'] as $slide_id => $actions){
							echo ($i > 0 ? ',' : '').'\''.$slide_id.'\': '.json_to_js_object(json_encode($actions));
							$i++;
						}
						?>
						
					},
					objects: {
						<?php
						$i = 0;
						foreach($slider_data['objects'] as $slide_id => $objects){
							echo ($i > 0 ? ',' : '').'\''.$slide_id.'\': '.json_to_js_object(json_encode($objects));
							$i++;
						}
						?>
						
					},
					datasource: <?php echo json_encode($slider_data['datasource']); ?>,
					autoplay: <?php echo $slider_data['autoplay'] == 1 ? 'true' : 'false'; ?>,
					autoplay_time: '<?php echo $slider_data['autoplay_time'] ?>',
					loop: <?php echo $slider_data['loop'] == 1 ? 'true' : 'false' ?>,
					is_nav_arrows: <?php echo $slider_data['nav_arrows'] == 1 ? 'true' : 'false'; ?>,
					is_nav_bullets: <?php echo $slider_data['nav_bullets'] == 1 ? 'true' : 'false'; ?>,
					is_nav_thumbs: <?php echo $slider_data['nav_thumbs'] == 1 ? 'true' : 'false'; ?>,
					slides_trans_ox: '<?php echo $slider_data['slides_trans_ox'] ?>',
					slides_trans_oy: '<?php echo $slider_data['slides_trans_oy'] ?>',
					slides_perspective: '<?php echo $slider_data['slides_perspective'] ?>',<?php if($slider_data['frames_layout'] == 'film') {?>
					film_dir: '<?php echo empty($slider_data['film_dir']) ? 'horizontal' : $slider_data['film_dir'] ?>',
					film_layout_easing: '<?php echo $slider_data['glide_easing'] ?>',
					film_layout_duration: <?php echo $slider_data['glide_time'] ? $slider_data['glide_time'] : 3000; ?>,
					film_layout_animation: '<?php echo $slider_data['glide_animation'] ?>',
					film_layout_ratio: '<?php echo $slider_data['film_layout_ratio'] ?>',
					film_length: '<?php echo $slider_data['film_length'] ?>',
					play_slide_when: '<?php echo $slider_data['play_slide_when'] ?>',
					<?php } ?>
					
					after_init: function(html){
						if(!is_seo) html = '';
						var new_html = $('#az-embed-html').val().replace('{{HTML}}', html);
						$('#az-embed-html').val(new_html);
					}
				}
			},
			custom_anims: <?php echo json_to_js_object(json_encode($slider_data['custom_animations'])); ?>	
		});
		
		
		$('#buttons').show();
	});
</script>
</body>
</html>
<?php

}//end page == embed
else if($_GET['page'] == 'save'){
	
	$act = $_REQUEST['act'];
	
	if($act == 'create_slider'){
		
		$data['name'] = $_REQUEST['name'];
		$data['alias'] = $_REQUEST['alias'];
		$data['width'] = $_REQUEST['width'];
		$data['wwidth'] = $_REQUEST['width'];
		$data['height'] = $_REQUEST['height'];
		$data['frames_layout'] = $_REQUEST['frames_layout'];
		
		if(empty($data['name'])) die('Error: Name is empty');
		if(empty($data['alias'])) die('Error: Alias is empty');
		if(empty($data['width'])) die('Error: Width is empty');
		if(empty($data['height'])) die('Error: Height is empty');
		
		if(is_slider_existed($data['alias'])) die('Error: Slider existed');
		
		// Default data for first slide
		$data['actions'] = array(
			"slide-1" => $default_actions[$data['frames_layout']]
		);
		
		$data['skin'] = 'classic';
		$data['glide_easing'] = 'easeOutQuad';
		$data['glide_time'] = 1000;
		$data['glide_animation'] = 'none';
		$data['film_layout_ratio'] = 1;
		$data['film_dir'] = 'horizontal';
		//$data['film_length'] = '100%';
		//$data['slides_partial'] = 1;
		
		$data['slides_trans_ox'] = '50%';
		$data['slides_trans_oy'] = '50%';
		$data['slides_perspective'] = '100em';
		
		$data['autoplay_time'] = 3000;
		
		$data['objects'] = array();
		$data['custom_animations'] = array();
		
		save_slider($data);
		
		header('Location: ?page=sliders');
		
	}else if($act == 'delete_slider'){
		$slider = $_REQUEST['slider'];
		if(empty($slider) or is_slider_existed($slider) == false) die('Error: Slider not found');
		delete_slider($slider);
		
		header('Location: ?page=sliders');
	}else if($act == 'save_slide'){
		$slider = $_POST['slider'];
		$slide_id = $_POST['slide_id'];
		
		if(empty($slider)) die('Error: Slider not found');
		if(empty($slide_id)) die('Error: Slide ID empty');
		
		$actions = json_decode($_POST['actions'], true);
		$objects = json_decode($_POST['objects'], true);
		$custom_animations = json_decode($_POST['custom_animations'], true);
		$ds = json_decode($_POST['ds']);
		$ds_type = $_POST['ds_type'];
		$less = $_POST['less'];
		$css = $_POST['css'];
		if($ds == null) $ds = '';
		
		$slider_data = get_slider_data($slider);
		
		$slider_data['actions'][$slide_id] = $actions;
		$slider_data['objects'][$slide_id] = $objects;
		$slider_data['custom_animations'] = $custom_animations;
		$slider_data['datasource']['type'] = $ds_type;
		$slider_data['datasource']['data'] = $ds;
		$slider_data['less'] = $less;
		$slider_data['css'] = $css;
		
		save_slider_data($slider, $slider_data);
	}else if($act == 'save_slides_order'){
		$slider = $_POST['slider'];	
		if(empty($slider)) die('Error: Slider not found');
		
		$slide_ids = json_decode($_POST['slide_ids'], true);
		$slider_data = get_slider_data($slider);
		$actions = array();
		$objects = array();
		
		foreach($slide_ids as $slide_id){
			$actions[$slide_id] = $slider_data['actions'][$slide_id];
			$objects[$slide_id] = $slider_data['objects'][$slide_id];
		}
		
		$slider_data['actions'] = $actions;
		$slider_data['objects'] = $objects;
		
		save_slider_data($slider, $slider_data);
		
	}else if($act == 'save_slider_settings'){
		$slider = $_POST['slider'];
		$slide_id = $_POST['slide_id'];
		
		if(empty($slider)) die('Error: Slider not found');
		if(empty($slide_id)) die('Error: Slide ID empty');
		
		$slider_data = get_slider_data($slider);
		
		$slider_data['wwidth'] = $_POST['wwidth'];
		
		$slider_data['skin'] = $_POST['slider_skins'];
		
		$slider_data['frames_layout'] = $_POST['frames_layout'];
		$slider_data['seo'] = $_POST['slider_seo'];
		
		$slider_data['web_font_url'] = $_POST['web_font_url'];
		
		$slider_data['autoplay'] = $_POST['autoplay'];
		$slider_data['autoplay_time'] = $_POST['autoplay_time'];
		
		$slider_data['loop'] = $_POST['loop'];
		
		$slider_data['nav_arrows'] = $_POST['nav_arrows'];
		$slider_data['nav_bullets'] = $_POST['nav_bullets'];
		$slider_data['nav_thumbs'] = $_POST['nav_thumbs'];
		
		$slider_data['glide_easing'] = $_POST['glide_easing'];
		$slider_data['glide_time'] = $_POST['glide_time'];
		$slider_data['glide_animation'] = $_POST['glide_animation'];
		$slider_data['film_layout_ratio'] = $_POST['film_layout_ratio'];
		$slider_data['film_dir'] = $_POST['film_dir'];
		//$slider_data['film_length'] = $_POST['film_length'];
		
		//$slider_data['slides_partial'] = $_POST['slides_partial'];
		
		
		
		$slider_data['slides_trans_ox'] = $_POST['slides_trans_ox'];
		$slider_data['slides_trans_oy'] = $_POST['slides_trans_oy'];
		$slider_data['slides_perspective'] = $_POST['slides_perspective'];
		
		$slider_data['play_slide_when'] = $_POST['play_slide_when'];
		
		save_slider_data($slider, $slider_data);
		header('Location: ?page=slides&slider='.$slider.'&slide_id='.$slide_id);
	}else if($act == 'upload_image'){	
		$data = array();
		$error = false;
		
		foreach($_FILES as $file){
			if(!file_exists($upload_dir)){
				mkdir($upload_dir, 0777);
			}
			
			$file_name = md5(time()).basename($file['name']);
		
			if(move_uploaded_file($file['tmp_name'], $upload_dir.$file_name)){
				$data['url'] = $upload_url.$file_name;
			}else{
				$data['error'] = 'Cannot upload file';
			}
			break;
		}
		
		echo json_encode($data);
	}else if($act == 'add_new_slide'){
	
		$slider = $_REQUEST['slider'];
		$slide_id = $_REQUEST['slide_id'];
		$template = $_REQUEST['template'];
		
		if(empty($slider)) die('Error: Slider not found');
		if(empty($slide_id)) die('Error: Slide ID empty');
		
		$slider_data = get_slider_data($slider);
		
		if(isset($slider_data['objects'][$slide_id]) || isset($slider_data['actions'][$slide_id])){
			die('Error: Slide ID Existed!');
		}
		
		$slider_data['objects'][$slide_id] = array();
		$slider_data['actions'][$slide_id] = $default_actions[$slider_data['frames_layout']];
		
		save_slider_data($slider, $slider_data);
		
		header('Location: ?page=slides&slider='.$slider.'&slide_id='.$slide_id);
	}else if($act == 'duplicate_slide'){
		$slider = $_REQUEST['slider'];
		$slide_id = $_REQUEST['slide_id'];
		$new_slide_id = $_REQUEST['new_slide_id'];
		
		if(empty($slider)) die('Error: Slider not found');
		if(empty($slide_id)) die('Error: Slide ID empty');
		if(empty($new_slide_id)) die('Error: New Slide ID empty');
		
		$slider_data = get_slider_data($slider);
		
		if(isset($slider_data['objects'][$new_slide_id]) || isset($slider_data['actions'][$new_slide_id])){
			die('Error: New Slide ID Existed!');
		}
		
		$slider_data['objects'][$new_slide_id] = $slider_data['objects'][$slide_id];
		$slider_data['actions'][$new_slide_id] = $slider_data['actions'][$slide_id];
		
		save_slider_data($slider, $slider_data);
		
		header('Location: ?page=slides&slider='.$slider.'&slide_id='.$new_slide_id);
		
	}else if($act == 'remove_slide'){
	
		$slider = $_REQUEST['slider'];
		$slide_id = $_REQUEST['slide_id'];
		
		if(empty($slider)) die('Error: Slider not found');
		if(empty($slide_id)) die('Error: Slide ID empty');
		
		$slider_data = get_slider_data($slider);
		
		unset($slider_data['objects'][$slide_id]);
		unset($slider_data['actions'][$slide_id]);
		
		save_slider_data($slider, $slider_data);
		
		header('Location: ?page=slides&slider='.$slider);
	}
}

/*!
 * AZSlider Tools
 * http://simplezt.com/azslider/
 *
 *
 * Copyright 2015 Simplezt
 */

(function($) {

	$.md5_checksum = '';
	
	// current slider context
	$.ctx = null;
	
	// current slide id in editor
	$.azt_slide_id = null;
	
	// number of slide action
	$.azt_slide_action_n = 0;
	$.azt_slide_action_cmd_n = 0;
	$.azt_custom_anim_n = 0;
	$.azt_custom_anim_type_n = 0;
	
	$.azt_object_selector_n = 0;
	$.azt_object_action_n = 0;
	$.azt_object_action_cmd_n = 0;
	
	$.fn.check_image_size = function(opts){
		var _URL = window.URL || window.webkitURL;
		return this.each(function(){
			$(this).change(function(e) {
			
				if(opts.type == "file_upload"){
					var image, file;
					if ((file = this.files[0])) {
						image = new Image();
						image.onload = function() {
							var sw = parseInt($.ctx.data.size.width, 10);
							var sh = parseInt($.ctx.data.size.height, 10); 
							var em_w, em_h;
							if(this.width >= sw && this.width >= this.height){
								em_w = $.az.px2em3(sw, $.ctx);
								em_h = '';
							}else if(this.width < sw && this.height < sh){
								em_w = $.az.px2em3(this.width, $.ctx);
								em_h = $.az.px2em3(this.height, $.ctx);
							}else if(this.width < sw && this.height > sh){
								em_w = ''
								em_h = $.az.px2em3(sh, $.ctx);
							}else{
								em_w = $.az.px2em3(this.width, $.ctx);
								em_h = $.az.px2em3(this.height, $.ctx);
							}
							
							$(opts.em_w).val(em_w);
							$(opts.em_h).val(em_h);
						
							$(opts.info).html('<ul><li>Image Width: ' + this.width + 'px</li><li>Image Height: ' + this.height + 'px</li><li>Slider Width: '+$.ctx.data.size.width+'</li><li>Slider Height: '+$.ctx.data.size.height+'</li></ul>');
							this.width = 250;
							$(opts.info).append(image);
							$(opts.pnl_info).show();
							image = null;
						};
						$(opts.info).html('Loading...');
						image.src = _URL.createObjectURL(file);
					}else{
						$(opts.pnl_info).hide();
					}
				}else if(opts.type == "file_url"){
					var image, file;
					image = new Image();
					image.onload = function() {
						var sw = parseInt($.ctx.data.size.width, 10);
						var sh = parseInt($.ctx.data.size.height, 10); 
						var em_w, em_h;
						if(this.width >= sw && this.width >= this.height){
							em_w = $.az.px2em3(sw, $.ctx);
							em_h = '';
						}else if(this.width < sw && this.height < sh){
							em_w = $.az.px2em3(this.width, $.ctx);
							em_h = $.az.px2em3(this.height, $.ctx);
						}else if(this.width < sw && this.height > sh){
							em_w = ''
							em_h = $.az.px2em3(sh, $.ctx);
						}else{
							em_w = $.az.px2em3(this.width, $.ctx);
							em_h = $.az.px2em3(this.height, $.ctx);
						}
						
						$(opts.em_w).val(em_w);
						$(opts.em_h).val(em_h);
						
						$(opts.info).html('<ul><li>Image Width: ' + this.width + 'px</li><li>Image Height: ' + this.height + 'px</li><li>Slider Width: '+$.ctx.data.size.width+'</li><li>Slider Height: '+$.ctx.data.size.height+'</li></ul>');
						this.width = 250;
						$(opts.info).append(image);
						$(opts.pnl_info).show();
						image = null;
					};
					
					$(opts.info).html('Loading...');
					$(opts.pnl_info).show();
					image.src = $(this).val();
				}
			});
			return this;
		});
	};
	
	$.azt_set_xy = function(value){
		if($.ctx.$selected_object == null || $.ctx.$selected_object.get(0) == null){
			alert('Select an object first');
			return;
		}
		var type = $.ctx.$selected_object.data('type'), v;
		
		if(value == 'zero'){
			if(type == 'text'){
				$('#aztp_text_left').val(0);
				$('#aztp_text_top').val(0);
				$('#aztp_text_left').keyup();
				$('#aztp_text_top').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_left').val(0);
				$('#aztp_wimage_top').val(0);
				$('#aztp_wimage_left').keyup();
				$('#aztp_wimage_top').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_left').val(0);
				$('#aztp_wbg_top').val(0);
				$('#aztp_wbg_left').keyup();
				$('#aztp_wbg_top').keyup();
			}else if(type == 'video'){
				$('#aztp_video_left').val(0);
				$('#aztp_video_top').val(0);
				$('#aztp_video_left').keyup();
				$('#aztp_video_top').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_left').val(0);
				$('#aztp_iframe_top').val(0);
				$('#aztp_iframe_left').keyup();
				$('#aztp_iframe_top').keyup();
			}else if(type == 'html'){
				$('#aztp_html_left').val(0);
				$('#aztp_html_top').val(0);
				$('#aztp_html_left').keyup();
				$('#aztp_html_top').keyup();
			}
		}else if(value == 'left'){
			if(type == 'text'){
				$('#aztp_text_left').val(0);
				$('#aztp_text_left').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_left').val(0);
				$('#aztp_wimage_left').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_left').val(0);
				$('#aztp_wbg_left').keyup();
			}else if(type == 'video'){
				$('#aztp_video_left').val(0);
				$('#aztp_video_left').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_left').val(0);
				$('#aztp_iframe_left').keyup();
			}else if(type == 'html'){
				$('#aztp_html_left').val(0);
				$('#aztp_html_left').keyup();
			}
		}else if(value == 'right'){	
			v = parseInt($.ctx.$selected_object.outerWidth(), 10);
			v = parseInt($.ctx.data.size.width, 10) - v;
			v = $.az.px2em(v, $.ctx);
		
			if(type == 'text'){
				$('#aztp_text_left').val(v);
				$('#aztp_text_left').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_left').val(v);
				$('#aztp_wimage_left').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_left').val(v);
				$('#aztp_wbg_left').keyup();
			}else if(type == 'video'){
				$('#aztp_video_left').val(v);
				$('#aztp_video_left').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_left').val(v);
				$('#aztp_iframe_left').keyup();
			}else if(type == 'html'){
				$('#aztp_html_left').val(v);
				$('#aztp_html_left').keyup();
			}
		}else if(value == 'top'){
			if(type == 'text'){
				$('#aztp_text_top').val(0);
				$('#aztp_text_top').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_top').val(0);
				$('#aztp_wimage_top').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_top').val(0);
				$('#aztp_wbg_top').keyup();
			}else if(type == 'video'){
				$('#aztp_video_top').val(0);
				$('#aztp_video_top').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_top').val(0);
				$('#aztp_iframe_top').keyup();
			}else if(type == 'html'){
				$('#aztp_html_top').val(0);
				$('#aztp_html_top').keyup();
			}
		}else if(value == 'bottom'){
			v = parseInt($.ctx.$selected_object.outerHeight(), 10);
			v = parseInt($.ctx.data.size.height, 10) - v;
			v = $.az.px2em(v, $.ctx);
			
			if(type == 'text'){
				$('#aztp_text_top').val(v);
				$('#aztp_text_top').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_top').val(v);
				$('#aztp_wimage_top').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_top').val(v);
				$('#aztp_wbg_top').keyup();
			}else if(type == 'video'){
				$('#aztp_video_top').val(v);
				$('#aztp_video_top').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_top').val(v);
				$('#aztp_iframe_top').keyup();
			}else if(type == 'html'){
				$('#aztp_html_top').val(v);
				$('#aztp_html_top').keyup();
			}
		}else if(value == 'x-center'){
			v = parseInt($.ctx.$selected_object.outerWidth(), 10);
			v = (parseInt($.ctx.data.size.width, 10) - v) / 2;
			v = $.az.px2em(v, $.ctx);
			
			if(type == 'text'){
				$('#aztp_text_left').val(v);
				$('#aztp_text_left').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_left').val(v);
				$('#aztp_wimage_left').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_left').val(v);
				$('#aztp_wbg_left').keyup();
			}else if(type == 'video'){
				$('#aztp_video_left').val(v);
				$('#aztp_video_left').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_left').val(v);
				$('#aztp_iframe_left').keyup();
			}else if(type == 'html'){
				$('#aztp_html_left').val(v);
				$('#aztp_html_left').keyup();
			}
		}else if(value == 'y-center'){
			v = parseInt($.ctx.$selected_object.outerHeight(), 10);
			v = (parseInt($.ctx.data.size.height, 10) - v) / 2;
			v = $.az.px2em(v, $.ctx);
			
			if(type == 'text'){
				$('#aztp_text_top').val(v);
				$('#aztp_text_top').keyup();
			}else if(type == 'image'){
				$('#aztp_wimage_top').val(v);
				$('#aztp_wimage_top').keyup();
			}else if(type == 'bg'){
				$('#aztp_wbg_top').val(v);
				$('#aztp_wbg_top').keyup();
			}else if(type == 'video'){
				$('#aztp_video_top').val(v);
				$('#aztp_video_top').keyup();
			}else if(type == 'iframe'){
				$('#aztp_iframe_top').val(v);
				$('#aztp_iframe_top').keyup();
			}else if(type == 'html'){
				$('#aztp_html_top').val(v);
				$('#aztp_html_top').keyup();
			}
		}
	};
	
	$.azt_add_tooltip = function(text){
		// Create new data for text object
		var data = {
			type: 'tooltip',
			text: text,
			top: '30em',
			left: '30em'
		};
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_tooltip(data, $.ctx.$frames, $.ctx, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	};
	
	// Add new text object into slide
	$.azt_add_text = function(text, top, left, bgcolor){
		// Create new data for text object
		var data = {
			type: 'text',
			text: text,
			top: top,
			left: left,
			bgcolor: bgcolor
		};
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_text(data, $.ctx.$frames, $.ctx, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	};
	
	$.azt_add_bg = function(url, ww, wh, iw, ih, cols, rows, bg_mode){

		// Create new data for text object
		var data = {
			type: 'bg',
			url: url,
			'w-width': ww,
			'w-height': wh,
			'i-width': iw,
			'i-height': ih,
			'cols': cols,
			'rows': rows,
			'mode': bg_mode,
			'gs': ''
		};
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_bg(data, $.ctx.$frames, $.ctx, true, null, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	};
	
	// Add new image object into slide
	$.azt_add_image = function(url, ww, wh, iw, ih){

		// Create new data for text object
		var data = {
			type: 'image',
			url: url,
			'w-width': ww,
			'w-height': wh,
			'i-width': iw,
			'i-height': ih
		};
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_image(data, $.ctx.$frames, $.ctx, true, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	};
	
	$.azt_add_video = function(url, w, h, autoplay, controls, loop, muted, preload){
		var data = {
			type: 'video',
			url: url,
			'width': w,
			'height': h,
			'autoplay': autoplay,
			'controls': controls,
			'loop': loop,
			'muted': muted,
			'preload': preload
		};
		
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_video(data, $.ctx.$frames, $.ctx, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	};
	
	$.azt_add_html = function(html){
		var data = {
			type: 'html',
			html: html
		};
		
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_html(data, $.ctx.$frames, $.ctx, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	}
	
	$.azt_add_iframe = function(url, attrs, width, height){
		var data = {
			type: 'iframe',
			url: url,
			attrs: attrs,
			width: width,
			height: height
		};
		
		if($.ctx.data.objects[$.azt_slide_id] == null){
			$.ctx.data.objects[$.azt_slide_id] = []
		}
		$.ctx.data.objects[$.azt_slide_id].push(data);
		
		// Add new text into slide
		$.ctx.$selected_object = $.az.add_iframe(data, $.ctx.$frames, $.ctx, true);
		$.ctx.$selected_object.click();
		
		$.azt_make_list_of_objects();
	}
	
	/*
	
									<option value="reset-all">Reset All Objects State</option>\
									<option value="reset-all-after-anim">Reset All Objects State After Animating</option>\
									<option value="reset-all-when-finish">Reset All Objects State of Previous Slide When Current Slide Finish</option>\
	*/
	$.azt_add_slide_action = function(name){
		var num = $.azt_slide_action_n;
		
		var html = '<div class="row slide-action" id="slide-action-{{n}}" data-type="action">\
					<div class="large-2 columns">\
						<label>Action Name\
							<input type="text" id="slide-action-name-{{n}}" value="'+name+'" name="action-name">\
						</label>\
						<button class="tiny alert" type="button" onclick="$(\'#slide-action-{{n}}\').remove();">Delete</button>\
					</div>\
					<div class="large-10 columns">\
						<div class="commands" id="slide-cmds-holder-{{n}}">\
							\
						</div>\
						<div class="row">\
							<div class="large-6 columns"><br>\
								<select id="slide-cmds-{{n}}">\
									<option value="">-- Select Command --</option>\
									<option value="bring-to-front">Bring Slide To Front</option>\
									<option value="send-to-back">Send Slide To Back</option>\
									<option value="prepare">Prepare Objects</option>\
									<option value="play-anim">Play an Animation</option>\
									<option value="play-action">Play an Action of Object(s)</option>\
									<option value="play-action-after-anim">Play an Action of Object(s) After Animating</option>\
									<option value="next-frame">Play Next Slide</option>\
									<option value="next-frame-after-anim">Play Next Slide After Animating</option>\
									<option value="enable-parallax">Enable Parallax</option>\
									<option value="disable-parallax">Disable Parallax</option>\
								</select>\
							</div>\
							<div class="large-6 columns"><br>\
								<button type="button" class="tiny" id="slide-btn-add-cmd-{{n}}">Add Command</button>\
							</div>\
						</div>\
					</div>\
				</div>';
		html = html.replace(/\{\{n\}\}/g, num);
		
		$('#slide-actions-holder').append(html);
		
		$('#slide-btn-add-cmd-'+num).click(function(){
			$.azt_add_slide_action_cmd(num, '', {});
		});
		
		$.azt_slide_action_n++;
		
		return $.azt_slide_action_n - 1;
	};
	
	$.azt_add_slide_action_cmd = function(num, cmd_type, data){
		if(!cmd_type) cmd_type = $('#slide-cmds-' + num).val();
		var m = $.azt_slide_action_cmd_n;
		
		if(cmd_type == ''){
			alert('Select a Command');
			return;
		}
		var $cmds_holder = $('#slide-cmds-holder-'+ num);
		
		if(cmd_type == 'bring-to-front'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Bring Slide To Front" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'send-to-back'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Send Slide To Back" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'prepare'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Prepare Objects" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target ? data.target : '')+'" name="target" title="CSS Selector of Object(s) or objects for all"></label></div>\
			<div class="large-4 columns"><label>Action of Target: <input type="text" value="'+(data.action ? data.action : '')+'" name="action" title="Leave it blank to use the same action of slide"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-anim'){
			var anim_opts = $.azt_get_animation_names({
				mode: 'options',
				selected: data
			});
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play an Animation" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="slide" disabled></label></div>\
			<div class="large-4 columns"><label>Animation Name: <select name="animation-name">'+anim_opts+'</select></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-action'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play an Action of Object(s)" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="objects" disabled></label></div>\
			<div class="large-4 columns"><label>Action of Target: <input type="text" value="'+(data.action ? data.action : '')+'" name="action" title="Leave it blank to use the same action of slide"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-action-after-anim'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play an Action of Object(s) After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="objects" disabled></label></div>\
			<div class="large-4 columns"><label>Action of Target: <input type="text" value="'+(data.action ? data.action : '')+'" name="action" title="Leave it blank to use the same action of slide"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'next-frame'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Play Next Slide" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'next-frame-after-anim'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Play Next Slide After Animating" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'reset-all'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Reset All Objects State" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'reset-all-after-anim'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Reset All Objects State After Animating" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'reset-all-when-finish'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Reset All Objects State of Previous Slide When Current Slide Finish" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'enable-parallax'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Enable Parallax" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'disable-parallax'){
			$cmds_holder.append('<div id="slide-cmd-'+num+'-'+m+'" class="scmd" data-type="'+cmd_type+'">\
			<label>Command: <input type="text" value="Disable Parallax" disabled></label><button class="tiny alert" type="button" onclick="$(\'#slide-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}
		
		$.azt_slide_action_cmd_n++;
		$('#slide-cmds-' + num).val('');
	};
	
	$.collect_slide_actions_data = function(){
		var $slide_actions = $('div.row.slide-action').filter(function() { 
			return $(this).data('type') == 'action';
		});
		
		var slide_actions = {};
		
		$slide_actions.each(function(){
			var $this = $(this);
			var action_name = $this.find('input[name="action-name"]').val();
			$actions = $this.find('div.commands > div.scmd');
			
			slide_actions[action_name] = {};
			slide_actions[action_name]['commands'] = [];
			
			$actions.each(function(){
				var $this_ = $(this);
				var type = $this_.data('type');
				var data = null;
				var tmp = null;
				
				data = {};	
				data.cmd = type;
				
				if(type == 'bring-to-front'){
					
				}else if(type == 'send-to-back'){
					
				}else if(type == 'prepare'){
					data.target = $this_.find('input[name="target"]').val();
					tmp = $this_.find('input[name="action"]').val();
					if(tmp.length > 0) data.action = tmp;
				}else if(type == 'play-action'){
					data.target = 'objects';
					tmp = $this_.find('input[name="action"]').val();
					if(tmp.length > 0) data.action = tmp;
				}else if(type == 'play-anim'){
					data = $this_.find('select[name="animation-name"]').val()
				}else if(type == 'play-action-after-anim'){
					data.target = 'objects';
					tmp = $this_.find('input[name="action"]').val();
					if(tmp.length > 0) data.action = tmp;
				}else if(type == 'next-frame'){
					
				}else if(type == 'reset-all'){
					
				}else if(type == 'reset-all-after-anim'){
					
				}else if(type == 'reset-all-when-finish'){
					
				}
				
				slide_actions[action_name]['commands'].push(data);
			});	
		});
		
		return slide_actions;
	};
	
	$.azt_add_custom_anim = function(anim_name){
		var num = $.azt_custom_anim_n;
		
		var html = '<div class="row anim" data-type="anim" id="custom-anim-{{n}}">\
					<div class="large-2 columns">\
						<label>Animation Name\
							<input type="text" id="slide-anim-name-{{n}}" value="'+anim_name+'" name="anim-name">\
						</label>\
						<button class="tiny alert" type="button" onclick="$(\'#custom-anim-{{n}}\').remove();">Delete</button>\
					</div>\
					<div class="large-10 columns">\
						<div class="types" id="anim-types-holder-{{n}}">\
							\
						</div>\
						<div class="row">\
							<div class="large-6 columns"><br>\
								<select id="anim-types-{{n}}">\
									<option value="">-- Select Type --</option>\
									<option value="move">Move</option>\
									<option value="fade">Fade</option>\
									<option value="width">Width</option>\
									<option value="height">Height</option>\
									<option value="scale">Scale</option>\
									<option value="skew">Skew</option>\
									<option value="rotate">Rotate</option>\
									<option value="rotateX">RotateX</option>\
									<option value="rotateY">RotateY</option>\
								</select>\
							</div>\
							<div class="large-6 columns"><br>\
								<button type="button" class="tiny" id="anim-btn-add-type-{{n}}">Add Type</button>\
							</div>\
						</div>\
					</div>\
				</div>';
		
		html = html.replace(/\{\{n\}\}/g, num);
		
		$('#custom-anims-holder').append(html);
		
		$('#anim-btn-add-type-'+num).click(function(){
			$.azt_add_custom_anim_type(num, '', {});
		});
		
		$.azt_custom_anim_n++;
		
		return $.azt_custom_anim_n-1;
	};
	
	$.azt_add_custom_anim_type = function(num, anim_type, data){
		if(!anim_type) anim_type = $('#anim-types-' + num).val();
		var m = $.azt_custom_anim_type_n;
		
		if(anim_type == ''){
			alert('Select Animation Type');
			return;
		}
		var $types_holder = $('#anim-types-holder-'+ num);
		
		if(anim_type == 'move'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Move" disabled name="type"></label></div>\
				<div class="large-2 columns"><label>From X: <input type="text" value="'+(data.from_x ? data.from_x : '')+'" title="" name="from_x"></label></div>\
				<div class="large-2 columns"><label>From Y: <input type="text" value="'+(data.from_y ? data.from_y : '')+'" title="" name="from_y"></label></div>\
				<div class="large-2 columns"><label>To X: <input type="text" value="'+(data.x ? data.x : '')+'"  name="x" title="Relative value of left position"></label></div>\
				<div class="large-2 columns"><label>To Y: <input type="text" value="'+(data.y ? data.y : '')+'"  name="y" title="Relative value of top position"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'fade'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Fade" disabled name="type"></label></div>\
				<div class="large-4 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" title="Value from 0-1. (Ex: 0.5)" name="from"></label></div>\
				<div class="large-4 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" title="Value from 0-1. (Ex: 1)" name="to"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'width'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Width" disabled name="type"></label></div>\
				<div class="large-4 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" name="from"></label></div>\
				<div class="large-4 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" name="to"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'height'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Height" disabled name="type"></label></div>\
				<div class="large-4 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" name="from"></label></div>\
				<div class="large-4 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" name="to"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'scale'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Scale" disabled name="type"></label></div>\
				<div class="large-4 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" name="from"></label></div>\
				<div class="large-4 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" name="to"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'rotate'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Rotate" disabled name="type"></label></div>\
				<div class="large-4 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" name="from"></label></div>\
				<div class="large-4 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" name="to"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'skew'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="Skew" disabled name="type"></label></div>\
				<div class="large-2 columns"><label>From X: <input type="text" value="'+(data.from_x ? data.from_x : '')+'" title="" name="from_x"></label></div>\
				<div class="large-2 columns"><label>From Y: <input type="text" value="'+(data.from_y ? data.from_y : '')+'" title="" name="from_y"></label></div>\
				<div class="large-2 columns"><label>To X: <input type="text" value="'+(data.x ? data.x : '')+'"  name="x"></label></div>\
				<div class="large-2 columns"><label>To Y: <input type="text" value="'+(data.y ? data.y : '')+'"  name="y"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'rotateX'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="RotateX" disabled name="type"></label></div>\
				<div class="large-3 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" name="from"></label></div>\
				<div class="large-3 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" name="to"></label></div>\
				<div class="large-2 columns"><label>Perspective: <input type="text" value="'+(data.ppt ? data.ppt : '')+'" name="perspective"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(anim_type == 'rotateY'){
			$types_holder.append('<div id="anim-type-'+num+'-'+m+'" class="anim-type" data-type="'+anim_type+'"><div class="row">\
				<div class="large-4 columns"><label>Type: <input type="text" value="RotateY" disabled name="type"></label></div>\
				<div class="large-3 columns"><label>From: <input type="text" value="'+(data.from ? data.from : '')+'" name="from"></label></div>\
				<div class="large-3 columns"><label>To: <input type="text" value="'+(data.to ? data.to : '')+'" name="to"></label></div>\
				<div class="large-2 columns"><label>Perspective: <input type="text" value="'+(data.ppt ? data.ppt : '')+'" name="perspective"></label></div>\
			</div>\
			<div class="row">\
				<div class="large-4 columns"><label>Duration: <input type="text" value="'+(data.duration ? data.duration : '500')+'" title="Unit ms" name="duration"></label></div>\
				<div class="large-4 columns"><label>Delay: <input type="text" value="'+(data.delay ? data.delay : '')+'" title="Unit ms" name="delay"></label></div>\
				<div class="large-4 columns"><label>Easing: <select name="easing">'+$.azt_make_easing_options({selected: data.easing})+'</select></label></div>\
			</div><button class="tiny alert" type="button" onclick="$(\'#anim-type-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}
		
		$.azt_custom_anim_type_n++;
		$('#anim-types-' + num).val('');
	};
	
	$.collect_custom_anim_data = function(){
		var $anims = $('div.row.anim').filter(function() { 
			return $(this).data('type') == 'anim';
		});
		
		var custom_animations = {};
		
		$anims.each(function(){
			var $this = $(this);
			var anim_name = $this.find('input[name="anim-name"]').val();
			var $types = $this.find('div.types > .anim-type');
			
			custom_animations[anim_name] = [];
			
			$types.each(function(){
				var $this_ = $(this);
				var type = $this_.data('type');
				var data = null;
				var tmp = null;
				
				if(type == 'move'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from_x"]').val();
					if(tmp.length > 0) data.from_x = tmp;
					
					tmp = $this_.find('input[name="from_y"]').val();
					if(tmp.length > 0) data.from_y = tmp;
					
					tmp = $this_.find('input[name="x"]').val();
					if(tmp.length > 0) data.x = tmp;
					
					tmp = $this_.find('input[name="y"]').val();
					if(tmp.length > 0) data.y = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'fade'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'width'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'height'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'scale'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'rotate'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'skew'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from_x"]').val();
					if(tmp.length > 0) data.from_x = tmp;
					
					tmp = $this_.find('input[name="from_y"]').val();
					if(tmp.length > 0) data.from_y = tmp;
					
					tmp = $this_.find('input[name="x"]').val();
					if(tmp.length > 0) data.x = tmp;
					
					tmp = $this_.find('input[name="y"]').val();
					if(tmp.length > 0) data.y = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'rotateX'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="perspective"]').val();
					if(tmp.length > 0) data.ppt = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}else if(type == 'rotateY'){
					data = {};
					data.type = type;
					
					tmp = $this_.find('input[name="from"]').val();
					if(tmp.length > 0) data.from = tmp;
					
					tmp = $this_.find('input[name="to"]').val();
					if(tmp.length > 0) data.to = tmp;
					
					tmp = $this_.find('input[name="perspective"]').val();
					if(tmp.length > 0) data.ppt = tmp;
					
					tmp = $this_.find('input[name="duration"]').val();
					if(tmp.length > 0) data.duration = tmp;
					
					tmp = $this_.find('input[name="delay"]').val();
					if(tmp.length > 0) data.delay = tmp;
					
					tmp = $this_.find('select[name="easing"]').val();
					if(tmp.length > 0) data.easing = tmp;
				}
				
				
				if(data != null) custom_animations[anim_name].push(data);
			});
		});
		
		return custom_animations;
		
		//var str = JSON.stringify(custom_animations);
		//str = str.replace(/"([\-]?[0-9]+[\.]?[0-9]*)"/g, "$1");
		//str = str.replace(/"(function(.*))"\}/g, "$1");
	};
	
	$.azt_get_animation_names = function(opts){
		var all_anims = $.extend(true, {}, $.ctx.anims, $.collect_custom_anim_data());
		
		if(opts.mode == 'options'){
			var html = '';
			for(var anim_name in all_anims){
				html += '<option value="'+anim_name+'"'+(anim_name == opts.selected ? 'selected' : '')+'>'+anim_name+'</option>';
			}
			
			return html;
		}
	};
	
	$.azt_get_slides = function(opts){
		if(opts.mode == 'options'){
			var html = '';
			var i = 0;
			for(var slide_id in $.ctx.opts.actions){
				html += '<option value="'+i+'"'+(i == opts.selected ? 'selected' : '')+'>'+slide_id+'</option>';
				i++;
			}
			
			return html;
		}
	};
	
	$.azt_make_easing_options = function(opts){
		var html = '';
		for(var easing in $.cssEase){
			html += '<option value="'+easing+'" '+(opts.selected == easing ? 'selected' : '')+'>'+easing+'</option>';
		}
		return html;
	};
	
	$.azt_add_object_selector = function(selector){
		var num = $.azt_object_selector_n;
		var c_ = num % 2 == 0 ? 'even' : 'odd';
		var html = '<div class="row object-selector '+c_+'" id="object-selector-{{n}}" data-type="selector">\
			<div class="large-12 columns">\
				<label>Target\
					<input type="text" id="object-selector-{{n}}" value="'+selector+'" name="selector" title="CSS Selector">\
				</label>\
				<button class="tiny alert" type="button" onclick="$(\'#object-selector-{{n}}\').remove();">Delete</button>\
				<button type="button" class="tiny" id="object-btn-add-action-{{n}}">Add Action</button>\
				<div id="object-actions-holder-{{n}}">\
				</div>\
				<div class="row">\
					<div class="large-12 columns">\
						<br>\
					</div>\
				</div>\
			</div>\
		</div>';
		
		html = html.replace(/\{\{n\}\}/g, num);
		
		$('#object-selectors-holder').append(html);
		
		$('#object-btn-add-action-'+num).click(function(){
			$.azt_add_object_action('', num);
		});
		
		$.azt_object_selector_n++;
		
		return $.azt_object_selector_n - 1;
	};
	
	$.azt_add_object_action = function(name, n){
		var num = $.azt_object_action_n;
		
		var html = '<div class="row object-action" id="object-action-{{n}}" data-type="action">\
					<div class="large-2 columns">\
						<label>Action Name\
							<input type="text" id="object-action-name-{{n}}" value="'+name+'" name="action-name">\
						</label>\
						<button class="tiny alert" type="button" onclick="$(\'#object-action-{{n}}\').remove();">Delete</button>\
					</div>\
					<div class="large-10 columns">\
						<div class="commands" id="object-cmds-holder-{{n}}">\
							\
						</div>\
						<div class="row">\
							<div class="large-6 columns"><br>\
								<select id="object-cmds-{{n}}">\
									<option value="">-- Select Command --</option>\
									<option value="play-anim">Play an Animation</option>\
									<option value="play-action-after-anim">Play an Action After Animating</option>\
									<option value="play-slide-onclick">Play Slide on Click</option>\
									<option value="add-class">Add Class Name</option>\
									<option value="add-class-after-anim">Add Class Name After Animating</option>\
									<option value="remove-class">Remove Class Name</option>\
									<option value="remove-class-after-anim">Remove Class Name After Animating</option>\
									<option value="play-video">Play HTML5 Video</option>\
									<option value="play-video-after-anim">Play HTML5 Video After Animating</option>\
									<option value="pause-video">Pause HTML5 Video</option>\
									<option value="pause-video-after-anim">Pause HTML5 Video After Animating</option>\
									<option value="load-iframe">Load Iframe</option>\
									<option value="load-iframe-after-anim">Load Iframe After Animating</option>\
									<option value="unload-iframe">Unload Iframe</option>\
									<option value="unload-iframe-after-anim">Unload Iframe After Animating</option>\
									<option value="set-html">Set HTML</option>\
									<option value="set-html-after-anim">Set HTML After Animating</option>\
									<option value="stop-slide-after-anim">Stop Slide After Animating</option>\
								</select>\
							</div>\
							<div class="large-6 columns"><br>\
								<button type="button" class="tiny" id="object-btn-add-cmd-{{n}}">Add Command</button>\
							</div>\
						</div>\
					</div>\
				</div>';
		html = html.replace(/\{\{n\}\}/g, num);
		
		$('#object-actions-holder-'+n).append(html);
		
		$('#object-btn-add-cmd-'+num).click(function(){
			$.azt_add_object_action_cmd(num, '', {});
		});
		
		$.azt_object_action_n++;
		
		return $.azt_object_action_n - 1;
	};
	
	$.azt_add_object_action_cmd = function(num, cmd_type, data){
		if(!cmd_type) cmd_type = $('#object-cmds-' + num).val();
		var m = $.azt_object_action_cmd_n;
		
		if(cmd_type == ''){
			alert('Select a Command');
			return;
		}
		var $cmds_holder = $('#object-cmds-holder-'+ num);
		
		if(cmd_type == 'play-anim'){
			var anim_opts = $.azt_get_animation_names({
				mode: 'options',
				selected: typeof data == 'object' ? data.anim : data
			});
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play an Animation" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+((typeof data == 'object' && data.target != null) ? data.target : '')+'" name="target"></label></div>\
			<div class="large-4 columns"><label>Animation Name: <select name="animation-name">'+anim_opts+'</select></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-action-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play an Action After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s), objects or slide"></label></div>\
			<div class="large-4 columns"><label>Action of Target: <input type="text" value="'+(data.action? data.action : '')+'" name="action" title="Leave it blank to use the same action of object"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-slide-onclick'){
			var slide_opts = $.azt_get_slides({
				mode: 'options',
				selected: data.slide
			});
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play Slide on Click" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title=""></label></div>\
			<div class="large-4 columns"><label>Slide: <select name="slide">'+slide_opts+'</select></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'add-class'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Add Class Name" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>Class Name: <input type="text" value="'+(data.class_name? data.class_name : '')+'" name="class_name"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'add-class-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Add Class Name After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>Class Name: <input type="text" value="'+(data.class_name? data.class_name : '')+'" name="class_name"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'remove-class'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Remove Class Name" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>Class Name: <input type="text" value="'+(data.class_name? data.class_name : '')+'" name="class_name"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'remove-class-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Remove Class Name After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>Class Name: <input type="text" value="'+(data.class_name? data.class_name : '')+'" name="class_name"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-video'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play HTML5 Video" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>Time: <input type="text" value="'+(data.time? data.time : '')+'" name="time"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'play-video-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Play HTML5 Video After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>Time: <input type="text" value="'+(data.time? data.time : '')+'" name="time"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'pause-video'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Pause HTML5 Video" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'pause-video-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Pause HTML5 Video After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'load-iframe'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Load Iframe" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>URL: <input type="text" value="'+(data.url? data.url : '')+'" name="url"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'load-iframe-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Load Iframe After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"><label>URL: <input type="text" value="'+(data.url? data.url : '')+'" name="url"></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'unload-iframe'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Unload Iframe" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'unload-iframe-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Unload Iframe After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'set-html'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Set HTML" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"></div></div>\
			<div class="row"><div class="large-12 columns"><label>HTML:<textarea name="html">'+(data.html? data.html : '')+'</textarea></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'set-html-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Set HTML After Animating" disabled></label></div>\
			<div class="large-4 columns"><label>Target: <input type="text" value="'+(data.target? data.target : '')+'" name="target" title="CSS Selector of Object(s)"></label></div>\
			<div class="large-4 columns"></div></div>\
			<div class="row"><div class="large-12 columns"><label>HTML:<textarea name="html">'+(data.html? data.html : '')+'</textarea></label></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}else if(cmd_type == 'stop-slide-after-anim'){
			$cmds_holder.append('<div id="object-cmd-'+num+'-'+m+'" class="ocmd" data-type="'+cmd_type+'"><div class="row">\
			<div class="large-4 columns"><label>Command: <input type="text" value="Stop Slide After Animating" disabled></label></div>\
			<div class="large-4 columns"></div>\
			<div class="large-4 columns"></div></div>\
			<button class="tiny alert" type="button" onclick="$(\'#object-cmd-'+num+'-'+m+'\').remove();">Delete</button></div>');
		}
		
		$.azt_object_action_cmd_n++;
		$('#object-cmds-' + num).val('');
	};
	
	$.collect_object_selectors_data = function(){
		var $object_selectors = $('div.row.object-selector').filter(function() { 
			return $(this).data('type') == 'selector';
		});
		
		var object_selectors = {};
		
		$object_selectors.each(function(){
			var $this = $(this);
			var selector = $this.find('input[name="selector"]').val();
			
			object_selectors[selector] = {}
			
			var $object_actions = $('div.row.object-action', $this).filter(function() { 
				return $(this).data('type') == 'action';
			});
			
			$object_actions.each(function(){
				var $this_ = $(this);
				var action_name = $this_.find('input[name="action-name"]').val();
				$actions = $this_.find('div.commands > div.ocmd');
				
				object_selectors[selector][action_name] = {};
				object_selectors[selector][action_name]['commands'] = [];
				
				$actions.each(function(){
					var $this__ = $(this);
					var type = $this__.data('type');
					var data = null;
					var tmp = null;
					
					data = {};	
					data.cmd = type;
					
					if(type == 'play-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0){
							data.target = tmp;
							data.anim = $this__.find('select[name="animation-name"]').val();
						}else{
							data = $this__.find('select[name="animation-name"]').val();
						}
					}else if(type == 'play-action-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="action"]').val();
						if(tmp.length > 0) data.action = tmp;
					}else if(type == 'play-slide-onclick'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('select[name="slide"]').val();
						if(tmp.length > 0) data.slide = tmp;
					}else if(type == 'add-class'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="class_name"]').val();
						if(tmp.length > 0) data.class_name = tmp;
					}else if(type == 'add-class-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="class_name"]').val();
						if(tmp.length > 0) data.class_name = tmp;
					}else if(type == 'remove-class'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="class_name"]').val();
						if(tmp.length > 0) data.class_name = tmp;
					}else if(type == 'remove-class-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="class_name"]').val();
						if(tmp.length > 0) data.class_name = tmp;
					}else if(type == 'play-video'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="time"]').val();
						if(tmp.length > 0) data.time = tmp;
					}else if(type == 'play-video-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="time"]').val();
						if(tmp.length > 0) data.time = tmp;
					}else if(type == 'pause-video'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
					}else if(type == 'pause-video-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
					}else if(type == 'load-iframe'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="url"]').val();
						if(tmp.length > 0) data.url = tmp;
					}else if(type == 'load-iframe-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('input[name="url"]').val();
						if(tmp.length > 0) data.url = tmp;
					}else if(type == 'unload-iframe'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
					}else if(type == 'unload-iframe-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
					}else if(type == 'set-html'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('textarea[name="html"]').val();
						if(tmp.length > 0) data.html = tmp;
					}else if(type == 'set-html-after-anim'){
						tmp = $this__.find('input[name="target"]').val();
						if(tmp.length > 0) data.target = tmp;
						tmp = $this__.find('textarea[name="html"]').val();
						if(tmp.length > 0) data.html = tmp;
					}else if(type == 'stop-slide-after-anim'){
						
					}
					
					object_selectors[selector][action_name]['commands'].push(data);
				});	
			});
		});
		
		//alert(JSON.stringify(object_selectors));
		
		return object_selectors;
	};
	
	$.azt_play_slide = function(url){
		var actions = $.collect_slide_actions_data();
		actions.objects = $.collect_object_selectors_data();
		actions = encodeURIComponent(JSON.stringify(actions));
		var objects = encodeURIComponent(JSON.stringify($.ctx.data.objects[$.azt_slide_id], function(k, v){
			if(k == '$') return undefined; else return v;
		}));
		var custom_animations = encodeURIComponent(JSON.stringify($.collect_custom_anim_data()));

		window.open(url + '&actions=' + actions + '&objects=' + objects + '&custom_animations=' + custom_animations, '_blank');
		return false;
	};
	
	$.azt_play_slider = function(save_url, slider, slide_id, url){
		var tmp = $.azt_check_sum();
				
		if(tmp != $.md5_checksum){
			$.azt_save_slide(save_url, slider, slide_id, function(){ 
				window.open(url);		
			});
		}else{
			window.open(url);
		}
	};
	
	$.azt_embed = function(slider){
		$.get('embed.php?slider=' + slider, function(data){
			$('#txt-embed').val(data);
		});	
	}
	
	$.azt_check_sum = function(){	
		var actions = $.collect_slide_actions_data();
		actions.objects = $.collect_object_selectors_data();
		var objects = $.ctx.data.objects[$.azt_slide_id];
		var custom_animations = $.collect_custom_anim_data();
		var ds = aztp_ds_editor.getValue();
		var ds_type = $('#ds-type').val();
		var less = aztp_css_editor.getValue();
		
		var json = JSON.stringify([actions, objects, custom_animations, ds, ds_type, less], function(k, v){
			if(k == '$') return undefined; else return v;
		});
		
		return (json);
	}
	
	$.azt_less_to_css = function(callback){
		var parser = window.less.Parser();
		try{
			parser.parse('@import "less/prefixer.less";' + aztp_css_editor.getValue(), function(error, result){
				if(!error){
	                callback.call(null, result.toCSS());
				}else{
					alert(error);
				}
			});
		}catch(error){
			alert(error);
		}
	}
	
	$.azt_save_slide = function(url, slider, slide_id, callback){
		$.azt_less_to_css(function(css){
			var actions = $.collect_slide_actions_data();
			actions.objects = $.collect_object_selectors_data();
			actions = (JSON.stringify(actions));
			var objects = (JSON.stringify($.ctx.data.objects[$.azt_slide_id], function(k, v){
				if(k == '$') return undefined; else return v;
			}));
			var custom_animations = (JSON.stringify($.collect_custom_anim_data()));
			var ds = aztp_ds_editor.getValue();
			var ds_type = $('#ds-type').val();
			var less = aztp_css_editor.getValue();
			
			$('#azt-status').html('Saving...');
			
			$.post(url, {
				act: 'save_slide',
				slider: slider,
				slide_id: slide_id,
				actions: actions,
				objects: objects,
				custom_animations: custom_animations,
				less: less,
				css: css,
				ds: ds,
				ds_type: ds_type
			},function(data){
				$.md5_checksum = $.azt_check_sum();
				$('#azt-status').html('Saved');
				if(callback != null) callback.call(null);
			});
		});
	}
	
	$.azt_make_list_of_objects = function(){
		$('#list-of-objects').html('');
		
		if($.ctx.data.objects[$.azt_slide_id] != null){
			var html;
			for(var i in $.ctx.data.objects[$.azt_slide_id]){
				var o = $.ctx.data.objects[$.azt_slide_id][i];
				if(o.type == 'text'){
					html = $('<div class="item-obj" data-idx="'+i+'"><strong>[Text]</strong> '+o.text+'</div>');
				}else if(o.type == 'image' || o.type == 'bg'){
					html = $('<div class="item-obj" data-idx="'+i+'"><img src="'+o.url+'" width="64"></div>');
				}else if(o.type == 'video'){
					html = $('<div class="item-obj" data-idx="'+i+'"><strong>[Video]</strong> '+o.url+'</div>');
				}else if(o.type == 'html'){
					html = $('<div class="item-obj" data-idx="'+i+'"><strong>[HTML]</strong></div>');
				}else if(o.type == 'iframe'){
					html = $('<div class="item-obj" data-idx="'+i+'"><strong>[IFRAME]</strong> '+o.url+'</div>');
				}else if(o.type == 'tooltip'){
					html = $('<div class="item-obj" data-idx="'+i+'"><strong>[Tooltip]</strong> '+o.text+'</div>');
				}
				
				html.click(function(data){
					return function(){
		    			$('#list-of-objects .item-obj').removeClass('selected');
		    			$(this).addClass('selected');
		    			data.$.click();
					}
	    		}(o));
				
				$('#list-of-objects').append(html);	
			}
			$('#list-of-objects').sortable();
    		$('#list-of-objects').disableSelection();
		}
	}
	
	$.azt_save_list_of_objects = function(url, slider, slide_id){
		var objs = [];
		$('#list-of-objects .item-obj').each(function(){
			objs.push($.ctx.data.objects[$.azt_slide_id][parseInt($(this).data('idx'), 10)]);
		});
		$.ctx.data.objects[$.azt_slide_id] = objs;
		
		$.azt_save_slide(url, slider, slide_id, function(){ location.reload(); });
	};
	
	$.azt_save_slides_order = function(url, slider){
		var slide_ids = [];
		$('#slides-tabs a').each(function(){
			slide_ids.push($(this).data('slide_id'));
		});
		
		$('#azt-status').html('Saving...');
			
		$.post(url, {
			act: 'save_slides_order',
			slider: slider,
			slide_ids: JSON.stringify(slide_ids)
		},function(data){
			location.reload();
		});
	};
	
	$.fn.azt_init = function(opts){
		return this.each(function(){
			$.azt_slide_id = opts.slide_id;
			var ctx = this;
			$.ctx = ctx;
			ctx.$frames = $(this).find('.az-frame');
			
			$('#btn-remove-object').click(function(){
				if(ctx.$selected_object == null || ctx.$selected_object.get(0) == null){
					alert('Select an object first');
					return;
				}
				for(var i in $.ctx.data.objects[$.azt_slide_id]){
					var data = $.ctx.data.objects[$.azt_slide_id][i];
					if(data == ctx.$selected_object.get(0).azt_data){
						$.ctx.data.objects[$.azt_slide_id].splice(i, 1);
					}
				}
				
				ctx.$selected_object.get(0).azt_data = null;
				ctx.$selected_object.remove();
				$('#aztp-text').hide();
				$('#aztp-image').hide();
				$('#aztp-bg').hide();
				
				$.azt_make_list_of_objects();
			});
			
			/*------- TEXT PANEL-----------------*/
			//Top, Left
			$('#aztp_text_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.top = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			$('#aztp_text_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.left = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			//Text Content
			$('#aztp_text_content').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				if(data.type == 'text'){
					data.text = $this.val();
					ctx.$selected_object.find('>div').html($this.val());
				}
			});
			
			// Background color
			$('#aztp_bgcolor').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.bgcolor = $this.val();
				ctx.$selected_object.css('background-color', $this.val());
			});
			
			
			// ZIndex
			$('#aztp_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			//More Style
			$('#aztp_more_styles').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
			
				if(data.more_style != null && data.more_style.length > 0){
					var styles = data.more_style.split(';');
					for(var i = 0; i < styles.length; i++){
						var kv = styles[i].trim().split(':');
						if(!kv[0]) continue;
						
						ctx.$selected_object.css(kv[0].trim(), '');
					}
				}
				
				// Update data
				data.more_style = $this.val();
				
				// Update styles of object
				var styles = data.more_style.split(';');
				for(var i = 0; i < styles.length; i++){
					var kv = styles[i].trim().split(':');
					if(!kv[0]) continue;
					
					ctx.$selected_object.css(kv[0].trim(), kv[1].trim());
				}
			});
			
			$('#aztp_text_transform_origin_x').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.trans_ox = $this.val();
			});
			
			$('#aztp_text_transform_origin_y').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.trans_oy = $this.val();
			});
			
			$('#aztp_text_perspective').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.ppt = $this.val();
			});
			
			// Font Size
			$('#aztp_text_font_size').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.font_size = $this.val();
				ctx.$selected_object.find('.az-text').css('font-size', $this.val());
			});
			
			// Font Family
			$('#aztp_text_font_family').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.font_family = $this.val();
				ctx.$selected_object.find('.az-text').css('font-family', $this.val());
			});
			
			// Font Weight
			$('#aztp_text_font_weight').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.font_weight = $this.val();
				ctx.$selected_object.find('.az-text').css('font-weight', $this.val());
			});
			
			// Text color
			$('#aztp_text_color').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.color = $this.val();
				ctx.$selected_object.find('.az-text').css('color', $this.val());
			});
			
			// Text color
			$('#aztp_text_padding').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.padding = $this.val();
				ctx.$selected_object.css('padding', $this.val());
			});
			
			/*------- BACKGROUND PANEL -----------------*/
			// ZIndex
			$('#aztp_bg_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_bg_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_bg_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			// bg width
			$('#aztp_bg_width').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['i-width'] = $this.val();
				ctx.$selected_object.find('img').css('width', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// bg height
			$('#aztp_bg_height').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['i-height'] = $this.val();
				ctx.$selected_object.find('img').css('height', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// bg top
			$('#aztp_bg_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				var v = $('#bg_mode').val();
				
				data['i-top'] = $this.val();
				
				if(v == 'grid'){
					var data = ctx.$selected_object.get(0).azt_data;
					data.mode = v;
				
					var tmp = $.az.add_bg(data, $.ctx.$frames, $.ctx, true, $.ctx.$selected_object, true);
					$.ctx.$selected_object.remove();
					$.ctx.$selected_object = tmp;
				}else{
					ctx.$selected_object.find('div').css('background-position', (data['i-left'] || 0) + ' ' + (data['i-top'] || 0));
				}
			});
			
			// bg left
			$('#aztp_bg_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				var v = $('#bg_mode').val();
				
				data['i-left'] = $this.val();
				
				if(v == 'grid'){
					var data = ctx.$selected_object.get(0).azt_data;
					data.mode = v;
				
					var tmp = $.az.add_bg(data, $.ctx.$frames, $.ctx, true, $.ctx.$selected_object, true);
					$.ctx.$selected_object.remove();
					$.ctx.$selected_object = tmp;
				}else{
					ctx.$selected_object.find('div').css('background-position', (data['i-left'] || 0) + ' ' + (data['i-top'] || 0));
				}
			});
			
			// Wrapper width
			$('#aztp_wbg_width').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-width'] = $this.val();
				ctx.$selected_object.css('width', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// Wrapper height
			$('#aztp_wbg_height').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-height'] = $this.val();
				ctx.$selected_object.css('height', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// Wrapper top
			$('#aztp_wbg_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-top'] = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			// Wrapper left
			$('#aztp_wbg_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-left'] = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			// bg size
			$('#aztp_bg_size').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['size'] = $this.val();
				ctx.$selected_object.find('div').css('background-size', data['size']);
			});
			
			// Cols
			$('#aztp_cols').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['cols'] = $this.val();
			});
			
			// Rows
			$('#aztp_rows').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['rows'] = $this.val();
			});
			
			// Grid Scripts
			$('#aztp_grid_scripts').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				data['gs'] = $this.val();
			});
			
			$('#bg_mode').change(function(){
				var v = $(this).val();
				
				var data = ctx.$selected_object.get(0).azt_data;
				data.mode = v;
				
				var tmp = $.az.add_bg(data, $.ctx.$frames, $.ctx, true, ctx.$selected_object, true);
				ctx.$selected_object.remove();
				ctx.$selected_object = tmp;
				
				if(v == 'grid'){
					$('#pnl_bg_grid_info2').show();
					$('#pnl_bg_grid_scripts').show();
					$('.bg-wh').show();
					$('.bg-s').hide();
				}else{
					$('#pnl_bg_grid_info2').hide();
					$('#pnl_bg_grid_scripts').hide();
				}
				if(v == 'xy' || v == 'x' || v == 'y' || v == 'norepeat'){
					$('.bg-wh').hide();
					$('.bg-s').show();
				}
			});
			
			/*------- IMAGE PANEL -----------------*/
			
			// ZIndex
			$('#aztp_image_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_image_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_image_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			
			
			// Wrapper width
			$('#aztp_wimage_width').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-width'] = $this.val();
				ctx.$selected_object.css('width', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// Wrapper height
			$('#aztp_wimage_height').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-height'] = $this.val();
				ctx.$selected_object.css('height', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// Image width
			$('#aztp_image_width').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['i-width'] = $this.val();
				ctx.$selected_object.find('img').css('width', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// Image height
			$('#aztp_image_height').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['i-height'] = $this.val();
				ctx.$selected_object.find('img').css('height', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			// Wrapper top
			$('#aztp_wimage_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-top'] = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			// Wrapper left
			$('#aztp_wimage_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['w-left'] = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			// Image top
			$('#aztp_image_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['i-top'] = $this.val();
				ctx.$selected_object.find('img').css('top', $this.val());
			});
			
			// Image left
			$('#aztp_image_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['i-left'] = $this.val();
				ctx.$selected_object.find('img').css('left', $this.val());
			});
			
			//More Style
			$('#aztp_more_image_styles').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
			
				if(data.more_style != null && data.more_style.length > 0){
					var styles = data.more_style.split(';');
					for(var i = 0; i < styles.length; i++){
						var kv = styles[i].trim().split(':');
						if(!kv[0]) continue;
						
						ctx.$selected_object.css(kv[0].trim(), '');
					}
				}
				
				// Update data
				data.more_style = $this.val();
				
				// Update styles of object
				var styles = data.more_style.split(';');
				for(var i = 0; i < styles.length; i++){
					var kv = styles[i].trim().split(':');
					if(!kv[0]) continue;
					
					ctx.$selected_object.css(kv[0].trim(), kv[1].trim());
				}
			});
			
			$('#aztp_image_transform_origin_x').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.trans_ox = $this.val();
			});
			
			$('#aztp_image_transform_origin_y').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.trans_oy = $this.val();
			});
			
			$('#aztp_image_perspective').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.ppt = $this.val();
			});
			
			/*------- Tooltip PANEL -----------------*/
			
			// ZIndex
			$('#aztp_tooltip_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_tooltip_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_tooltip_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			//  top
			$('#aztp_tooltip_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['top'] = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			//  left
			$('#aztp_tooltip_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['left'] = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			//  tooltip text
			$('#aztp_tooltip_text').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['text'] = $this.val();
			});
			
			$('#aztp_tooltip_position').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['pos'] = $this.val();
			});
			
			$('#aztp_tooltip_in_anim').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['in_anim'] = $this.val();
			});
			
			$('#aztp_tooltip_out_anim').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['out_anim'] = $this.val();
			});
			
			$('#aztp_tooltip_width').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['width'] = $this.val();
			});
			
			
			/*------- HTML PANEL -----------------*/
			
			// ZIndex
			$('#aztp_html_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_html_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_html_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			//  top
			$('#aztp_html_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['top'] = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			//  left
			$('#aztp_html_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['left'] = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			//  html
			$('#aztp_html').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['html'] = $this.val();
				ctx.$selected_object.html('');
				ctx.$selected_object.append($this.val());
			});
			
			/*------- Iframe PANEL -----------------*/
			//  url
			$('#aztp_iframe_url').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['url'] = $this.val();
				ctx.$selected_object.find('iframe').data('url', $this.val());
			});
			
			// ZIndex
			$('#aztp_iframe_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_iframe_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_iframe_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			//  width
			$('#aztp_iframe_width').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['width'] = $this.val();
				ctx.$selected_object.find('iframe').css('width', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			//  height
			$('#aztp_iframe_height').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['height'] = $this.val();
				ctx.$selected_object.find('iframe').css('height', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			//  top
			$('#aztp_iframe_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['top'] = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			//  left
			$('#aztp_iframe_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['left'] = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			//  attributes
			$('#aztp_iframe_attrs').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['attrs'] = $this.val();
			});
			
			
			/*------- VIDEO PANEL -----------------*/
			
			// ZIndex
			$('#aztp_video_zindex').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.zindex = $this.val();
				ctx.$selected_object.css('z-index', $this.val());
			});
			
			// ID
			$('#aztp_video_id').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.id = $this.val();
				ctx.$selected_object.attr('id', $this.val());
			});
			
			// Class
			$('#aztp_video_class').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				ctx.$selected_object.removeClass(data['class']);
				data['class'] = $this.val();
				ctx.$selected_object.addClass($this.val());
			});
			
			//  width
			$('#aztp_video_width').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['width'] = $this.val();
				ctx.$selected_object.css('width', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			//  height
			$('#aztp_video_height').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['height'] = $this.val();
				ctx.$selected_object.css('height', $.az.get_object_wh($this.val(), $.ctx));
			});
			
			//  top
			$('#aztp_video_top').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['top'] = $this.val();
				ctx.$selected_object.css('top', $this.val());
			});
			
			//  left
			$('#aztp_video_left').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['left'] = $this.val();
				ctx.$selected_object.css('left', $this.val());
			});
			
			$('#aztp_video_transform_origin_x').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.trans_ox = $this.val();
			});
			
			$('#aztp_video_transform_origin_y').keyup(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data.trans_oy = $this.val();
			});
			
			$('#aztp_video_autoplay').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['autoplay'] = $this.val();
			});
			
			$('#aztp_video_controls').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['controls'] = $this.val();
			});
			
			$('#aztp_video_loop').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['loop'] = $this.val();
			});
			
			$('#aztp_video_muted').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['muted'] = $this.val();
			});
			
			$('#aztp_video_preload').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['preload'] = $this.val();
			});
			
			$('#aztp_video_poster').change(function(){
				var $this = $(this);
				var data = ctx.$selected_object.get(0).azt_data;
				
				data['poster'] = $this.val();
			});
			
			/*------- UPLOAD IMAGE MODAL----------------*/
			
			var files;
			$('#frm-add-image input[name=image]').on('change', function(event){
				files = event.target.files;
			});
			
			$('#frm-add-image').on('submit', function(event){
				event.stopPropagation(); // Stop stuff happening
				event.preventDefault(); // Totally stop stuff happening

				// START A LOADING SPINNER HERE
				$('#btn-upload-image').hide();
				$('#btn-uploading-image').show();
				$('#pnl_image_source').hide();

				// Create a formdata object and add the files
				var data = new FormData();
				$.each(files, function(key, value){
					data.append(key, value);
				});
				
				$.ajax({
					url: $('#frm-add-image').attr('action'),
					type: 'POST',
					data: data,
					cache: false,
					dataType: 'json',
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					success: function(data, textStatus, jqXHR){
						if(typeof data.error === 'undefined'){
							// Success so call function to process the form
							//submitForm(event, data);
							if(data.url){
								$('#pnl_upload_image').hide();
								$('#pnl_url_image').show();
								$('#btn-upload-image').hide();
								$('#btn-uploading-image').hide();
								$('#btn-add-image').show();
								$('#url_image').val(data.url);
								$('#image_source').val('url');
								$('#pnl_image_source').show();
							}
						}else{
							// Handle errors here
							alert('ERRORS: ' + data.error);
							console.log('ERRORS: ' + data.error);
						}
					},error: function(jqXHR, textStatus, errorThrown){
						// Handle errors here
						alert('ERRORS: ' + textStatus);
						console.log('ERRORS: ' + textStatus);
						// STOP LOADING SPINNER
					}
				});
			});
			
			$('#image_source').change(function(){
				if($(this).val() == 'upload'){
					$('#pnl_upload_image').show();
					$('#pnl_url_image').hide();
					$('#btn-upload-image').show();
					$('#btn-add-image').hide();
				}else if($(this).val() == 'url'){
					$('#pnl_upload_image').hide();
					$('#pnl_url_image').show();
					$('#btn-upload-image').hide();
					$('#btn-add-image').show();
				}
				$('#upload_image_info').html('');
				$('#pnl-add-image-info').hide();
				$('#url_image').val('');
			});	
			
			$('#upload_image').check_image_size({
				info: '#upload_image_info',
				pnl_info: '#pnl-add-image-info',
				em_w: '#add-image-width',
				em_h: '#add-image-height',
				type: 'file_upload'
			});
			
			$('#url_image').check_image_size({
				info: '#upload_image_info',
				pnl_info: '#pnl-add-image-info',
				em_w: '#add-image-width',
				em_h: '#add-image-height',
				type: 'file_url'
			});
			
			$('#btn-add-image').click(function(){
				if($('#add-image-width').val() == '' && $('#add-image-height').val() == ''){
					$('#image-size-alert').show();
					return;
				}else{
					$('#image-size-alert').hide();
				}
				
				$.azt_add_image($('#url_image').val(), $('#add-image-wrapper-width').val(), $('#add-image-wrapper-height').val(), 
					$('#add-image-width').val(), $('#add-image-height').val());
				
				
				// clean
				$('#add-image-modal').foundation('reveal', 'close');
				$('#pnl-add-image-info').hide();
				$('#url_image').val('');
			});
			
			
			$('#btn-add-html').click(function(){
				var html = $('#html-code').val();
				if(html != '' && html != null){
					$.azt_add_html(html);
				}
				
				$('#add-html-modal').foundation('reveal', 'close');
			});
			
			/*-------UPLOAD Video----------------*/
			$('#video_source').change(function(){
				if($(this).val() == 'upload'){
					$('#pnl_upload_video').show();
					$('#pnl_url_video').hide();
					$('#btn-upload-video').show();
					$('#btn-add-video').hide();
				}else if($(this).val() == 'url'){
					$('#pnl_upload_video').hide();
					$('#pnl_url_video').show();
					$('#btn-upload-video').hide();
					$('#btn-add-video').show();
				}
				$('#upload_video_info').html('');
				$('#pnl-add-video-info').hide();
				$('#url_video').val('');
			});	
			
			
			var files3;
			$('#frm-add-video input[name=video]').on('change', function(event){
				files3 = event.target.files;
			});
			
			$('#frm-add-video').on('submit', function(event){
				event.stopPropagation(); // Stop stuff happening
				event.preventDefault(); // Totally stop stuff happening

				// START A LOADING SPINNER HERE
				$('#btn-upload-video').hide();
				$('#btn-uploading-video').show();
				$('#pnl_video_source').hide();

				// Create a formdata object and add the files
				var data = new FormData();
				$.each(files3, function(key, value){
					data.append(key, value);
				});
				
				$.ajax({
					url: $('#frm-add-video').attr('action'),
					type: 'POST',
					data: data,
					cache: false,
					dataType: 'json',
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					success: function(data, textStatus, jqXHR){
						if(typeof data.error === 'undefined'){
							// Success so call function to process the form
							//submitForm(event, data);
							if(data.url){
								$('#pnl_upload_video').hide();
								$('#pnl_url_video').show();
								$('#btn-upload-video').hide();
								$('#btn-uploading-video').hide();
								$('#btn-add-video').show();
								$('#url_video').val(data.url);
								$('#video_source').val('url');
								$('#pnl_video_source').show();
							}
						}else{
							// Handle errors here
							alert('ERRORS: ' + data.error);
							console.log('ERRORS: ' + data.error);
						}
					},error: function(jqXHR, textStatus, errorThrown){
						// Handle errors here
						alert('ERRORS: ' + textStatus);
						console.log('ERRORS: ' + textStatus);
						// STOP LOADING SPINNER
					}
				});
			});
			
			$('#btn-add-video').click(function(){
				
				$.azt_add_video($('#url_video').val(),  $('#video_width').val(), $('#video_height').val(), $('#video_autoplay').val(), $('#video_controls').val(), $('#video_loop').val(), $('#video_muted').val(), $('#video_preload').val());
				
				// clean
				$('#add-video-modal').foundation('reveal', 'close');
				$('#pnl-add-video-info').hide();
				$('#url_video').val('');
				$('#video_source').val('');
			});
			
			/*-------UPLOAD BACKGROUND----------------*/
			$('#bg_source').change(function(){
				if($(this).val() == 'upload'){
					$('#pnl_upload_bg').show();
					$('#pnl_url_bg').hide();
					$('#btn-upload-bg').show();
					$('#btn-add-bg').hide();
				}else if($(this).val() == 'url'){
					$('#pnl_upload_bg').hide();
					$('#pnl_url_bg').show();
					$('#btn-upload-bg').hide();
					$('#btn-add-bg').show();
				}
				$('#upload_bg_info').html('');
				$('#pnl-add-bg-info').hide();
				$('#url_bg').val('');
			});	
			
			$('#upload_bg').check_image_size({
				info: '#upload_bg_info',
				pnl_info: '#pnl-add-bg-info',
				em_w: '#add-bg-width',
				em_h: '#add-bg-height',
				type: 'file_upload'
			});
			
			$('#url_bg').check_image_size({
				info: '#upload_bg_info',
				pnl_info: '#pnl-add-bg-info',
				em_w: '#add-bg-width',
				em_h: '#add-bg-height',
				type: 'file_url'
			});
			
			$('#bg_type').change(function(){
				var val = $(this).val();
				if(val == 'grid'){
					$('#pnl_bg_grid_info').show();
				}else{
					$('#pnl_bg_grid_info').hide();
				}
			});
			
			var files2;
			$('#frm-add-bg input[name=bg]').on('change', function(event){
				files2 = event.target.files;
			});
			
			$('#frm-add-bg').on('submit', function(event){
				event.stopPropagation(); // Stop stuff happening
				event.preventDefault(); // Totally stop stuff happening

				// START A LOADING SPINNER HERE
				$('#btn-upload-bg').hide();
				$('#btn-uploading-bg').show();
				$('#pnl_bg_source').hide();

				// Create a formdata object and add the files
				var data = new FormData();
				$.each(files2, function(key, value){
					data.append(key, value);
				});
				
				$.ajax({
					url: $('#frm-add-bg').attr('action'),
					type: 'POST',
					data: data,
					cache: false,
					dataType: 'json',
					processData: false, // Don't process the files
					contentType: false, // Set content type to false as jQuery will tell the server its a query string request
					success: function(data, textStatus, jqXHR){
						if(typeof data.error === 'undefined'){
							// Success so call function to process the form
							//submitForm(event, data);
							if(data.url){
								$('#pnl_upload_bg').hide();
								$('#pnl_url_bg').show();
								$('#btn-upload-bg').hide();
								$('#btn-uploading-bg').hide();
								$('#btn-add-bg').show();
								$('#url_bg').val(data.url);
								$('#bg_source').val('url');
								$('#pnl_bg_source').show();
							}
						}else{
							// Handle errors here
							alert('ERRORS: ' + data.error);
							console.log('ERRORS: ' + data.error);
						}
					},error: function(jqXHR, textStatus, errorThrown){
						// Handle errors here
						alert('ERRORS: ' + textStatus);
						console.log('ERRORS: ' + textStatus);
						// STOP LOADING SPINNER
					}
				});
			});
			
			$('#btn-add-bg').click(function(){
				
				$.azt_add_bg($('#url_bg').val(), 'slider-width', 'slider-height', $('#add-bg-width').val(), $('#add-bg-height').val(), 
					$('#add-bg-cols').val(), $('#add-bg-rows').val(), $('#bg_type').val())
				
				// clean
				$('#add-bg-modal').foundation('reveal', 'close');
				$('#pnl-add-bg-info').hide();
				$('#url_bg').val('');
				$('#bg_source').val('');
			});
			
			/*-------IFRAME----------------*/
			$('#btn-add-iframe').click(function(){
				$.azt_add_iframe($('#iframe_url').val(), $('#iframe_attrs').val(), $('#iframe_width').val(), $('#iframe_height').val());
				// clean
				$('#add-iframe-modal').foundation('reveal', 'close');
			});
			
			/*-------Data Source----------------*/
			$('#ds-type').change(function(){
				var v = $(this).val();
				if(v == ''){
					$('#txt-ds-url').hide();
					$('#txt-ds-json').hide();
				}else if(v == 'url'){
					$('#txt-ds-url').show();
					$('#txt-ds-json').hide();
				}else if(v == 'json'){
					$('#txt-ds-url').hide();
					$('#txt-ds-json').show();
				}
			});
			$('#ds-type').change();
			/*-------Slider Settings----------------*/
			
			$('#frames_layout').change(function(){
				var v = $(this).val();
				if(v == 'film'){
					$('#film-layout-settings').show();
				}else{
					$('#film-layout-settings').hide();
				}
			});
			$('#frames_layout').change();
			
			/*-------SLIDES TABS----------------*/
			
			$('#slides-tabs').sortable();
    		$('#slides-tabs').disableSelection();
    		
			/*-------SLIDE ACTIONS TAB----------------*/
			$.ctx.opts = opts;
			var actions = opts.actions[opts.slide_id];
			if(actions != null){
				for(var action in actions){
					if(action != 'objects'){
						var num = $.azt_add_slide_action(action);
						for(var i in actions[action].commands){
							var cmd = actions[action].commands[i];
							if(typeof cmd == 'string'){
								$.azt_add_slide_action_cmd(num, 'play-anim', cmd);
							}else{
								$.azt_add_slide_action_cmd(num, cmd.cmd, cmd);
							}
						}
					}
				}	
				var object_selectors = actions['objects'];
				for(var selector in object_selectors){
					var num = $.azt_add_object_selector(selector);
					var actions = object_selectors[selector];
					for(var action in actions){
						var num_ = $.azt_add_object_action(action, num);
						var cmds = actions[action].commands;
						for(var i in cmds){
							var cmd = cmds[i];
							if(typeof cmd == 'string'){
								$.azt_add_object_action_cmd(num_, 'play-anim', cmd);
							}else{
								$.azt_add_object_action_cmd(num_, cmd.cmd, cmd);
							}
						}
					}
				}
			}
			var custom_animations = opts.custom_animations;
			for(var animation_name in custom_animations){
				var types = custom_animations[animation_name];
				
				var num = $.azt_add_custom_anim(animation_name);
				for(var i in types){
					var type = types[i];
					$.azt_add_custom_anim_type(num, type.type, type);
				}	
			}
			
			$.azt_make_list_of_objects();
			
			/*
			$(document).keydown(function(e) {
			    switch(e.which) {
			        case 37: // left
			       		alert('left');
			        break;
			
			        case 38: // up
			        	alert('up');
			        break;
			
			        case 39: // right
			        	alert('right');
			        break;
			
			        case 40: // down
			        	alert('down');
			        break;
			
			        default: return; // exit this handler for other keys
			    }
			    e.preventDefault(); // prevent the default action (scroll / move caret)
			});*/
			
			$.md5_checksum = $.azt_check_sum();
			
			function goodbye(e) {
				var tmp = $.azt_check_sum();
				
				if(tmp != $.md5_checksum){
					if(!e) e = window.event;
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = 'Your slider does not save changes yet!'; //This is displayed on the dialog
						
						//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
				}
			}
			window.onbeforeunload = goodbye; 

			
			return this;
		});
	};
})(jQuery);

function load_film_easing_options(selector, selected){
	$(selector).html('');
	var html = '';
	for(var ease in custom_easing){
		html += '<option value="'+ease+'"'+(ease == selected ? 'selected' : '')+'>'+ease+'</option>';
	}
	
	$(selector).append(html);
}

function load_film_animation_options(selector, selected){
	$(selector).html('');
	var html = '<option value="none">None</option>';
	for(var anim in $.az.film_animations){
		html += '<option value="'+anim+'"'+(anim == selected ? 'selected' : '')+'>'+anim+'</option>';
	}
	
	$(selector).append(html);
}

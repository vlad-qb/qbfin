/*!
 * AZSlider
 * http://simplezt.com/azslider/
 *
 *
 * Copyright 2015 Simplezt
 */

(function($) {
	
	$.fn.imagesLoaded = function(callback){
		var elems = this.filter('img'),
		len   = elems.length;
		elems.bind('load.imgloaded',function(){
			if (--len <= 0 && this.src !== $.az.blank_image){ 
				elems.unbind('load.imgloaded');
				//console.log('Image loaded: ' + this.src);
				callback.call(this, this); 
			}
		}).each(function(){
			if (this.complete || this.complete === undefined){
				var src = this.src;
				this.src = $.az.blank_image;
				this.src = src;
				elems.unbind('load.imgloaded');
				//console.log('Image completed: ' + this.src);
				callback.call(this, this);
			}  
		}); 
		return this;
	};

	$.az = {
		ttn: 1,
		blank_image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
		loadSkin: function(url, callback){
			var $div = $('<div class="simplezt-css-loaded" style="display: none"></div>').appendTo($(document.body));
			$('<link rel="stylesheet" type="text/css" href="'+url+'" >').appendTo("head");
			var tmp = function(){
				if($div.width() == 999){
					callback.call($div);
				}else{
					setTimeout(tmp, 16);
				}
			};
			tmp();
		},
		resize: function(ctx){
			var c_width = ctx.$slider.width();
			var c_height = ctx.$slider.height();
			var v = ctx.o_width - c_width;
			ctx.scale_factor = -(v / ctx.o_width);
			
			if(c_width < ctx.o_width){
				v = ctx.o_width - c_width;
				ctx.scale_factor = -(v / ctx.o_width);
				//'height': ctx.o_height - (v * ctx.o_ratio) + 'px',
				ctx.$slider.css({
					'font-size': (c_width * ctx.alpha / ctx.o_width) + 'px'
				});
			}else{
				ctx.scale_factor = 0;
				ctx.$slider.css({
					'font-size': ctx.alpha + 'px'
				});
			}
			
			var pos = ctx.$viewport.position();
			var w = ctx.$viewport.width();
			var h = ctx.$viewport.height();
			ctx.parallax_point = {
				x: pos.left + (w / 2),
				y: pos.top + (h / 2)
			}
			
			//init partial
			
			if(ctx.data.film_dir == 'vertical'){
				v = Math.ceil(ctx.$viewport_wrapper.height() / ctx.$viewport.height());
			}else{
				v = Math.ceil(ctx.$viewport_wrapper.width() / ctx.$viewport.width());
			}
			
			if(v > 1 && v <= 3 && ctx.frame_size >= 3){
				ctx.data.slides_partial = 3;
			}else if(v > 3 && v <= 5 && ctx.frame_size >= 5){
				ctx.data.slides_partial = 5;
			}else if(v > 5 && v <= 7 && ctx.frame_size >= 7){
				ctx.data.slides_partial = 7;
			}else if(v > 7 && v <= 9 && ctx.frame_size >= 9){
				ctx.data.slides_partial = 9;
			}else{
				ctx.data.slides_partial = 3;
			}
		},
		image_onload: function(this_, ctx){
			if (this_.complete || (this_.readyState == 'complete')) {
				var $img = $(this_);
				$img.data('loaded', 1);
					
				var w = $img.width();
				var h = $img.height();
			}
		},
		px2em: function(px, ctx){
			//////console.log('sf ' + ctx.scale_factor);
			return ((parseFloat(px, 10) / ctx.alpha) / (ctx.scale_factor + 1)) + 'em';
		},
		px2em2: function(px, ctx){
			//////console.log('sf2 ' + ctx.scale_factor);
			return ((parseFloat(px, 10) / ctx.alpha) / (ctx.scale_factor + 1));
		},
		px2em3: function(px, ctx){
			//////console.log('sf ' + ctx.scale_factor);
			return (parseFloat(px, 10) / ctx.alpha) + 'em';
		},
		setem: function($element, name, val){
			//$element.css(name, val + 'em');
			if($element.get(0).css == null){
				$element.get(0).css = {};
			}
			$element.get(0).css[name] = val;
			
			////console.log($element.attr('class') + ' : ' + name + ' : ' + val);
		},
		is_em: function(str){
			if(str.indexOf('em') == -1){
				return false;
			}
			if(str.indexOf('%') != -1){
				return true;
			}
			return true;
		},
		get_object_wh: function(value, ctx){
			if(value == 'slider-width'){
				var sw = parseInt(ctx.data.size.width, 10);
				return $.az.px2em(sw, ctx);
			}else if(value == 'slider-height'){
				var sh = parseInt(ctx.data.size.height, 10);
				return $.az.px2em(sh, ctx);
			}else return value;
		},
		convert_element_size: function($element, ctx){
			//if($element.hasClass('az-steady')) return;
			var element = $element.get(0);
			
			var w = $element.css('width'),
				h = $element.css('height'),
				pt = $element.css('padding-top'),
				pr = $element.css('padding-right'),
				pb = $element.css('padding-bottom'),
				pl = $element.css('padding-left'),
				mt = $element.css('margin-top'),
				mr = $element.css('margin-right'),
				mb = $element.css('margin-bottom'),
				ml = $element.css('margin-left'),
				fs = $element.css('font-size');
			
			var pos = $element.position();
			
			// Size
			$.az.setem($element, 'width', $.az.px2em2(w, ctx));
			$.az.setem($element, 'height', $.az.px2em2(h, ctx));
			
			// Padding
			$.az.setem($element, 'padding-top', $.az.px2em2(pt, ctx));
			$.az.setem($element, 'padding-right', $.az.px2em2(pr, ctx));
			$.az.setem($element, 'padding-bottom', $.az.px2em2(pb, ctx));
			$.az.setem($element, 'padding-left', $.az.px2em2(pl, ctx));
			
			// Margin
			$.az.setem($element, 'margin-top', $.az.px2em2(mt, ctx));
			$.az.setem($element, 'margin-right', $.az.px2em2(mr, ctx));
			$.az.setem($element, 'margin-bottom', $.az.px2em2(mb, ctx));
			$.az.setem($element, 'margin-left', $.az.px2em2(ml, ctx));
			
			// Position
			$.az.setem($element, 'pos-t', $.az.px2em2(pos.top, ctx));
			$.az.setem($element, 'pos-l', $.az.px2em2(pos.left, ctx));
			
			$.az.setem($element, 'font-size', $.az.px2em2(fs, ctx));
			//alert((parseFloat(pos.left)/ctx.alpha));
		},
		add_more_style: function($this, more_style){
			if(more_style){
				var styles = more_style.split(';');
				for(var i = 0; i < styles.length; i++){
					var kv = styles[i].trim().split(':');
					if(!kv[0]) continue;
					$this.css(kv[0].trim(), kv[1].trim());
				}
			}
		},
		isnotnull: function(v, str){
			if(v != null) return str; else return '';
		},
		transformOrigin: function(trans_ox, trans_oy){
			var trans_o = '';
			if(trans_ox != null && trans_oy != null && trans_ox != '' && trans_oy != ''){
				var v = trans_ox + ' ' + trans_oy;
				trans_o = '-ms-transform-origin: '+v+';-webkit-transform-origin: '+v+';-moz-transform-origin: '+v+';transform-origin: '+v+';'
			}	
			return trans_o;
		},
		perspective: function(perspective){
			var p = '';
			if(perspective != null && perspective != ''){
				p = '-webkit-perspective: '+perspective+';-moz-perspective: '+perspective+';-ms-perspective: '+perspective+';perspective: '+perspective+';';
			}
			return p;
		},
		add_bg: function(data, $frame, ctx, is_tool, $after, is_show){
			var $bg, $bg_wrapper = $('<div data-type="bg" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-bg-wrapper" style="position: absolute; z-index: '+(data['zindex'] || 0)+'; top: '+data['w-top']+'; left: '+data['w-left']+'; width: '+$.az.get_object_wh(data['w-width'], ctx)+'; height: '+$.az.get_object_wh(data['w-height'], ctx)+';"></div>');
			
			if(data.mode == 'norepeat'){
				$bg = $('<div class="az-obj" style="width: 100%; height: 100%; background: url(\''+data['url']+'\') no-repeat; background-size: '+data['size']+'"></div>');
				$bg.css('background-position', (data['i-left'] || 0) + ' ' + (data['i-top'] || 0));
				$bg_wrapper.append($bg);
			}else if(data.mode == 'xy'){
				$bg = $('<div class="az-obj" style="width: 100%; height: 100%; background: url(\''+data['url']+'\'); background-size: '+data['size']+'; "></div>');
				$bg.css('background-position', (data['i-left'] || 0) + ' ' + (data['i-top'] || 0));
				$bg_wrapper.append($bg);
			}else if(data.mode == 'x'){
				$bg = $('<div class="az-obj" style="width: 100%; height: 100%; background: url(\''+data['url']+'\') repeat-x; background-size: '+data['size']+'"></div>');
				$bg.css('background-position', (data['i-left'] || 0) + ' ' + (data['i-top'] || 0));
				$bg_wrapper.append($bg);
			}else if(data.mode == 'y'){
				$bg = $('<div class="az-obj" style="width: 100%; height: 100%; background: url(\''+data['url']+'\') repeat-y; background-size: '+data['size']+'"></div>');
				$bg.css('background-position', (data['i-left'] || 0) + ' ' + (data['i-top'] || 0));
				$bg_wrapper.append($bg);
			}else if(data.mode == 'grid'){
				var w = parseFloat($.az.get_object_wh(data['w-width'], ctx), 10);
				var h = parseFloat($.az.get_object_wh(data['w-height'], ctx), 10);
				var cw = (w / data['cols']); //unit: em
				var ch = (h / data['rows']); //unit: em
				var cells = [];
				
				for(var i = 0; i < data['cols']; i++){
					for(var j = 0; j <  data['rows']; j++){
						
						var c, c_, trans_o = '', ppt = '';
						if(typeof data['gs'] == 'function'){
							c = data.gs(j, i, data['rows'], data['cols'], cw, ch);
							data['ctn-h-dir'] = c['ctn-h'];
							data['img-h-dir'] = c['img-h'];
							data['ctn-v-dir'] = c['ctn-v'];
							data['img-v-dir'] = c['img-v'];
							data['trans-ox'] = c['trans-ox'];
							data['trans-oy'] = c['trans-oy'];
							data['ppt'] = c['ppt'];
							c_ = c['class'] || data['class'];
							
							trans_o = $.az.transformOrigin(data['trans-ox'], data['trans-oy']);
							ppt = $.az.perspective(data['ppt']);
						}else{
							c_ = data['class'];
						}
						
						var ctn_h_dir = data['ctn-h-dir'] || 'left';
						var ctn_v_dir = data['ctn-v-dir'] || 'top';
						var img_h_dir = data['img-h-dir'] || 'left';
						var img_v_dir = data['img-v-dir'] || 'top';
						
						var bx = (img_h_dir == 'left' ? -i * cw : (data['cols'] - 1 - i) * -cw);
						var by = (img_v_dir == 'top' ? -j * ch : (data['rows'] - 1 - j) * -ch);
						var x = ctn_h_dir == 'left' ? i * cw : (data['cols'] - 1 - i) * cw;
						var y = ctn_v_dir == 'top' ? j * ch : (data['rows'] - 1 - j) * ch;
						
						cells.push('<div class="az-obj az-cell az-ha '+(c_||'')+'" data-ci="'+i+'" data-ri="'+j+'" data-cols="'+data['cols']+'" data-rows="'+data['rows']+'" style="width: '+cw+'em; height: '+ch+'em; '+ctn_v_dir+': '+y+'em; '+ctn_h_dir+': '+x+'em;'+trans_o+ppt+'"><img style="width: '+$.az.get_object_wh(data['i-width'], ctx)+'; height: '+$.az.get_object_wh(data['i-height'], ctx)+'; '+img_h_dir+': '+bx+'em; '+img_v_dir+': '+by+'em;" src="'+$.az.blank_image+'" data-src="'+data['url']+'"></div>');
					}
				}
				
				$bg_wrapper.html(cells.join(''));
			}
			
			if($after == null){
				$frame.append($bg_wrapper);
			}else{
				$after.after($bg_wrapper);
			}
			
			//[BEGIN TOOL ONLY]
			if(is_tool){
				
				if(is_show){
					$bg_wrapper.find('img').each(function(){
						$(this).attr('src', $(this).data('src'));
					})
				}
				
				$bg_wrapper.get(0).azt_data = data;
			
				var update_ = function(){
					var $this = $(this);
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					$('#aztp_bg_url').val(data.url);
					
					$('#aztp_bg_id').val(data.id);
					$('#aztp_bg_class').val(data['class']);
					$('#aztp_bg_zindex').val(data.zindex);
					
					$('#aztp_wbg_top').val(t);
					$('#aztp_wbg_left').val(l);
					$('#aztp_wbg_width').val(data['w-width']);
					$('#aztp_wbg_height').val(data['w-height']);
					
					$('#aztp_bg_top').val(data['i-top']);
					$('#aztp_bg_left').val(data['i-left']);
					$('#aztp_bg_width').val(data['i-width']);
					$('#aztp_bg_height').val(data['i-height']);
					$('#aztp_bg_size').val(data['size']);
					
					$('#bg_mode').val(data.mode);
					
					$('#aztp_rows').val(data['rows']);
					$('#aztp_cols').val(data['cols']);
					$('#aztp_grid_scripts').val(data['gs']);
					
					// Update data
					this.azt_data['w-top'] = t;
					this.azt_data['w-left'] = l;
					
					$('#aztp-tooltip').hide();
					$('#aztp-iframe').hide();
					$('#aztp-html').hide();
					$('#aztp-video').hide();
					$('#aztp-text').hide();
					$('#aztp-image').hide();
					$('#aztp-bg').show();
					
					
					$('#bg_mode').change();
				};
				
				$bg_wrapper.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				$bg_wrapper.click(update_);
				
				data.$ = $bg_wrapper;
			}
			//[END TOOL ONLY]
			return $bg_wrapper;
		},
		add_tooltip: function(data, $frame, ctx, is_tool, is_show){
			var id = 'az-tt-'+($.az.ttn++);
			var $tooltip = $('<div data-id="'+id+'" data-pos="'+data.pos+'" data-type="tooltip" data-text="'+data['text']+'" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-tooltip-wrapper az-obj az-ha '+(data['class']||'')+'" style="position: absolute; z-index: '+(data['zindex']||0)+'; top: '+(data['top']||0)+'; left: '+(data['left']||0)+';"><div class="az-tooltip-border"></div><div class="az-tooltip-center"></div></div>');
			
			$frame.append($tooltip);
			
			if(!is_tool){
				var $text = $('<div id="'+id+'" class="az-tooltip" style="max-width:'+data.width+'; display: none">'+data.text+'</div>');
				ctx.$slider.append($text);
				var size = 20;
				
				$tooltip.find('div.az-tooltip-center').hover(function(){
					$text.show();
					
					var pos = $tooltip.position();
					
					if(data.pos == 'top'){
						var tt_w = $text.outerWidth();
						var tt_h = $text.outerHeight();
						$text.css({
							top: pos.top - size - tt_h,
							left: pos.left - tt_w / 2
						});
					}else if(data.pos == 'right'){
						var tt_h = $text.outerHeight();
						$text.css({
							top: pos.top - tt_h/2,
							left: pos.left + size
						});
						
					}else if(data.pos == 'bottom'){
						var tt_w = $text.outerWidth();
						$text.css({
							top: pos.top + size,
							left: pos.left - tt_w / 2
						});
					}else if(data.pos == 'left'){
						var tt_w = $text.outerWidth();
						var tt_h = $text.outerHeight();
						$text.css({
							top: pos.top - tt_h/2,
							left: pos.left - size - tt_w
						});
					}
				}, function(){
					$text.hide();
				})
			}
			
			if(is_tool){
				// set data
				$tooltip.get(0).azt_data = data;
				
				var update_ = function(){
					var $this = $(this);
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					var opts_in_anim = $.azt_get_animation_names({
						mode: 'options',
						selected: data.in_anim
					});
					
					$('#aztp_tooltip_in_anim').html(opts_in_anim);
					
					var opts_out_anim = $.azt_get_animation_names({
						mode: 'options',
						selected: data.out_anim
					});
					
					$('#aztp_tooltip_out_anim').html(opts_out_anim);
					
					$('#aztp_tooltip_position').val(data.pos);
					$('#aztp_tooltip_width').val(data.width);
					
					// Update panel
					$('#aztp_tooltip_top').val(t);
					$('#aztp_tooltip_left').val(l);
					
					$('#aztp_tooltip_text').val(data.text);
					
					$('#aztp_tooltip_id').val(data.id);
					$('#aztp_tooltip_class').val(data['class']);
					$('#aztp_tooltip_zindex').val(data.zindex);
					
					$('#aztp-tooltip').show();
					$('#aztp-iframe').hide();
					$('#aztp-html').hide();
					$('#aztp-video').hide();
					$('#aztp-text').hide();
					$('#aztp-image').hide();
					$('#aztp-bg').hide();
					
					// Update data
					this.azt_data.top = t;
					this.azt_data.left = l;
				};
				
				$tooltip.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				
				$tooltip.click(update_);
				
				data.$ = $tooltip;
			}
			
			return $tooltip;
		},	
		add_image: function(data, $frame, ctx, is_tool, is_show){
			var trans_o = $.az.transformOrigin(data['trans_ox'], data['trans_oy']);
			var ppt = $.az.perspective(data['ppt']);
			var $image = $('<div data-type="image" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-image-wrapper az-obj az-ha '+(data['class']||'')+'" style="position: absolute; z-index: '+(data['zindex']||0)+'; top: '+(data['w-top']||0)+'; left: '+(data['w-left']||0)+';'+$.az.isnotnull(data['w-width'], ' width: '+$.az.get_object_wh(data['w-width'], ctx)+';')+$.az.isnotnull(data['w-height'], ' height: '+$.az.get_object_wh(data['w-height'], ctx) + ';')+trans_o+ppt+'"><img style="'+$.az.isnotnull(data['i-width'], 'width: ' + $.az.get_object_wh(data['i-width'] , ctx)+ ';')+' '+$.az.isnotnull(data['i-height'], 'height: ' + $.az.get_object_wh(data['i-height'], ctx) + ';')+' left: '+(data['i-left'] || 0)+'; top: '+(data['i-top']||0)+';" data-src="'+data['url']+'" src="'+$.az.blank_image+'"></div>');
			
			// set more styles
			$.az.add_more_style($image, data['more_style']);
			
			// append image object into frame (slide)
			$frame.append($image);
			
			//[BEGIN TOOL ONLY]
			if(is_tool){
				if(is_show){
					var $img = $image.find('img');
					$img.attr('src', $img.data('src'));
				}
			
				// set data
				$image.get(0).azt_data = data;
			
				var update_ = function(){
					var $this = $(this);
					var $image = $this.find('img');
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					var ip = $image.position();
					var it = $.az.px2em(ip.top, ctx);
					var il = $.az.px2em(ip.left, ctx);
					
					
					// Update panel
					$('#aztp_image_url').val(data.url);
					
					$('#aztp_image_id').val(data.id);
					$('#aztp_image_class').val(data['class']);
					$('#aztp_image_zindex').val(data.zindex);
					$('#aztp_more_image_styles').val(data.more_style);
					$('#aztp_image_transform_origin_x').val(data.trans_ox);
					$('#aztp_image_transform_origin_y').val(data.trans_oy);
					$('#aztp_image_perspective').val(data.ppt);
					
					$('#aztp_wimage_top').val(t);
					$('#aztp_wimage_left').val(l);
					
					$('#aztp_image_top').val(it);
					$('#aztp_image_left').val(il);
					
					$('#aztp_image_width').val(data['i-width']);
					$('#aztp_image_height').val(data['i-height']);
					
					$('#aztp_wimage_width').val(data['w-width']);
					$('#aztp_wimage_height').val(data['w-height']);
					
					$('#aztp-tooltip').hide();
					$('#aztp-iframe').hide();
					$('#aztp-html').hide();
					$('#aztp-video').hide();
					$('#aztp-text').hide();
					$('#aztp-image').show();
					$('#aztp-bg').hide();
					
					// Update data
					this.azt_data['w-top'] = t;
					this.azt_data['w-left'] = l;
				};
				
				$image.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				
				$image.click(update_);
				
				data.$ = $image;
			}
			//[END TOOL ONLY]
			
			return $image;
		},
		add_text: function(data, $frame, ctx, is_tool){
			var trans_o = $.az.transformOrigin(data['trans_ox'], data['trans_oy']);
			var ppt = $.az.perspective(data['ppt']);
			var $text = $('<div data-type="text" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-text-wrapper az-obj az-ha '+(data['class']||'')+'" style="position: absolute; z-index: '+(data['zindex']||0)+'; top: '+(data['top']||0)+'; left: '+(data['left']||0)+';'+$.az.isnotnull(data['bgcolor'], 'background: '+data['bgcolor']+';')+$.az.isnotnull(data['padding'], 'padding: '+data['padding']+';')+trans_o+ppt+'"><div class="az-text" style="white-space: nowrap; font-size: '+data['font_size']+';'+$.az.isnotnull(data['font_family'], 'font-family: '+data['font_family']+';')+$.az.isnotnull(data['font_weight'], 'font-weight: '+data['font_weight']+';')+$.az.isnotnull(data['color'], 'color: '+data['color']+';')+'">'+data['text']+'</div></div>');
			
			// set more styles
			$.az.add_more_style($text, data['more_style']);
			
			// append text object into frame (slide)
			$frame.append($text);
			
			//[BEGIN TOOL ONLY]
			if(is_tool){
			
				// set data
				$text.get(0).azt_data = data;
				
				var update_ = function(){
					var $this = $(this);
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					// Update panel
					$('#aztp_text_top').val(t);
					$('#aztp_text_left').val(l);
					
					$('#aztp_id').val(data.id);
					$('#aztp_class').val(data['class']);
					$('#aztp_bgcolor').val(data['bgcolor']);
					$('#aztp_zindex').val(data.zindex);
					
					$('#aztp_text_font_size').val(data.font_size);
					$('#aztp_text_font_family').val(data.font_family);
					$('#aztp_text_font_weight').val(data.font_weight);
					$('#aztp_text_color').val(data.color);
					$('#aztp_text_padding').val(data.padding);
					
					$('#aztp_more_styles').val(data.more_style);
					$('#aztp_text_transform_origin_x').val(data.trans_ox);
					$('#aztp_text_transform_origin_y').val(data.trans_oy);
					$('#aztp_text_perspective').val(data.ppt);
					
					$('#aztp-tooltip').hide();
					$('#aztp-iframe').hide();
					$('#aztp-html').hide();
					$('#aztp-video').hide();
					$('#aztp-text').show();
					$('#aztp-image').hide();
					$('#aztp-bg').hide();
					
					$('#aztp_text_content').val($this.find('>div').html());
					
					// Update data
					this.azt_data.top = t;
					this.azt_data.left = l;
					this.azt_data.text = $this.find('>div').html();
				}
				
				$text.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				
				$text.click(update_);
				
				data.$ = $text;
			}
			//[END TOOL ONLY]
			
			//$.az.convert_element_size($text, ctx);
			
			return $text;
		},
		add_video: function(data, $frame, ctx, is_tool){
			var $video = $('<div data-type="video" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-video-wrapper az-obj az-ha '+(data['class']||'')+'" style="position: absolute; z-index: '+(data['zindex']||0)+'; top: '+(data['top']||0)+'; left: '+(data['left']||0)+'; '+$.az.isnotnull(data['width'], 'width: '+$.az.get_object_wh(data['width'], ctx)+';')+$.az.isnotnull(data['height'], 'height: '+$.az.get_object_wh(data['height'], ctx)+';')+'"><video'+(data['autoplay'] == 1 ? ' autoplay="autoplay"' : '')+(data['controls'] == 1 ? ' controls="controls"' : '')+(data['loop'] == 1 ? ' loop="loop"' : '')+(data['muted'] == 1 ? ' muted="muted"' : '')+(data['preload'] == 1 ? ' preload="auto"' : '')+(data['poster'] != '' ? ' poster="'+data['poster']+'"' : '')+' style="width: 100%; height: 100%;"><source src="'+data['url']+'" type="video/mp4"></video></div>');
			
			$frame.append($video);
			
			
			//[BEGIN TOOL ONLY]
			if(is_tool){
			
				// set data
				$video.get(0).azt_data = data;
				
				var update_ = function(){
					var $this = $(this);
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					// Update panel
					$('#aztp_video_url').val(data.url);
					
					$('#aztp_video_top').val(t);
					$('#aztp_video_left').val(l);
					
					$('#aztp_video_id').val(data.id);
					$('#aztp_video_class').val(data['class']);
					$('#aztp_video_zindex').val(data.zindex);
				
					$('#aztp_video_width').val(data['width']);
					$('#aztp_video_height').val(data['height']);
					
					$('#aztp_video_autoplay').val(data['autoplay']);
					$('#aztp_video_controls').val(data['controls']);
					$('#aztp_video_loop').val(data['loop']);
					$('#aztp_video_muted').val(data['muted']);
					$('#aztp_video_preload').val(data['preload']);
					
					$('#aztp_video_poster').val(data['poster']);
					
					$('#aztp_video_transform_origin_x').val(data.trans_ox);
					$('#aztp_video_transform_origin_y').val(data.trans_oy);
					
					$('#aztp-tooltip').hide();
					$('#aztp-iframe').hide();
					$('#aztp-html').hide();
					$('#aztp-video').show();
					$('#aztp-text').hide();
					$('#aztp-image').hide();
					$('#aztp-bg').hide();
					
					// Update data
					this.azt_data.top = t;
					this.azt_data.left = l;
				}
				
				$video.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				
				$video.click(update_);
				
				data.$ = $video;
			}
			//[END TOOL ONLY]
			
			//$.az.convert_element_size($text, ctx);
			
			return $video;
		},
		add_html: function(data, $frame, ctx, is_tool){
			var $html = $('<div data-type="html" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-html-wrapper az-obj az-ha '+(data['class']||'')+'" style="position: absolute; z-index: '+(data['zindex']||0)+'; top: '+(data['top']||0)+'; left: '+(data['left']||0)+';"></div>');
			$html.append(data.html);
			
			$frame.append($html);
			
			if(is_tool){
				// set data
				$html.get(0).azt_data = data;
				
				var update_ = function(){
					var $this = $(this);
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					// Update panel
					$('#aztp_html_top').val(t);
					$('#aztp_html_left').val(l);
					
					$('#aztp_html').val(data.html);
					
					$('#aztp_html_id').val(data.id);
					$('#aztp_html_class').val(data['class']);
					$('#aztp_html_zindex').val(data.zindex);
					
					$('#aztp-tooltip').hide();
					$('#aztp-iframe').hide();
					$('#aztp-html').show();
					$('#aztp-video').hide();
					$('#aztp-text').hide();
					$('#aztp-image').hide();
					$('#aztp-bg').hide();
					
					
					// Update data
					this.azt_data.top = t;
					this.azt_data.left = l;
				}
				
				$html.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				
				$html.click(update_);
				
				data.$ = $html;
			}
			
			return $html;
		},
		add_iframe: function(data, $frame, ctx, is_tool){
			var $iframe = $('<div data-type="iframe" '+$.az.isnotnull(data['id'], 'id="'+data['id']+'"')+' class="az-iframe-wrapper az-obj az-ha '+(data['class']||'')+'" style="position: absolute; z-index: '+(data['zindex']||0)+'; top: '+(data['top']||0)+'; left: '+(data['left']||0)+';"></div>');
			$iframe.append('<iframe style="'+$.az.isnotnull(data['width'], 'width: '+$.az.get_object_wh(data['width'], ctx)+';')+$.az.isnotnull(data['height'], 'height: '+$.az.get_object_wh(data['height'], ctx)+';')+'" '+data['attrs']+' data-url="'+data['url']+'"></iframe>');
			
			$frame.append($iframe);
			
			if(is_tool){
				// set data
				$iframe.get(0).azt_data = data;
				
				var update_ = function(){
					var $this = $(this);
					ctx.$selected_object = $this;
					var p = $this.position();
					var t = $.az.px2em(p.top, ctx);
					var l = $.az.px2em(p.left, ctx);
					$this.css({
						top: t,
						left: l
					});
					
					// Update panel
					$('#aztp_iframe_top').val(t);
					$('#aztp_iframe_left').val(l);
					
					$('#aztp_iframe_url').val(data.url);
					$('#aztp_iframe_attrs').val(data.attrs);
					
					$('#aztp_iframe_width').val(data.width);
					$('#aztp_iframe_height').val(data.height);
					
					$('#aztp_iframe_id').val(data.id);
					$('#aztp_iframe_class').val(data['class']);
					$('#aztp_iframe_zindex').val(data.zindex);
					
					$('#aztp-tooltip').hide();
					$('#aztp-iframe').show();
					$('#aztp-html').hide();
					$('#aztp-video').hide();
					$('#aztp-text').hide();
					$('#aztp-image').hide();
					$('#aztp-bg').hide();
					
					
					// Update data
					this.azt_data.top = t;
					this.azt_data.left = l;
				}
				
				$iframe.draggable({
					start: function(event, ui) {
						ctx.$selected_object = $(this);
					},
					stop: update_
				});
				
				$iframe.click(update_);
				
				data.$ = $iframe;
			}
			
			return $iframe;
		},
		get_anims: function(mode, data){
			var m = mode;
			if(data && data[m]){
				if(typeof data[m].commands == 'string'){
					return [data[m].commands];	
				}else if(typeof data[m].commands == 'object'){
					return data[m].commands;		
				}
			}
			return null;
		},
		tmp_prepare: function($frame, $element, type, frame_data, obj_data, ctx){
			var i = 0, anim_id = '';
			var anim_ids = $.az.get_anims(type, obj_data);
			////console.log(anim_ids.length);
			if(anim_ids)
			for(i = 0; i < anim_ids.length; i++){
				anim_id = anim_ids[i];
				if(typeof anim_id == 'object'){
					continue;	
				}
				
				$element.each(function(index){
					////console.log('index: '  + index);
					$.az.prepare_animation(index, $(this), anim_id, ctx);
				});	
			}
		},
		prepare_all_actions: function($frame, ctx){
			var frame_data = ctx.data.actions[$frame.attr('id')];
			var cmds = frame_data['in']['commands'];
			
			for(var i in cmds){
				var cmd = cmds[i];
				if(cmd.cmd == 'prepare'){
					var action = cmd.action || 'in';
					for(var objid in frame_data['objects']){
						var obj_data = frame_data['objects'][objid];
						if(obj_data[action]){
							var $obj = $(objid, $frame);
							$obj.each(function(index){
								this.$frame = $frame;
							});
							$.az.tmp_prepare($frame, $obj, action, frame_data, obj_data, ctx);
						}
					}
				}
			}	
		},
		execute_action: function(dir, $frame, $element, type, data, ctx, $next_frame){
			/*if($frame.attr('id') == $element.attr('id')){
				alert($frame.attr('id') + ' : ' + dir + ' ' + type);
			}*/
			var i = 0, j = 0, anim_id = '', n_anim_id = '', obj_data, $obj, objid, action, obj, $t, url_, $iframe;
			var anim_ids = $.az.get_anims(type, data);
			var frame_data = ctx.data.actions[$frame.attr('id')];
			
			if(anim_ids == null) return;
			
			var f = $frame.get(0);
			/*
			if(f.total_anims == null){
				f.total_anims = 0;
			}*/
			
			var test1234 = function(index){
				this.$frame = $frame;
			};
			
			if((type == 'in' || type =='next-in' || type == 'back-in') && $frame.get(0) == $element.get(0)){
				$.az.reset_animation($frame);
				for(var l in frame_data['objects']){
					$(l, $frame).each(function(){
						$.az.reset_animation($(this));
					});
				}
			}
				
			for(i = 0; i < anim_ids.length; i++){
				anim_id = anim_ids[i];
				n_anim_id = anim_ids[i+1]; 
				
				if(typeof anim_id == 'object'){
					if(anim_id.anim_id != null){
						var tmp_anim_id = anim_id.anim_id;
					}
					
					if(anim_id.cmd == 'bring-to-front'){
						$element.css('z-index', anim_id.zindex || (ctx.opts.zindex + 1));
					}else if(anim_id.cmd == 'send-to-back'){
						$element.css('z-index', anim_id.zindex || (ctx.opts.zindex - 1));
					}else if(anim_id.cmd == 'prepare'){
						action = anim_id.action || type;
						if(anim_id.target == 'objects'){
							for(objid in data['objects']){
								obj_data = data['objects'][objid];
								if(obj_data[action]){
									////console.log('prepare ani for: ' + objid + ' action: ' + action);
									$obj = $(objid, $frame);
									$obj.each(test1234);
									$obj.get(0).is_out = false;
									$.az.tmp_prepare($frame, $obj, action, data, obj_data, ctx);
									////console.log('finish prepare ani');
								}
							}
						}else{
							objid = anim_id.target;
							obj_data = data['objects'][objid];
							if(obj_data && obj_data[action]){
								$obj = $(objid, $frame);
								$obj.each(test1234);
								$.az.tmp_prepare($frame, $obj, action, data, obj_data, ctx);
							}
						}
					}else if(anim_id.cmd == 'play-anim'){
						if(anim_id.target == '.az-info'){
							$t = $('div.' + $frame.attr('id') + '.az-info-wrapper', ctx.$slider);
							ctx.$infos.height($t.height());
						}else{
							$t = $(anim_id.target, $frame);
						}
						var element_size = $element.size();
						$t.each(function(index){
							var $this = $(this);
							if(j == 0 && (type != 'out' && type != 'next-out' && type != 'back-out')){
								$.az.prepare_animation(index, $this, anim_id.anim, ctx);
							}
							
							ctx.playing_frame[$frame.attr('id')] += 1;
							//f.total_anims++;
							
							$.az.play_animation(index, element_size, $this, anim_id.anim, ctx, 
								$.az.play_animation_callback(i, anim_id.anim, n_anim_id, type, ctx, dir, frame_data, $frame, $next_frame, index, element_size));
						});
					
						j++;
					}else if(anim_id.cmd == 'play-action'){
						action = anim_id.action || type;
						var is_out = false;
						if(action == 'out' || action == 'next-out' || action == 'back-out'){
							is_out = true;
						}
						// If this command is play all object(s) that are child of current element	
						if(anim_id.target == 'objects'){
							for(objid in data['objects']){
								obj_data = data['objects'][objid];
								if(obj_data[action]){
									$obj = $(objid, $frame);
									obj = $obj.get(0);
									if(!is_out && obj.is_out) continue;
									obj.is_out = is_out;
									
									//console.log('Play ' + action +' ' + objid);
									$.az.execute_action(dir, $frame, $obj, action, obj_data, ctx, $next_frame);
								}
							}
						}else if(anim_id.target){
							obj_data = frame_data['objects'][anim_id.target];
							if(obj_data[action]){
								$obj = $(anim_id.target, $frame);
								obj = $obj.get(0);
								if(!is_out && obj.is_out) continue;
								obj.is_out = is_out;
								
								//console.log('Play ' + action +' ' + anim_id.target);
								$.az.execute_action(dir, $frame, $obj, action, obj_data, ctx, $next_frame);
							}
						}/*else if(!anim_id.target && tmp_anim_id){
							anim_id = tmp_anim_id;
						}*/
					}else if(anim_id.cmd == 'next-frame' && $next_frame != null){
						// Goto next frame
						//console.log('--------------------------Play next frame: '+$next_frame.attr('id')+'--------------------------');
						/*
						var in_frame_data = ctx.data.actions[$next_frame.attr('id')];
						var act = in_frame_data[dir+'-in'], type;
						if(act != null && act.commands != null){
							type = dir+'-in';
						}else{
							type = 'in';
						}*/
						$.az.play_in_frame(ctx, dir, $next_frame, null);
						//$.az.execute_action(dir, $next_frame, $next_frame, type, in_frame_data, ctx);
					}else if(anim_id.cmd == 'play-slide-onclick'){
						//alert(anim_id.target);
						$(anim_id.target, $frame).data('slide', anim_id.slide).unbind('click').click(function(){
							$.az.play(ctx, $(this).data('slide'));
						});
					}else if(anim_id.cmd == 'reset-all'){
						// Reset frame and all objects of it
						/*
						$.az.reset_animation($element);
						for(var l in frame_data['objects']){
							$(l, $frame).each(function(){
								$.az.reset_animation($(this));
							});
						}*/
					}else if(anim_id.cmd == 'reset-all-when-finish'){
						/*
						if(f.finish_cmds == null){
							f.finish_cmds = [];
						}
						f.finish_cmds.push(anim_id);*/
					}else if(anim_id.cmd == 'add-class'){
						if(!anim_id.target) $t = $element; else $t = $(anim_id.target, $frame);
						$t.addClass(anim_id.class_name).data('class_', anim_id.class_name);
					}else if(anim_id.cmd == 'remove-class'){
						if(!anim_id.target) $t = $element; else $t = $(anim_id.target, $frame);
						$t.removeClass(anim_id.class_name);
					}else if(anim_id.cmd == 'play-video'){
						if(!anim_id.target) $t = $element; else $t = $(anim_id.target, $frame);
						$t.find('video').get(0).play();
					}else if(anim_id.cmd == 'pause-video'){
						if(!anim_id.target) $t = $element; else $t = $(anim_id.target, $frame);
						$t.find('video').get(0).pause();
					}else if(anim_id.cmd == 'load-iframe'){
						if($element.get(0).iframe != null){
							$element.html($element.get(0).iframe);
						}
						$iframe = $element.find('iframe');
						url_ = anim_id.url || $iframe.data('url');
						if(!anim_id.target) $t = $iframe; else $t = $(anim_id.target, $frame).find('iframe');
						$t.attr('src', url_);
					}else if(anim_id.cmd == 'unload-iframe'){
						$element.get(0).iframe = $element.html();
						
						$iframe = $element.find('iframe');
						if(!anim_id.target) $t = $iframe; else $t = $(anim_id.target, $frame).find('iframe');
						$t.remove();
					}else if(anim_id.cmd == 'enable-parallax'){
						ctx.parallax = true;	
					}else if(anim_id.cmd == 'disable-parallax'){
						ctx.parallax = false;	
					}else if(anim_id.cmd == 'set-html'){
						if(anim_id.target == '.az-info'){
							$t = $('div.' + $frame.attr('id') + ' ' + anim_id.target, ctx.$slider);
						}else{
							$t = $(anim_id.target, $frame);
						}
						$t.html(anim_id.html);
					}
					
					if(typeof anim_id == 'object'){
						continue;
					}
				}
				
				// if reach here anim_id is animation name
				
				
				var element_size = $element.size();
				
				//console.log('Play ' + anim_id + ' ' + $element.attr('class'));
				
				$element.each(function(index){
					
					ctx.playing_frame[$frame.attr('id')] += 1;
					////console.log(ctx.playing_frame);
				
					var $this = $(this);
					
					if(j == 0 && (type != 'out' && type != 'next-out' && type != 'back-out')){
						$.az.prepare_animation(index, $this, anim_id, ctx);
					}
					
					//f.total_anims++;
		
					$.az.play_animation(index, element_size, $this, anim_id, ctx, $.az.play_animation_callback(i, anim_id, n_anim_id, type, ctx, dir, frame_data, $frame, $next_frame, index, element_size));
				});//end each
			
				j++;
			}//end for
			
			//$.az.play_animation_finish(type, $frame, $next_frame, ctx);
		},
		prepare_animation: function(index, $element, anim_id, ctx){
			var element = $element.get(0);
			if(element.is_prepared == null){
				element.is_prepared = {};
			}
			if(element.is_prepared[anim_id]){
				return;
			}
			////console.log('*** Prepare Animation: ' + element.tagName + '.' + element.className + '['+index+'] (anim_id: ' + anim_id + ') ' + timer());
			
			var anim = ctx.anims[anim_id];
			for(var i in anim){
				var anim_type = anim[i];
				if($.az.anims_funcs[anim_type.type]){
					$.az.anims_funcs[anim_type.type].prepare($element, anim_type, ctx);
				}
			}
			
			element.is_prepared[anim_id] = true;
		},
		play_animation: function(index, size, $element, anim_id, ctx, callback){
			var element = $element.get(0);
			if(element.is_prepared == null){
				element.is_prepared = {};
			}
			element.is_prepared[anim_id] = false;
			
			var data = {
				duration: [],
				easing: [],
				delay: [] 
			}
			var anim = ctx.anims[anim_id], i, anim_type;
			
			if(anim == null){
				//console.log('Animation '+anim_id+' not found');
				return;
			}
			
			//alert(anim_id + " " + ctx.anims[anim_id]);
			
			for(i in anim){
				anim_type = anim[i];
				if($.az.anims_funcs[anim_type.type]){
					
					if(anim_type.duration != null){
						if(typeof anim_type.duration == 'function'){
							data.duration[i] = anim_type.duration.call(null, index, size, $element.data('ri'), $element.data('ci'), $element.data('rows'), $element.data('cols'));
						}else{
							data.duration[i] = anim_type.duration; 
						}
					}else data.duration[i] = 0;
					
					if(anim_type.easing != null){
						if(typeof anim_type.easing == 'function'){
							data.easing[i] = anim_type.easing.call(null, index, size, $element.data('ri'), $element.data('ci'), $element.data('rows'), $element.data('cols'));
						}else{
							data.easing[i] = anim_type.easing; 
						}
					}else data.easing[i] = 'snap';
					
					if(anim_type.delay != null){
						if(typeof anim_type.delay == 'function'){
							data.delay[i] = anim_type.delay.call(null, index, size, $element.data('ri'), $element.data('ci'), $element.data('rows'), $element.data('cols'));
						}else{
							data.delay[i] = anim_type.delay;
						}
					}else data.delay[i] = 0;
					
					$.az.anims_funcs[anim_type.type].stack($element, data, anim_type, ctx, data.duration[i], data.delay[i], data.easing[i], callback);
				}
			}
			

			////console.log('*** Play Animation: ' + element.tagName + '.' + element.className + '['+index+'] (aid: ' + anim_id + ', du: '+data.duration+', de: '+data.delay+') ' + timer());
			
			
			if(data.duration.length == 0) delete data.duration;
			if(data.easing.length == 0) delete data.easing;
			if(data.delay.length == 0) delete data.delay;
			
			if(ctx.data.use_css3){
				$element.transition(data, function(idx, total){
					////console.log(idx + ' :  ' + total);
					if(idx == total){
						if(callback) callback.call(null, $element)
					}
				});
			}
		},
		play_animation_callback: function(i_, aid, naid, type, ctx, dir, frame_data, $frame, $next_frame, index, element_size){
			return function($ele){
				var obj_data, $obj, $t, url_, $iframe;
				//////console.log('*** Finish Animation: ' + ($ele.attr('id') || ($ele.prop("tagName") + "." + $ele.prop("class"))) + '['+index+'/' + element_size + '] (anim_id: '+aid +', ' + (i_ + 1)+'/'+anim_ids.length+') ' + timer());	
		  		
		  		//console.log('Finish '+$ele.attr('class') + '['+$ele.index()+'] ' + aid);
		  		
		  		//var f = $frame.get(0);
				//f.total_anims--;
				var fid = $frame.attr('id');
				
				ctx.playing_frame[fid] -= 1;
				//ctx.playing_frame[fid] = Math.max(0, ctx.playing_frame[fid]);
				////console.log(ctx.playing_frame);
				
				if(typeof naid == 'object'){
					if(naid.cmd == 'play-action-after-anim'){
						// Find the object index can execute this command
						if(naid.object_index != null){
							if(naid.object_index != index){
								$.az.play_animation_finish(type, $frame, $next_frame, ctx);
								return;
							}
						}else if(index + 1 < element_size){
							$.az.play_animation_finish(type, $frame, $next_frame, ctx);
							return;
						}
						
						// Frame or object does play command:
						// Play animation(s) of other object or frame
						/*
						////console.log(($ele.attr('id') || 
							($ele.prop("tagName") + "." + $ele.prop("class"))) + 
							'['+index+'] play command['+naid.target+':'+ (naid.action == null ? type : naid.action) +', ' + (i_ + 2)+'/'+anim_ids.length+']');
						*/
						
						var action = naid.action || type;
							
						if(naid.target == 'slide' && naid.action != null){
							$.az.execute_action(dir, $frame, $frame, naid.action, ctx.data.actions[$frame.attr('id')], ctx, $next_frame);
						}else if(naid.target == 'objects'){
							for(var objid in frame_data['objects']){
								obj_data = frame_data['objects'][objid];
								if(obj_data[action]){
									$obj = $(objid, $frame);
									if($obj.get(0).is_out) continue;
									//console.log('Play after anim ' + action +' ' + objid);
									$.az.execute_action(dir, $frame, $obj, action, obj_data, ctx, $next_frame);
								}
							}
						}else  if((obj_data = frame_data['objects'][naid.target]) && obj_data[action]){ // Play a specific object(s)
							$obj = $(naid.target, $frame);
							$.az.execute_action(dir, $frame, $obj, action, obj_data, ctx, $next_frame);
						}
					}else if(naid.cmd == 'next-frame-after-anim' && $next_frame != null){
						// Reset frame and all objects of it
						/*
						$.az.reset_animation($ele);
						for(var l in frame_data['objects']){
							$(l, $frame).each(function(){
								$.az.reset_animation($(this));
							});
						}*/
						////console.log('--------------------------Play next frame: '+$next_frame.attr('id')+'--------------------------');
						//ctx.playing_frame += 1;
						// Goto next frame
						$.az.play_in_frame(ctx, dir, $next_frame, null);
						//$.az.execute_action(dir, $next_frame, $next_frame, 'Margin', ctx.data.actions[$next_frame.attr('id')], ctx);
					}else if(naid.cmd == 'reset-all-after-anim'){
						// Reset frame and all objects of it
						////console.log($ele.attr('id'));
						/*$.az.reset_animation($ele);
						for(var l in frame_data['objects']){
							$(l, $frame).each(function(){
								$.az.reset_animation($(this));
							});
						}*/
					}else if(naid.cmd == 'add-class-after-anim'){
						//console.log('Add class ' + naid.class_name + ' after anim');
						if(!naid.target) $t = $ele; else $t = $(naid.target, $frame);
						$t.addClass(naid.class_name).data('class_', naid.class_name);
					}else if(naid.cmd == 'remove-class-after-anim'){
						if(!naid.target) $t = $ele; else $t = $(naid.target, $frame);
						$t.removeClass(naid.class_name);
					}else if(naid.cmd == 'play-video-after-anim'){
						if(!naid.target) $t = $ele; else $t = $(naid.target, $frame);
						$t.find('video').get(0).play();
					}else if(naid.cmd == 'pause-video-after-anim'){
						if(!naid.target) $t = $ele; else $t = $(naid.target, $frame);
						$t.find('video').get(0).pause();
					}else if(naid.cmd == 'load-iframe-after-anim'){
						if($ele.get(0).iframe != null){
							$ele.html($ele.get(0).iframe);
						}
						$iframe = $ele.find('iframe');
						url_ = naid.url || $iframe.data('url');
						if(!naid.target) $t = $iframe; else $t = $(naid.target, $frame).find('iframe');
						$t.attr('src', url_);
					}else if(naid.cmd == 'unload-iframe-after-anim'){
						$ele.get(0).iframe = $ele.html();
						
						$iframe = $ele.find('iframe');
						if(!naid.target) $t = $iframe; else $t = $(naid.target, $frame).find('iframe');
						$t.remove();
					}else if(naid.cmd == 'set-html-after-anim'){
						if(naid.target == '.az-info'){
							$t = $('div.' + $frame.attr('id') + ' ' + naid.target, ctx.$slider);
						}else{
							$t = $(naid.target, $frame);
						}
						$t.html(naid.html);
					}else if(naid.cmd == 'stop-slide-after-anim'){
						for(var objid in frame_data['objects']){
							$(objid, $frame).stopTransition();
						}
					}
					
					i_++;
				}// end if
				$.az.play_animation_finish(type, $frame, $next_frame, ctx);
				
			}// end return
		},
		play_animation_finish: function(type, $frame, $next_frame, ctx){
			var f = $frame.get(0);
			
			//console.log('ctx.playing_frame['+$frame.attr('id')+']: ' + ctx.playing_frame[$frame.attr('id')]);
			if(ctx.playing_frame[$frame.attr('id')] == 0){
				//console.log('--------------------------End frame: '+$frame.attr('id')+', type: '+type+'--------------------------');
				
				if($frame.index() == ctx.frame_index){
					if(ctx.data.autoplay == true){
						clearTimeout(ctx.autoplay_toid);
						ctx.autoplay_toid = setTimeout(function(){
							$.az.play(ctx, 'next', true);
						}, ctx.data.autoplay_time);
					}
				}
			}
		},
		reset_animation: function($element){
			var element = $element.get(0);
			element.is_prepared = null;
			
			if($element.data('class_')){
				$element.removeClass($element.data('class_')).data('class_', '');
			}
			$element.stopTransition();
			
			////console.log('#' + $element.attr('id') + '.' + $element.attr('class'));
			
			if(element.prepare_css != null){
				for(var attr in element.prepare_css){
					for(var i = element.prepare_css[attr].length - 1; i >= 0; i--){
						var v = element.prepare_css[attr][i];
						
						////console.log("reset prepare["+i+"]: " + attr + ": " + v);
						if(attr == 'rotate' && v == 0){
							$element.css(attr, '');
						}else if(attr == 'translate' && v == 0){
							$element.css(attr, [0, 0]);
						}else if(attr == 'scale' && v == 1){
							$element.css(attr, v);
						}else{
							$element.css(attr, v);
						}
					}
					element.prepare_css[attr] = [];
				}
			}
			
			if(element.stack_css != null){
				for(var attr in element.stack_css){
					for(var i = element.stack_css[attr].length - 1; i >= 0; i--){
						var v = element.stack_css[attr][i];
						
						////console.log("reset stack["+i+"]: " + attr + ": " + v);
						if(attr == 'rotate' && v == 0){
							$element.css(attr, '');
						}else if(attr == 'translate' && v == 0){
							$element.css(attr, [0, 0]);
						}else if(attr == 'scale' && v == 1){
							$element.css(attr, v);
						}else{
							$element.css(attr, v);
						}
					}
					element.stack_css[attr] = [];
				}
			}
		},
		preload_images: function(ctx, $frame, callback, is_timeout_back){
			var frame = $frame.get(0);
			if(!frame.loaded && ((is_timeout_back && frame.is_loading) || (!is_timeout_back && !frame.is_loading))){
				frame.is_loading = true;
				var fid = $frame.attr('id');		
				if(ctx.play_to_id == null){
					ctx.play_to_id = {};
				}
						
				var flag = false;
				$frame.find('img').each(function(){
					if(!$(this).data('loaded')){
						flag = true;
						var src = $(this).data('src');
						if(src != undefined && $(this).get(0).src == $.az.blank_image){
							$(this).attr('src', src).imagesLoaded(function(){
								$.az.image_onload($(this).get(0), ctx);
							});
						}
						//console.log('Images are not loaded yet slide_id: ' + fid + ' src: ' + src + ' class: ' + $(this).attr('class'));
					}	
				});
				
				if(flag){
					if(ctx.play_to_id[fid] == null){
						ctx.play_to_id[fid] = setTimeout(function(){
							clearTimeout(ctx.play_to_id[fid]);
							ctx.play_to_id[fid] = null;
							$.az.preload_images(ctx, $frame, callback, true);
						}, 200);
					}
				}
				
				if(ctx.play_to_id != null && ctx.play_to_id[fid]) return;
				
				//if reach here, all images of frame are loaded
				frame.loaded = true;
				
				if(callback) callback.call($frame);
			}else{
				if(callback) callback.call($frame);
			}
		},
		play_in_frame: function(ctx, dir, $in_frame, $out_frame, is_timeout_back){
			if($in_frame != null && $out_frame == null){
				if(is_timeout_back && $in_frame.index() != ctx.frame_index) return;
				
				if(!$in_frame.get(0).loaded){
					$.az.preload_images(ctx, $in_frame);
					ctx.$loading.show();	
					ctx.pif_to = setTimeout(function() {
						$.az.play_in_frame(ctx, dir, $in_frame, $out_frame, true);
					}, 500);
					return;
				}
				clearTimeout(ctx.pif_to);
				ctx.$loading.hide();
				
				$in_frame.css('visibility', 'visible');
				
				//if($in_frame != null && $out_frame == null){
					ctx.playing_frame[$in_frame.attr('id')] = 0;
				
					var in_frame_data = ctx.data.actions[$in_frame.attr('id')];
					
					if(in_frame_data == null){
						////console.log('No in frame data');
						return;
					}else{
						//ctx.playing_frame += 1;
						var act = in_frame_data[dir+'-in'], type;
						if(act != null && act.commands != null){
							type = dir+'-in';
						}else{
							type = 'in';
						}
						//console.log('--------------------------Play in frame: '+$in_frame.attr('id')+'-'+type+'-------------------------');
						
						setTimeout(function(){
							$.az.execute_action(dir, $in_frame, $in_frame, type, in_frame_data, ctx);
						}, 0);
					}
				//}
			}
		},
		play_out_frame: function(ctx, dir, $in_frame, $out_frame){
			if($out_frame != null){
				//$.az.finish_commands($out_frame.get(0), ctx);
				//ctx.$previous_frame = $out_frame;
				
				$out_frame.css('visibility', 'visible');
				
				var out_frame_data = ctx.data.actions[$out_frame.attr('id')];
				if(out_frame_data == null){
					////console.log('No out frame data');
					return;
				}else{
					//ctx.playing_frame += 1;
					var act = out_frame_data[dir+'-out'], type;
					if(act != null && act.commands != null){
						type = dir+'-out';
					}else{
						type = 'out';
					}
					//console.log('--------------------------Play out frame: '+$out_frame.attr('id')+'-'+type+'--------------------------');
					setTimeout(function(){
						$.az.execute_action(dir, $out_frame, $out_frame, type, out_frame_data, ctx, $in_frame);
					}, 0);
				}
			}
		},
		play: function(ctx, dir, is_slide){
			
			if(ctx.is_swipe) return;
			
			if(ctx.autoplay_toid){
				clearTimeout(ctx.autoplay_toid);
				ctx.autoplay_toid = null;
			}
			
			var current_index, current_data_index, in_index, out_index, $in_frame, $out_frame, bullet_index;
			
			current_index = ctx.frame_index;
			
			if(typeof dir != 'string'){
				
				if(ctx.data_size > 0 && ctx.frame_size < ctx.data_size){
					//dir is data source item number
					bullet_index = dir;
					current_data_index = ctx.data_index;
					if(dir > ctx.data_index){
						in_index = ctx.frame_index + 1;
						if(in_index >= ctx.frame_size){
							in_index = 0;
						}
						ctx.data_index = dir - 1;
						dir = 'next';
					}else if(dir < ctx.data_index){
						in_index = ctx.frame_index - 1;
						if(in_index < 0){
							in_index = ctx.frame_size - 1;
						}
						ctx.data_index = dir + 1;
						dir = 'back';
					}else{
						return;
					}
					out_index = ctx.frame_index;
					ctx.frame_index = in_index;
				}else{
					//dir is physic frame number
					if(ctx.frame_index == dir) return;
					
					in_index = dir;
					out_index = ctx.frame_index;
					ctx.frame_index = in_index;
					bullet_index = in_index;
					
					if(in_index < out_index){
						dir = 'back';
					}else if(in_index > out_index){
						dir = 'next'	
					}else return;
				}
			}else{
				//dir is string
				if(dir == 'next'){
					in_index = ctx.frame_index + 1;
					out_index = ctx.frame_index;
					
					if(in_index >= ctx.frame_size){
						in_index = 0;
						out_index = ctx.frame_index;
						ctx.frame_index = -1;
					}
				
					ctx.frame_index += 1;
				}else if(dir == 'back'){
					in_index = ctx.frame_index - 1;
					out_index = ctx.frame_index;
			
					if(in_index < 0){
						in_index = ctx.frame_size - 1;
						out_index = 0;
						ctx.frame_index = in_index;
					}else{
						ctx.frame_index -= 1;
					}
				}
				
				bullet_index = in_index;
			}
			
			if(in_index == out_index) return;
			
			if(ctx.data.loop == false){
				if(ctx.data_size > 0 && ctx.frame_size < ctx.data_size){
					
				}else{
					if(dir == 'next'){
						if(in_index < out_index){
							ctx.frame_index = current_index;	
							return;
						}
					}else if(dir == 'back'){
						if(in_index > out_index){
							ctx.frame_index = current_index;
							return;
						}
					}
				}
			}
			
			ctx.parallax = false;
			
			if(ctx.data.slides_layout == 'film' && is_slide){
				var pl = ctx.$frames_holder.position()[ctx.film_p];
				var wh;
				if(ctx.film_p == 'left'){
					wh = ctx.$viewport.width() / ctx.data.film_layout_ratio;
				}else if(ctx.film_p == 'top'){
					wh = ctx.$viewport.height() / ctx.data.film_layout_ratio;
				}
			
				var v = Math.round(ctx.touch_offset / wh) * wh;
				v -= ctx.touch_offset;
				
				var dis = -(in_index - current_index) * wh;
				if(in_index > current_index){
					dir = 'next';
				}else{
					dir = 'back';
				}
				
				$.az.swipe(ctx, dis, current_index, in_index, dir);
			}
				
			////console.log('in_index: ' + in_index + ' out_index: ' + out_index);
			
			if(in_index != -1){
				$in_frame = ctx.$frames.eq(in_index);
				if($in_frame.get(0) == null){
					////console.log('Frame End');
					return;
				}
				
				$in_frame.stopTransition(true);
				ctx.$in_frame = $in_frame;
					//location.href = '#' + $in_frame.attr('id');
			}else{
				////console.log('Frame End');
				return;
			}
			
			if(out_index != -1){
				$out_frame = ctx.$frames.eq(out_index);
				$out_frame.stopTransition(true);
			}
			
			if(ctx.data_size > 0){
				if(dir == 'next') ctx.data_index++;
				else if(dir == 'back') ctx.data_index--;
				if(ctx.data_index >= ctx.data_size) ctx.data_index = 0;
				if(ctx.data_index < 0) ctx.data_index = ctx.data_size - 1;
				
				bullet_index = ctx.data_index;
				
				var i = 0;
				$in_frame.find('.az-obj').each(function(){
					var t = $(this).data('type');
					var d = ctx.data.datasource.data[ctx.data_index][i];
					if(t == 'image' && d.url != null){
						var $img = $(this).find('img');
						var img = $img.get(0);
						$img.data('loaded', 0).attr('src', $.az.blank_image).attr('src', d.url).unbind('load.imgloaded').imagesLoaded(function(){
							$.az.image_onload(img, ctx);
						});
					}else if(t == 'text' && d.text != null){
						$(this).find('.az-text').html(d.text);
						//$.az.convert_element_size($(this), ctx);
						//TODO: convert element size
					}
					i++;
				});
			}
			
			// Remove/Add class for navigation bullets
			$.az.select_nav_bullet(ctx, bullet_index);
			
			if(ctx.data.slides_layout == 'card'){
				ctx.$frames.css('visibility', '');
			}
			$.az.play_out_frame(ctx, dir, $in_frame, $out_frame);
			$.az.play_in_frame(ctx, dir, $in_frame, $out_frame);
		},
		select_nav_bullet: function(ctx, bullet_index){
			if(ctx.$nav_bullets != null && ctx.$nav_bullets.get(0)){
				ctx.$nav_bullets.get(0).$lis.removeClass('selected').eq(bullet_index).addClass('selected');
			}	
		},
		get_next_view_index: function(ctx, swipe_dir){
			var wh;
			if(ctx.film_p == 'left'){
				wh = ctx.$viewport.width() / ctx.data.film_layout_ratio;
			}else if(ctx.film_p == 'top'){
				wh = ctx.$viewport.height() / ctx.data.film_layout_ratio;
			}
			var pl = ctx.$frames_holder.position()[ctx.film_p];
			return swipe_dir == 'next' ? Math.ceil(-1 * pl / wh) : Math.floor(-1 * pl / wh);
		},
		set_in_view_frame_index: function(ctx, swipe_dir, next_view_index){
			if(next_view_index == null) next_view_index = $.az.get_next_view_index(ctx, swipe_dir);	
			var total_frame_loop = ctx.frame_size * ctx.frame_loop;
			var phys_frame_index = next_view_index - total_frame_loop;
			
			if(phys_frame_index >= 0 && phys_frame_index < ctx.frame_size){
				ctx.in_view_frame_index = phys_frame_index;
				if(ctx.in_view_frame_index < 0) ctx.in_view_frame_index = ctx.frame_size + ctx.in_view_frame_index;
				if(ctx.in_view_frame_index >= ctx.frame_size) ctx.in_view_frame_index = 0;
			}
		},
		re_position_slides: function(ctx, swipe_dir, next_view_index){
			var wh;
			if(ctx.film_p == 'left'){
				wh = ctx.$viewport.width() / ctx.data.film_layout_ratio;
			}else if(ctx.film_p == 'top'){
				wh = ctx.$viewport.height() / ctx.data.film_layout_ratio;
			}
			
			if(next_view_index == null) next_view_index = $.az.get_next_view_index(ctx, swipe_dir);	
			var total_frame_loop = ctx.frame_size * ctx.frame_loop;
			var phys_frame_index = next_view_index - total_frame_loop;
			var dis = (next_view_index * wh) * -ctx.frame_dir;
			
			
			//////console.log('vindex: ' + view_index  + ' item_index: ' +  item_index + ' s: ' + s);
			if(phys_frame_index >= 0 && swipe_dir == 'next'){
				//last >> first
				ctx.$frames.eq(phys_frame_index).css(ctx.film_p, $.az.px2em(dis, ctx)).css('visibility', 'visible');
		
				/*
				if(ctx.data.slides_partial > 1){
					dis = ((next_view_index + 1) * w) * -ctx.frame_dir;
					ctx.$frames.eq(phys_frame_index+1).css('left', $.az.px2em(dis, ctx)).css('visibility', 'visible');
				}*/
			}else if(phys_frame_index < 0 && swipe_dir == 'back'){
				//first >> last
				ctx.$frames.eq(phys_frame_index).css(ctx.film_p, $.az.px2em(dis, ctx)).css('visibility', 'visible');
				/*
				if(ctx.data.slides_partial > 1){
					dis = ((next_view_index - 1) * w) * -ctx.frame_dir;
					ctx.$frames.eq(phys_frame_index-1).css('left', $.az.px2em(dis, ctx)).css('visibility', 'visible');
				}*/
			}
			/*else if(phys_frame_index < 0 && swipe_dir == 'next'){
				//between
				alert(s);
				$f = ctx.$frames.eq(s + phys_frame_index).css('left', $.az.px2em(dis, ctx)).css('visibility', 'visible');
			}*/
			
			ctx.in_view_frame_index = phys_frame_index;
			if(ctx.in_view_frame_index < 0) ctx.in_view_frame_index = ctx.frame_size + ctx.in_view_frame_index;
			if(ctx.in_view_frame_index >= ctx.frame_size) ctx.in_view_frame_index = 0;
			//$.az.select_nav_bullet(ctx, phys_frame_index);
			
			
			////console.log(next_view_index + ' : ' + ctx.in_view_frame_index);
			
			////console.log(ctx.in_view_frame_index);
			
			if(phys_frame_index == ctx.frame_size){
				ctx.frame_loop++;
			}else if(phys_frame_index == ctx.frame_size * -1){
				ctx.frame_loop--;
			}
			
			return next_view_index;
		},
		re_position_slides_partial: function(ctx, vi){
			var wh;
			if(ctx.film_p == 'left'){
				wh = ctx.$viewport.width() / ctx.data.film_layout_ratio;
			}else if(ctx.film_p == 'top'){
				wh = ctx.$viewport.height() / ctx.data.film_layout_ratio;
			}
			
			var total_frame_loop = ctx.frame_size * ctx.frame_loop;
			var next_view_index, phys_frame_index, dis;
			
			var s = ctx.data.slides_partial - Math.ceil(ctx.data.slides_partial / 2);
			
			for(var i = 1; i <= s; i++){
				next_view_index = vi - i;
				phys_frame_index = next_view_index - total_frame_loop;
				if(phys_frame_index < 0) phys_frame_index += ctx.frame_size;
				dis = (next_view_index * wh) * -ctx.frame_dir;
				ctx.$frames.eq(phys_frame_index).css(ctx.film_p, $.az.px2em(dis, ctx));
				
				next_view_index = vi + i;
				phys_frame_index = next_view_index - total_frame_loop;
				if(phys_frame_index >= ctx.frame_size) phys_frame_index -= ctx.frame_size;
				dis = (next_view_index * wh) * -ctx.frame_dir;
				ctx.$frames.eq(phys_frame_index).css(ctx.film_p, $.az.px2em(dis, ctx));
			}
		},
		swipe: function(ctx, v, prev_frame_index, next_view_index, swipe_dir){
			var xy;
			if(ctx.film_p == 'left'){
				xy = 'x';
			}else if(ctx.film_p == 'top'){
				xy = 'y'
			}
			ctx.$frames_holder.get(0).slide = 0;
			ctx.is_swipe = true;
			ctx.$frames_holder.animate({slide: v}, {
			    step: function(now, fx) {
			    	//console.log(now);
			        ctx.$frames_holder.css(xy, $.az.px2em(ctx.touch_offset + now, ctx));
			        if(prev_frame_index != next_view_index){
			        	if(ctx.data.loop){
			        		var vi = $.az.re_position_slides(ctx, swipe_dir);
			        		$.az.re_position_slides_partial(ctx, vi);
			        	}else{
			        		$.az.set_in_view_frame_index(ctx, swipe_dir);
			        	}
			        }
			        $.az.swipe_slide_animation_step(ctx);
			    },
			    complete: function(){
			    	ctx.is_swipe = false;
			    	ctx.touch_offset = ctx.$frames_holder.position()[ctx.film_p];
			    	if(prev_frame_index != next_view_index){
			    		
			    		if(ctx.data.play_slide_when == 'completed'){
							$.az.play(ctx, next_view_index);
						}
			    		
				    	var $previous_frame = ctx.$frames.eq(prev_frame_index);
			    		var frame_data = ctx.data.actions[$previous_frame.attr('id')];
						$.az.reset_animation($previous_frame);
						for(var l in frame_data['objects']){
							$(l, $previous_frame).each(function(){
								$.az.reset_animation($(this));
							});
						}
						
						$.az.prepare_all_actions($previous_frame, ctx);
						
						$.az.execute_action(swipe_dir, $previous_frame, $previous_frame, 'swipe-complete', frame_data, ctx);
			    	}
			    },
			    duration: ctx.data.film_layout_duration,
			    easing: ctx.data.film_layout_easing
			});
		},
		swipe_slide_animation_step: function(ctx){        
			var anim = $.az.film_animations[ctx.data.film_layout_animation];
			
			if(anim){
				var data = {};
				if(ctx.film_p == 'left'){
					data.w = ctx.$viewport.width() / ctx.data.film_layout_ratio;
				}else if(ctx.film_p == 'top'){
					data.w = ctx.$viewport.height() / ctx.data.film_layout_ratio;
				}
				var pl = ctx.$frames_holder.position()[ctx.film_p];
				var fl = ctx.$frames.eq(ctx.in_view_frame_index).position()[ctx.film_p];
				data.v = pl + fl;
				
				data.prev_frame_index = ctx.in_view_frame_index - 1;
				if(data.prev_frame_index < 0) data.prev_frame_index = ctx.frame_size - 1;
				
				data.current_frame_index = ctx.in_view_frame_index;
				
				data.next_frame_index = ctx.in_view_frame_index + 1;
				if(data.next_frame_index >= ctx.frame_size) data.next_frame_index = 0;
				
				anim.step.call(null, ctx, data);
				
				////console.log(data.prev_frame_index + ' : '  + data.current_frame_index + ' : ' + data.next_frame_index);
			}
		}
	};
	
	$.fn.azslider_play = function(dir, is_slide){
		return this.each(function(){
			$.az.play(this, dir, is_slide);
			return this;	
		});
	};
	
	$.fn.azslider_init = function(opts){
		var defaults = {
			data: {},
			is_tool: false,
			custom_anims: {},
			zindex: 100,
			wait_image: true
		};
		
		if ("ontouchstart" in window || navigator.msMaxTouchPoints){
			$.az.isTouch = true;
        }else{
			$.az.isTouch = false;
        }
			
		return this.each(function(){
			var ctx = this;
			ctx.$slider = $(this);
			
			
			ctx.anims = $.extend(true, {}, $.az.anims, opts.custom_anims);
			
			//default data for slider
			defaults['data'][ctx.$slider.attr('id')] = {
				skin: 'partial-1',
				is_seo: false,
				slides_layout: 'card',
				film_dir: 'horizontal',
				film_layout_easing: 'easeOutCustom1',
				film_layout_duration: 3000,
				film_layout_animation: 'zoom',
				film_layout_ratio: 1,
				slides_partial: 1,
				slides_perspective: '100em',
				slides_trans_ox: '50%',
				slides_trans_oy: '50%',
				play_slide_when: 'released',
				is_nav_arrows: false,
				is_nav_bullets: false,
				is_nav_thumbs: false,
				autoplay: false,
				autoplay_time: 0,
				after_init: null,
				loop: false,
				use_css3: true
			};
			
			opts = $.extend(true, {}, defaults, opts);
			
			/* Variables Setup ======================================*/
			ctx.opts = opts;
			ctx.is_css3 = true;
			ctx.playing_frame = {};
			ctx.frame_index = -1;
			ctx.in_view_frame_index = 0;
			ctx.frame_size = 0;
			ctx.data = ctx.opts.data[ctx.$slider.attr('id')];
			ctx.$slider.addClass('az-slider').css({
				'font-size': '10px',
				'line-height': '1em',
				'position': 'relative'
			});
			
			
			/* Skin ========================================*/
			$.az.loadSkin(ctx.data.skin_url + ctx.data.skin + '/' + ctx.data.skin + '.css', function(){
				if(!ctx.data.is_seo){
					ctx.$slider.append('<div class="az-viewport-wrapper"><div class="az-viewport"><div class="az-frames az-ha"></div></div></div><div class="az-infos"></div>');
				}
				
				ctx.$viewport_wrapper = ctx.$slider.find('div.az-viewport-wrapper').css({
					'position': 'relative'
				});
				ctx.$viewport = ctx.$slider.find('div.az-viewport').css({
					'position': 'relative'
				});
				ctx.$frames_holder = ctx.$viewport.find('div.az-frames').css({
					'position': 'relative',
					'height': '100%'
				});
				ctx.$infos = ctx.$slider.find('div.az-infos');
				
				if(!opts.is_tool){
					if(!ctx.data.is_seo){
						if(ctx.data.is_nav_bullets == true){
							ctx.$slider.append('<ul class="az-nav-bullets clearfix"></ul>');
						}
						if(ctx.data.is_nav_arrows == true){
							ctx.$viewport_wrapper.append('<div class="az-nav-arrows"><div class="az-nav-back az-nav-arrow">Back</div><div class="az-nav-next az-nav-arrow">Next</div></div>');
						}
						ctx.$slider.append('<div class="az-loading"></div>');
					}
					
					ctx.$nav_arrows = ctx.$slider.find('div.az-nav-arrows');
					ctx.$nav_bullets = ctx.$slider.find('ul.az-nav-bullets');
				
		            ctx.$slider.hover(function(){
		            	ctx.$nav_arrows.find('.az-nav-arrow').addClass('hover');
		            }, function(){
		            	ctx.$nav_arrows.find('.az-nav-arrow').removeClass('hover');
		            });
		            
					
					/* Arrows Navigatior (Back, Next) =======================================*/
					if(ctx.$nav_arrows.get(0) != null){
						ctx.$nav_arrows.find('.az-nav-next').click(function(){
							ctx.$slider.azslider_play('next', true);	
						});
						ctx.$nav_arrows.find('.az-nav-back').click(function(){
							ctx.$slider.azslider_play('back', true);
						});
					}
				}
				ctx.$loading = ctx.$slider.find('.az-loading');
				
				/* Data Source ========================================*/
				if(ctx.data.datasource != null){
					//TODO: load data source from url
					if(ctx.data.datasource.type == 'json'){
						ctx.data_index = -1;
						ctx.data_size = ctx.data.datasource.data.length;
					}
				}
				
				/* Set Width & Height ===================================*/
				
				// Origin width, height, ratio
				ctx.alpha = 10;
				ctx.scale_factor = 0;
				
				var w = ctx.data.size.width, h = ctx.data.size.height;
				if(typeof w == 'function'){
					w = w();
				}
				if(typeof h == 'function'){
					h = h();
				}
				ctx.$viewport.css({
					width: w,
					height: $.az.px2em(h, ctx)
				});
				
				ctx.o_width = ctx.$viewport.width();
				ctx.o_height = ctx.$viewport.height();
				ctx.o_ratio = ctx.o_height / ctx.o_width;
				
				
				if(!opts.is_tool && ctx.$loading != null){
					ctx.$loading.css({
						top: $.az.px2em(h/2 - ctx.$loading.height()/2, ctx),
						left: $.az.px2em(ctx.$slider.width()/2 - ctx.$loading.width()/2, ctx)
					});
				}
				
				/* Add frames, objs to slides by js (slides) ===========================*/
				if(!ctx.data.is_seo){
					for(var slide_id in ctx.data.objects){
						//alert(slide_id);
						var objects = ctx.data.objects[slide_id];
						var trans_o = $.az.transformOrigin(ctx.data.slides_trans_ox, ctx.data.slides_trans_oy);
						var p = $.az.perspective(ctx.data.slides_perspective);
						var $frame = $('<div class="az-frame az-ha" id="'+slide_id+'" style="width: 100%; height: 100%; position: absolute;'+p+'"></div>');
						var $frame_inner = $('<div class="az-frame-inner az-ha" style="width: 100%; height: 100%; position: absolute;'+trans_o+'"></div>');
						$frame.append($frame_inner);
						
						for(var idx in objects){
							var obj = objects[idx], ctn_id, $ctn = $frame_inner;
							if(obj.zindex){
								ctn_id = 'az-ctn-' + obj.zindex;
								$ctn = $('#' + ctn_id, $frame);
								if($ctn.get(0) == null){
									$ctn = $('<div id="'+ctn_id+'" class="az-obj az-container az-parallax az-ha" data-zindex="'+obj.zindex+'" style="z-index: '+obj.zindex+'; position: absolute !important;"></div>');
									$frame_inner.append($ctn);
								}
							}
							
							if(obj.type == 'bg'){
								$.az.add_bg(obj, $ctn, ctx, opts.is_tool);
							}else if(obj.type == "text"){
								$.az.add_text(obj, $ctn, ctx, opts.is_tool);
							}else if(obj.type == 'image'){
								$.az.add_image(obj, $ctn, ctx, opts.is_tool);
							}else if(obj.type == 'video'){
								$.az.add_video(obj, $ctn, ctx, opts.is_tool);
							}else if(obj.type == 'html'){
								$.az.add_html(obj, $ctn, ctx, opts.is_tool);
							}else if(obj.type == 'iframe'){
								$.az.add_iframe(obj, $ctn, ctx, opts.is_tool);
							}else if(obj.type == 'tooltip'){
								$.az.add_tooltip(obj, $ctn, ctx, opts.is_tool);
							}
						}
						ctx.$frames_holder.append($frame);
						
						ctx.$infos.append('<div class="'+slide_id+' az-info-wrapper"><div class="az-info"></div></div>');
					}
				}
				
				if(ctx.data.after_init){
					ctx.data.after_init.call(null, ctx.$slider.html());
				}
				
				/* Get all frames */
				ctx.$frames = ctx.$viewport.find('>div.az-frames > div.az-frame');
				
				/* Object Setup =========================================*/
				ctx.$frames.find('.az-obj').not('img').each(function(){
					$.az.convert_element_size($(this), ctx);	
				});
				
				/* Sorting Frames =======================================*/
				if(ctx.data.slides_layout == 'card' || opts.is_tool){
					ctx.$slider.addClass('az-card');
					if(!opts.is_tool) ctx.$frames_holder.addClass('az-card');
					ctx.$frames.each(function(){
						$.az.convert_element_size($(this), ctx);
						ctx.frame_size += 1;
					});
				}else if(ctx.data.slides_layout == 'film'){
					ctx.$slider.addClass('az-film');
					if(ctx.data.film_dir == 'horizontal'){
						ctx.film_p = 'left';
					}else if(ctx.data.film_dir == 'vertical'){
						ctx.film_p = 'top';
					}
					ctx.$slider.addClass(ctx.data.film_dir);
						
					ctx.$frames_holder.addClass('az-film');
					
					ctx.$frames.each(function(){
						var $frame = $(this);
						$.az.convert_element_size($frame, ctx);
						
						var wh, zindex;
						if(ctx.data.film_dir == 'horizontal'){
							wh = ctx.o_width;
						}else if(ctx.data.film_dir == 'vertical'){
							wh = ctx.o_height;	
						}
						
						if($frame.index() == 0){
							zindex = ctx.opts.zindex;
						}else{
							zindex = ctx.opts.zindex - 1;
						}
						
						$frame.css(ctx.film_p, $.az.px2em(wh / ctx.data.film_layout_ratio * ctx.frame_size, ctx)).css({visibility: 'visible', 'z-index': zindex}).get(0).inner = $frame.find('.az-frame-inner');
						
						// Prepare all objects of each frame
						$.az.prepare_all_actions($frame, ctx);
								
						ctx.frame_size += 1;
					});
					
					var touch_start = 0;
					var touch_delta = 0;
					var touch = 0;
					ctx.touch_offset = 0;
					var touch_start_offset = 0;
					var touch_start_offset2 = 0;
					var swipe_dir = 0;
					ctx.frame_dir = -1;
					ctx.frame_loop = 0;
					
					ctx.$frames_holder.bind('mousedown touchstart', function(event){
						event.preventDefault();
						
						if(touch == 0){
							touch = 1;
							
							ctx.is_swipe = false;
							
							ctx.$frames_holder.stop();
							
							if(event.originalEvent.touches){
								event = event.originalEvent.touches[0];
							}
							if(ctx.film_p == 'left'){
								touch_start = event.clientX;
							}else if(ctx.film_p == 'top'){
								touch_start = event.clientY;
							}
							ctx.touch_offset = ctx.$frames_holder.position()[ctx.film_p];
							ctx.current_touch_offset = ctx.touch_offset;
						}
					});
					
					$(window).bind('mousemove touchmove', function(event){
						setTimeout(function(){
							if(touch != 0){
								event.preventDefault();
								
								start_timer();
								
								if(event.originalEvent.touches){
									event = event.originalEvent.touches[0];
								}
								if(ctx.film_p == 'left'){
									touch_delta = event.clientX - touch_start;
									touch_start = event.clientX;
								}else if(ctx.film_p == 'top'){
									touch_delta = event.clientY - touch_start;
									touch_start = event.clientY;
								}
								
								if(touch == 1 && touch_delta != 0){
									touch_start_offset = ctx.touch_offset;
									touch_start_offset2 = ctx.touch_offset;
									touch = 2;
								}
								
								var pl = ctx.$frames_holder.position()[ctx.film_p];
								////console.log('pl: ' + pl);
								
								touch_start_offset = pl;
								
								if(touch == 2){
									var tmp = touch_start_offset + touch_delta;
									
									if(tmp > touch_start_offset2){
										swipe_dir = 'back';
										touch_start_offset2 = tmp;
									}else if(tmp < touch_start_offset2){
										swipe_dir = 'next';
										touch_start_offset2 = tmp;
									}else{
										swipe_dir = '';
									}
									
									if(swipe_dir != ''){
										if(ctx.data.loop == true){
											var vi = $.az.re_position_slides(ctx, swipe_dir);
											if(ctx.data.slides_partial > 1){
												$.az.re_position_slides_partial(ctx, vi);
											}
										}else{
											$.az.set_in_view_frame_index(ctx, swipe_dir);
										}
										$.az.swipe_slide_animation_step(ctx);
									}
									
									if(ctx.data.loop == false){
										var tmp2 = 5;
										var wh;
										if(ctx.film_p == 'left'){
											wh = ctx.$viewport.width() / ctx.data.film_layout_ratio;
										}else if(ctx.film_p == 'top'){
											wh = ctx.$viewport.height() / ctx.data.film_layout_ratio;
										}
										
										var next_view_index2 = Math.floor(-1 * pl / wh);
										if(next_view_index2 < 0 || (next_view_index2 >= ctx.frame_size - 1)){
											ctx.touch_offset = touch_start_offset + touch_delta / tmp2;
										}else{
											ctx.touch_offset = touch_start_offset + touch_delta;
										}
									}else{
										ctx.touch_offset = touch_start_offset + touch_delta;
									}
									
									////console.log('touch_start_offset: ' + touch_start_offset + ' touch_delta: ' + touch_delta);
									
									var xy;
									if(ctx.film_p == 'left'){
										xy = 'x';
									}else if(ctx.film_p == 'top'){
										xy = 'y'
									}
									
									ctx.$frames_holder.css(xy, ctx.touch_offset +'px');
								}
							}
						}, 0);
					});
					
					$(window).bind('mouseup touchend', function(event){
						if(touch != 0){
							setTimeout(function(){
								touch = 0;
								var wh;
								if(ctx.film_p == 'left'){
									wh = ctx.$viewport.width() / ctx.data.film_layout_ratio;
								}else if(ctx.film_p == 'top'){
									wh = ctx.$viewport.height() / ctx.data.film_layout_ratio;
								}
								
								var pl = ctx.$frames_holder.position()[ctx.film_p];
								var next_view_index = Math.round(-1 * pl / wh) - (ctx.frame_size * ctx.frame_loop);
								var v;
								
								if(ctx.data.loop == false){
									var next_view_index2 = Math.floor(-1 * pl / wh);
									if(next_view_index2 < 0){
										v = -ctx.touch_offset;
										next_view_index = 0;
									}else if(next_view_index2 >= ctx.frame_size - 1){
										v = -wh * (ctx.frame_size-1) - ctx.touch_offset;
										next_view_index = ctx.frame_size - 1;
									}
								}
								
								if(next_view_index < 0) next_view_index += ctx.frame_size;
								
								if(v == null){
									v = Math.round(ctx.touch_offset / wh) * wh;
									v -= ctx.touch_offset;
									
									var t = end_timer();
									if(t < 10){
										if(v > 1 && swipe_dir == 'next'){
											v = -(wh - v);
											next_view_index += 1;
											if(next_view_index >= ctx.frame_size) next_view_index = 0;
										}else if(v <- 1 && swipe_dir == 'back'){
											v = (wh + v);
											next_view_index -= 1;
											if(next_view_index < 0) next_view_index = ctx.frame_size - 1;
										}
									}
									
									////console.log('v:' + v +' offset:' + ctx.touch_offset + ' next_view_index:' + next_view_index);
								}	
									
								if(ctx.data.play_slide_when == 'released'){
									$.az.play(ctx, next_view_index);
								}
								
								var prev_frame_index = ctx.frame_index;
								$.az.swipe(ctx, v, prev_frame_index, next_view_index, swipe_dir);
							}, 0);
						}
					});
				}
				
				/* Parallax =======================================*/
				var rpi = (Math.PI / 180);
				
				ctx.$viewport.bind('mousemove touchmove', function(event){
					if(ctx.parallax && !ctx.stop_parallax && !$.az.isTouch){
						setTimeout(function(){
							if(event.originalEvent.touches){
								event = event.originalEvent.touches[0];
							}
							
							var point2 = {
								x: event.clientX,
								y: event.clientY
							}
							
							var dis = lineDistance(ctx.parallax_point, point2);
							var angle = lineAngle(ctx.parallax_point, point2);
							
							$('.az-parallax', ctx.$in_frame).each(function(){
								
								var $this = $(this);
								var dis2 = dis / 500 * ($this.data('zindex') * 10);
								
								$this.css({
									x: Math.cos((180-angle) * rpi) * dis2,
									y: Math.sin((180-angle) * rpi) * dis2
								});
								/*
								$this.animate({
									x: Math.cos((180-angle) * rpi) * dis2, 
									y: Math.sin((180-angle) * rpi) * dis2
								}, {
									step: function(now, fx) {
										$this.css({
											x: $this.get(0).x,
											y: $this.get(0).y
										});
									},
									duration: 1,
									easing: 'easeInOutQuad'
								})*/
							}).stopTransition();
							
							if(ctx.start_parallax){
								ctx.start_parallax = false;
							}
						}, 0);
					}
				});
				
				ctx.$viewport.hover(function(event){
					ctx.start_parallax = true;
					ctx.stop_parallax = false;
				}, function(){
					ctx.stop_parallax = true;
					ctx.start_parallax = false;
					if(ctx.parallax && !$.az.isTouch){
						setTimeout(function(){
							//console.log($('.az-parallax', ctx.$in_frame).size());
							$('.az-parallax', ctx.$in_frame).transition({
								duration: [500],
								x: 0,
								y: 0
							});
							//console.log('nomoney');
						}, 50);
					}
				});
		            
				/* Bullets Navigatior =======================================*/
				if(ctx.$nav_bullets != null && ctx.$nav_bullets.get(0)){
					var s = ctx.data_size > 0 ? ctx.data_size : ctx.frame_size;
					for(var i = 0; i < s; i++){
						ctx.$nav_bullets.append('<li class="az-bullet idx-'+(i+1)+'" onclick="$(\'#'+ctx.id+'\').azslider_play('+i+', true)"><a href="javascript:void();">'+(i+1)+'</a></li>');
					}
					ctx.$nav_bullets.get(0).$lis = ctx.$nav_bullets.find('li');
				}
				
				/* Images Setup ==========================================*/
				/*
				ctx.$frames.find('div.az-obj img').each(function(){
					$(this).imagesLoaded(function(){
						$.az.image_onload(this, ctx);
					});
				});*/
				
				/* Window Resize ========================================*/
				ctx.$viewport.css({
					width: 'auto',
					'max-width': ctx.o_width,
					'overflow': 'hidden'
				});
				
				if(ctx.data.film_dir == 'horizontal'){
					ctx.$viewport_wrapper.css({
						'max-width': ctx.data.size.wrapper_width || ctx.o_width
					});
				}else if(ctx.data.film_dir == 'vertical'){
					ctx.$viewport_wrapper.css({
						'max-width': ctx.o_width,
						'height': ctx.data.size.wrapper_width || ''
					});
				}
				
				
				//center arrows
				if(!opts.is_tool && ctx.$nav_arrows != null){
					var $arrow = ctx.$nav_arrows.find('.az-nav-arrow');
					
					if(ctx.data.slides_layout == 'film' && ctx.data.film_dir == 'vertical'){
						ctx.$nav_arrows.addClass('vertical');
						$arrow.css({
							left: $.az.px2em(ctx.$viewport_wrapper.width()/2 - $arrow.width()/2, ctx)	
						});
					}else{
						ctx.$nav_arrows.addClass('horizontal');
						$arrow.css({
							top: $.az.px2em(h/2 - $arrow.height()/2, ctx)	
						});
					}
				}
				
				$(window).resize(function(){
					$.az.resize(ctx);
					$.az.resize(ctx);
				});
				
				$.az.resize(ctx);
				$.az.resize(ctx);
				
				if(ctx.data.slides_layout == 'film'){
					if(ctx.data.slides_partial > 1){
						if(ctx.data.loop){
							var vv = ctx.data.slides_partial - Math.ceil(ctx.data.slides_partial / 2);
							for(var i = 1; i <= vv; i++){
								$.az.re_position_slides(ctx, 'back', -i);
							}
						}
						
						var anim = $.az.film_animations[ctx.data.film_layout_animation];
						if(anim){
							anim.init(ctx);
						}
						ctx.$viewport.css('overflow', 'visible');
						
						if(ctx.data.film_dir == 'vertical'){
						 	ctx.$viewport.css('top', (parseFloat(ctx.data.size.wrapper_width, 10) / 2) - ($.az.px2em2(ctx.o_height, ctx) / 2) + 'em');
						}
					}
				}
				
				var tmp = function(){
					var next_index = this.index() + 1;
					if(next_index < ctx.frame_size){
						$.az.preload_images(ctx, ctx.$frames.eq(next_index), tmp);
					}
				};
				
				$.az.preload_images(ctx, ctx.$frames.eq(0), tmp);
				
				$.az.play(ctx, 'next');
			});//end load css file
            
				
			return this;
		});
	};
	
	// Built-in Animations
	$.az.anims = {
		'move-in-left': [
			{type: 'move', from_x: 'outside-left', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'move-in-right': [
			{type: 'move', from_x: 'outside-right', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'move-in-top': [
			{type: 'move', from_y: 'outside-top', duration: 1000, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'move-in-bottom': [
			{type: 'move', from_y: 'outside-bottom', duration: 1000, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		
		'move-out-left': [
			{type: 'move', x: 'outside-left', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'move-out-right': [
			{type: 'move', x: 'outside-right', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'move-out-top': [
			{type: 'move', y: 'outside-top', duration: 1000, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'move-out-bottom': [
			{type: 'move', y: 'outside-bottom', duration: 1000, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		
		// Short IN
		'short-in-left': [
			{type: 'move', from_x: '-width', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 0, to: 1, duration: 500, delay: function(index){return index*200}}
		],
		'short-in-right': [
			{type: 'move', from_x: 'width', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 0, to: 1, duration: 500, delay: function(index){return index*200}}
		],
		'short-in-top': [
			{type: 'move', from_y: '-height', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 0, to: 1, duration: 500, delay: function(index){return index*200}}
		],
		'short-in-bottom': [
			{type: 'move', from_y: 'height', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 0, to: 1, duration: 500, delay: function(index){return index*200}}
		],
		
		// Short OUT
		'short-out-left': [
			{type: 'move', x: '-width', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 1, to: 0, duration: 500, delay: function(index){return index*200}}
		],
		'short-out-right': [
			{type: 'move', x: 'width', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 1, to: 0, duration: 500, delay: function(index){return index*200}}
		],
		'short-out-top': [
			{type: 'move', y: '-height', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 1, to: 0, duration: 500, delay: function(index){return index*200}}
		],
		'short-out-bottom': [
			{type: 'move', y: 'height', duration: 500, easing: 'fastSlow', delay: function(index){return index*200}},
			{type: 'fade', from: 1, to: 0, duration: 500, delay: function(index){return index*200}}
		],
		
		// fade
		'fade-in': [
			{type: 'fade', from: 0, to: 1, duration: 1000, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'fade-out': [
			{type: 'fade', from: 1, to: 0, duration: 1000, easing: 'fastSlow', delay: function(index){return index*200}}
		],
		'fast-fade-out': [
			{type: 'fade', from: 1, to: 0, duration: 400, easing: 'ease', delay: function(index){return index*200}}
		]
	};
	
	$.az.anims_funcs = {
		
		// unit: em
		get_wh_val: function($element, var_, ctx){
			var ele = $element.get(0);
			
			if(var_ == 'current-x'){
				return $.az.px2em2($element.position().left, ctx) - ele.css['pos-l'];
			}else if(var_ == 'current-y'){
				return $.az.px2em2($element.position().top, ctx) - ele.css['pos-t'];
			}else if(var_ == 'height'){
				return ele.css['height'];
			}else if(var_ == '-height'){
				return -ele.css['height'];
			}else if(var_ == 'width'){
				return ele.css['width'];
			}else if(var_ == '-width'){
				return -ele.css['width'];
			}else if(var_ == 'outside-left'){
				var t = -ele.css['width'] - ele.css['pos-l'] - ele.css['padding-left'] - ele.css['padding-right'] - ele.css['margin-left'] - ele.css['margin-right'];
				//alert($element.attr('class') + ' : ' + ele.css['width']);
				return t;
			}else if(var_ == 'outside-top'){
				return -ele.css['height'] - ele.css['pos-t'] - ele.css['padding-top'] - ele.css['padding-bottom'] - ele.css['margin-top'] - ele.css['margin-bottom'];
			}else if(var_ == 'outside-right'){
				var o = ele.$frame == null ? ele : ele.$frame.get(0);
				return o.css['width'] - ele.css['pos-l']
			}else if(var_ == 'outside-bottom'){
				var o = ele.$frame == null ? ele : ele.$frame.get(0);
				return o.css['height'] - ele.css['pos-t'];
			}return var_;	
		},
		
		
		init_prepare: function(name, $element){
			if($element.get(0).prepare_css == null){
				$element.get(0).prepare_css = {};
			}
			if($element.get(0).prepare_css[name] == null){
				$element.get(0).prepare_css[name] = [];
			}
			$element.get(0).prepare_css[name].push($element.css(name));	
		},
		init_stack: function(name, $element){
			if($element.get(0).stack_css == null){
				$element.get(0).stack_css = {};
			}
			if($element.get(0).stack_css[name] == null){
				$element.get(0).stack_css[name] = [];
			}
			$element.get(0).stack_css[name].push($element.css(name));
			////console.log('stack: ' + name + ' v: ' + $element.css(name));
		},
		'move': {
			prepare: function($element, anim, ctx){
				$.az.anims_funcs.init_prepare('translate', $element);
				var tmp;
				
				if(anim.from_y != null && anim.from_x == null){
					
					tmp = $.az.anims_funcs.get_wh_val($element, anim.from_y, ctx) + 'em';
					
					if(!ctx.data.use_css3) $.Velocity.hook($element, 'translateY', tmp);
					
					$element.css({translate: [0, tmp]});
				}else if(anim.from_x != null && anim.from_y == null){
					
					tmp = $.az.anims_funcs.get_wh_val($element, anim.from_x, ctx) + 'em';
					
					if(!ctx.data.use_css3)  $.Velocity.hook($element, 'translateX', tmp);
					
					$element.css({translate: [tmp, 0]});
				}else if(anim.from_y != null && anim.from_x != null){
					
					$element.css({translate: [$.az.anims_funcs.get_wh_val($element, anim.from_x, ctx) + 'em', 
						$.az.anims_funcs.get_wh_val($element, anim.from_y, ctx) + 'em']});
				}
			},
			stack : function($element, data, anim, ctx, duration, delay, easing, callback){
				$.az.anims_funcs.init_stack('translate', $element);
				
				if(anim.y == null){
					data.y = '0em';	
				}else{
					data.y = $.az.anims_funcs.get_wh_val($element, anim.y, ctx) + 'em';
				}

				if(anim.x == null){
					data.x = '0em';
				}else{
					data.x = $.az.anims_funcs.get_wh_val($element, anim.x, ctx) + 'em';
				}
				
				if(!ctx.data.use_css3){
					$element.velocity({ 
						translateX: data.x,
						translateY: data.y
					}, { 
						duration: duration,
						delay: delay,
						easing: easing,
						queue: false
					}); 
				}
			}
		},
		'fade': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('opacity', $element);
					$element.css('opacity', anim.from == null ? 1 : anim.from);
				}
			},
			stack: function($element, data, anim, ctx, duration, delay, easing, callback){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('opacity', $element);
					data.opacity = anim.to;
					
					if(!ctx.data.use_css3){
						$element.velocity({ 
							opacity: anim.to
						}, { 
							duration: duration,
							delay: delay,
							easing: easing,
							queue: false
						}); 
					}
				}
			}
		},
		'width': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('width', $element);
					$element.css('width', anim.from == null ? 1 : anim.from);
				}
			},
			stack: function($element, data, anim, ctx){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('width', $element);
					data.width = $.az.anims_funcs.get_wh_val($element, anim.to, ctx) + 'em';
				}
			}
		},
		'height': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('height', $element);
					$element.css('height', anim.from == null ? 1 : anim.from);
				}
			},
			stack: function($element, data, anim, ctx){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('height', $element);
					data.height = $.az.anims_funcs.get_wh_val($element, anim.to, ctx) + 'em';
				}
			}
		},
		'scale': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('scale', $element);
					$element.css('scale', anim.from == null ? 1 : anim.from);
				}
			},
			stack: function($element, data, anim, ctx){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('scale', $element);
					data.scale = anim.to;
				}
			}
		},
		'skew': {
			prepare: function($element, anim, ctx){
				if(anim.from_x != null){
					$.az.anims_funcs.init_prepare('skewX', $element);
					$element.css('skewX', anim.from_x);
				}
				if(anim.from_y != null){
					$.az.anims_funcs.init_prepare('skewY', $element);
					$element.css('skewY', anim.from_y);
				}
			},
			stack: function($element, data, anim, ctx){
				if(anim.x != null){
					$.az.anims_funcs.init_stack('skewX', $element);
					data.skewX = anim.x;
				}
				if(anim.y != null){
					$.az.anims_funcs.init_stack('skewY', $element);
					data.skewY = anim.y;
				}
			}	
		},
		'rotate': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('rotate', $element);
					$element.css('rotate', anim.from == null ? 1 : anim.from);
				}
			},
			stack: function($element, data, anim, ctx, duration, delay, easing, callback){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('rotate', $element);
					data.rotate = anim.to;
				}
			}
		},
		'rotateX': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('rotateX', $element);
					$element.css({
						'perspective': anim.ppt,
						'rotateX': anim.from == null ? 1 : anim.from
					});
				}
			},
			stack: function($element, data, anim, ctx){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('rotateX', $element);
					data.perspective = anim.ppt;
					data.rotateX = anim.to;
				}
			}
		},
		'rotateY': {
			prepare: function($element, anim, ctx){
				if(anim.from != null){
					$.az.anims_funcs.init_prepare('rotateY', $element);
					$element.css({
						'perspective': anim.ppt,
						'rotateY': anim.from == null ? 1 : anim.from
					});
				}
			},
			stack: function($element, data, anim, ctx){
				if(anim.to != null){
					$.az.anims_funcs.init_stack('rotateY', $element);
					data.perspective = anim.ppt;
					data.rotateY = anim.to;
				}
			}
		}
	};//end anim funcs
	
	$.az.film_animations = {
		'zoom': {
			init: function(ctx){
				var tmp2 = 0.5;
				var i;
				
				for(i = 1; i < ctx.frame_size / 2; i++){
					ctx.$frames.eq(i).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2]
					});	
				}
				
				for(i = ctx.frame_size - 1; i > ctx.frame_size / 2; i--){
					ctx.$frames.eq(i).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2]
					});
				}
				
			},
			step: function(ctx, params){
				var tmp2 = 0.5;
				var v2 = Math.abs(params.v) * tmp2 / params.w;
				
				if(params.v >= 0){
					ctx.$frames.eq(params.prev_frame_index).get(0).inner.css({
						scale: [1-tmp2 + v2, 1-tmp2 + v2]
					});
				}else if(params.v < 0){
					ctx.$frames.eq(params.prev_frame_index).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2]
					});
				}
				ctx.$frames.eq(params.current_frame_index).get(0).inner.css({
					scale: [1 - v2, 1 - v2]
				});
				
				if(params.v <= 0){
					ctx.$frames.eq(params.next_frame_index).get(0).inner.css({
						scale: [1-tmp2 + v2, 1-tmp2 + v2]
					});
				}else if(params.v > 0){
					ctx.$frames.eq(params.next_frame_index).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2]
					});
				}
			}
		},
		'zoom-fade': {
			init: function(ctx){
				var tmp2 = 0.2;
				var tmp3 = 0.6;
				var i;
				
				for(i = 1; i < ctx.frame_size / 2; i++){
					ctx.$frames.eq(i).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2],
						opacity: [1-tmp3]
					});	
				}
				
				for(i = ctx.frame_size - 1; i > ctx.frame_size / 2; i--){
					ctx.$frames.eq(i).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2],
						opacity: [1-tmp3]
					});
				}
				
			},
			step: function(ctx, params){
				var tmp2 = 0.2;
				var tmp3 = 0.6;
				var v2 = Math.abs(params.v) * tmp2 / params.w;
				var v3 = Math.abs(params.v) * tmp3 / params.w;
				
				
				if(params.v >= 0){
					ctx.$frames.eq(params.prev_frame_index).get(0).inner.css({
						scale: [1-tmp2 + v2, 1-tmp2 + v2],
						opacity: [1-tmp3 + v3]
					});
				}else if(params.v < 0){
					ctx.$frames.eq(params.prev_frame_index).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2],
						opacity: [1-tmp3]
					});
				}
				
				ctx.$frames.eq(params.current_frame_index).get(0).inner.css({
					scale: [1 - v2, 1 - v2],
					opacity: [1 - v3]
				});
				
				if(params.v <= 0){
					ctx.$frames.eq(params.next_frame_index).get(0).inner.css({
						scale: [1-tmp2 + v2, 1-tmp2 + v2],
						opacity: [1-tmp3 + v3]
					});
				}else if(params.v > 0){
					ctx.$frames.eq(params.next_frame_index).get(0).inner.css({
						scale: [1-tmp2, 1-tmp2],
						opacity: [1-tmp3]
					});
				}
			}
		},
		'rotateY': {
			init: function(ctx){
				var tmp2 = 45;
				var tmp3 = 0.4;
				var i;
				
				for(i = 1; i < ctx.frame_size / 2; i++){
					ctx.$frames.eq(i).get(0).inner.css({
						scale: [1-tmp3, 1-tmp3],
						rotateY: -tmp2
					});	
				}
				
				for(i = ctx.frame_size - 1; i > ctx.frame_size / 2; i--){
					ctx.$frames.eq(i).get(0).inner.css({
						scale: [1-tmp3, 1-tmp3],
						rotateY: tmp2
					});	
				}
				
			},
			step: function(ctx, params){
				var $f;
				var tmp2 = 45;
				var tmp3 = 0.4;
				var tmp4 = 100;
				
				var v2 = params.v * tmp2 / params.w;
				var v3 = Math.abs(params.v) * tmp3 / params.w;
				var v4 = Math.round(Math.abs(params.v) * tmp4 / params.w);
				var vv = ctx.data.slides_partial - Math.ceil(ctx.data.slides_partial / 2), i, tmp;
				
				if(params.v >= 0){
					$f = ctx.$frames.eq(params.prev_frame_index);
					$f.get(0).inner.css({
						scale: [1-tmp3 + v3, 1-tmp3 + v3],
						rotateY: tmp2 - v2
					});
					$f.css({
						zIndex: v4
					});
				}else if(params.v < 0){
					for(i = 0; i < vv; i++){
						tmp = params.prev_frame_index - i;
						if(tmp < 0) tmp += ctx.frame_size;
						$f = ctx.$frames.eq(tmp);
						$f.get(0).inner.css({
							scale: [1-tmp3, 1-tmp3],
							rotateY: tmp2
						});
						$f.css({
							zIndex: 0
						});
					}
				}
				
				$f = ctx.$frames.eq(params.current_frame_index);
				$f.get(0).inner.css({
					scale: [1 - v3, 1 - v3],
					rotateY: -v2
				});
				$f.css({
					zIndex: tmp4 - v4
				});
				
				
				if(params.v <= 0){
					$f = ctx.$frames.eq(params.next_frame_index);
					$f.get(0).inner.css({
						scale: [1-tmp3 + v3, 1-tmp3 + v3],
						rotateY: -(tmp2 + v2)
					});
					$f.css({
						zIndex: v4
					});
				}else if(params.v > 0){
					for(i = 0; i < vv; i++){
						tmp = params.next_frame_index + i;
						if(tmp >= ctx.frame_size) tmp -= ctx.frame_size;
						$f = ctx.$frames.eq(tmp);
						$f.get(0).inner.css({
							scale: [1-tmp3, 1-tmp3],
							rotateY: -(tmp2)
						});
						$f.css({
							zIndex: 0
						});
					}
				}
				
				////console.log(params.v);
				
				////console.log(v2 + ' : ' + params.prev_frame_index + ' : ' + params.current_frame_index + ' : ' + params.next_frame_index);
			}
		}
	};
	
	var animating,
		lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame;
	
	for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
		requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
		cancelAnimationFrame = cancelAnimationFrame ||
			window[ vendors[lastTime] + "CancelAnimationFrame" ] || 
			window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
	}
	
	function raf() {
		if ( animating ) {
			requestAnimationFrame( raf );
			jQuery.fx.tick();
		}
	}
	
	if ( requestAnimationFrame ) {
		// use rAF
		window.requestAnimationFrame = requestAnimationFrame;
		window.cancelAnimationFrame = cancelAnimationFrame;
		jQuery.fx.timer = function( timer ) {
			if ( timer() && jQuery.timers.push( timer ) && !animating ) {
				animating = true;
				raf();
			}
		};
	
		jQuery.fx.stop = function() {
			animating = false;
		};
	} else {
		// polyfill
		window.requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
				id = window.setTimeout( function() {
					callback( currTime + timeToCall );
				}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	    
	}
})(jQuery);


function lineDistance(point1, point2){
	var xs = 0;
	var ys = 0;
	
	xs = point2.x - point1.x;
	xs = xs * xs;
	
	ys = point2.y - point1.y;
	ys = ys * ys;
	
	return Math.sqrt( xs + ys );
}

function lineAngle(point1, point2){
	var v = Math.atan2(-(point2.y - point1.y), (point2.x - point1.x)) * 180 / Math.PI;
	if(v < 0) v += 360;
	return v;
}

var timer_ = (new Date()).getTime();
function start_timer(){
	timer_ = (new Date()).getTime();
}
function end_timer(){
	var tmp = (new Date()).getTime();
	var result = tmp - timer_;
	timer_ = tmp;
	
	return result;
}

function roundToOne(num) {    
	//return num;
    return +(Math.round(num + "e+1")  + "e-1");
}

var custom_easing = {
	swing: function (x, t, b, c, d) {
		return jQuery.easing['easeOutQuad'](x, t, b, c, d);
	},
	easeOutCustom1: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -12 * t/d) + 1) + b;
    },
    easeOutCustom2: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -18 * t/d) + 1) + b;
    },
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};jQuery.extend(jQuery.easing, custom_easing);



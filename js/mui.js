var MUI = function (path, style) {

	return {
		onReady: function (fn) {
			
			$('<link />')
				.attr('rel', 'stylesheet')
				.attr('type', 'text/css')
				.attr('href', path+'/base.css')
				.appendTo('head')
				.load(function () {
					css = $('<link />')
					.attr('rel', 'stylesheet')
					.attr('type', 'text/css')
					.attr('href', path+'/'+style)
					.appendTo('head')
					.load(fn || false);
				});
		},
		viewPort: function (options) {

			if( ! options) options = {};

			options = jQuery.extend({
				ele: document.body
			}, options);
			
			var ele = jQuery('<div class="viewport"></div>').appendTo(jQuery(options.ele));
			this.parent = ele;

			var adjustLayout = function () {
				var header = ele.children('.header');
				var footer = ele.children('.footer');
				var body = ele.children('.body');
				
				var header_height = header.outerHeight();
				var footer_height = footer.outerHeight();

				// console.log(ele.outerHeight() - (header_height + footer_height), header_height, footer_height)

				body.css({
					'height'			:	ele.outerHeight() - (header_height + footer_height),
					'margin-top'		:	header_height,
					'margin-bottom'		:	footer_height
				});
			}
			
			$(window).resize(adjustLayout);

			return {
				ele: ele,
				
				adjustLayout: adjustLayout,
				
				header: function () {
					var ele = jQuery('<div class="header"><div class="heading"></div></div>').appendTo(this.ele).on('update', this.adjustLayout).trigger('update');
					
					return {
						ele: ele,
						setTitle: function (heading) {
							this.ele.children('.heading').html(heading);
							this.ele.trigger('update');
							return this;
						},
						attach: function (object) {
							object.ele.appendTo(this.ele);
							this.ele.trigger('update');
							return this;
						},
						setHeight: function (height) {
							this.ele.css('height', height).trigger('update');
							return this;
						}
					}
				},

				body: function () {

					var ele = jQuery('<div class="body"></div>').appendTo(this.ele).on('update', this.adjustLayout).trigger('update');
					//ele.trigger('update');
					
					return {
						ele: ele,
						setContent: function (content, callback) {
							this.ele.html(content);
							if(callback)
								callback.apply(this);
							return this;
						}
					}
				},

				footer: function () {
					var ele = jQuery('<div class="footer"></div>').appendTo(this.ele).on('update', this.adjustLayout).trigger('update');

					return {
						ele: ele,
						attach: function (object) {
							ele = object.ele.appendTo(this.ele);
							this.ele.trigger('update');
							return this;
						},
						setHeight: function (height) {
							this.ele.css('height', height).trigger('update');
						}
					}
				}

			};

		},
				
		icon: function (options) {
			// TODO
		},

		button: function (options) {

			if( ! options) options = {};

			var ele = jQuery('<a class="button '+(options.position || 'left')+' '+(options.className || 'none')+'"></a>');

			return {
				ele: ele,
				setTitle: function (heading) {
					this.ele.html(heading);
					return this;
				},
				click: function (fn) {
					this.ele.click(fn);
					return this;
				},
				addClass: function (className) {
					this.ele.addClass(className);
					return this;
				},
				setPosition: function (position) {
					this.ele.removeClass('left').removeClass('right').addClass(position);
					return this;
				},
				show: function () {
					this.ele.show();
					return this;
				},
				hide: function () {
					this.ele.hide();
					return this;
				}
			}
		},

		tabs: function () {
			var ele = jQuery('<ul class="tabs"></ul>');

			return {
				ele: ele,
				add: function (title, options) {
					if( ! options) options = {};
					
					var parent = this.ele;
					
					$('<li><div class="inner">'+title+'</div></li>').click(options.click || false).appendTo(this.ele).click(function () {
						parent.children('li').removeClass('current');
						$(this).addClass('current');
					});

					this.ele.children().each(function () {
						$(this).css('width', 100 / parent.children().length+'%');
					});

					return this;
				},
				hook: function (slide) {
					var anc = this.ele.children('li');
					var target = slide.children('ul');
					
					anc.eq(0).addClass('current');

					anc.each(function (index, ele) {
						$(this).click(function () {

							if(target.children('li').eq(index).get(0)) {
								var ml = target.children('li').eq(index).width() * index;

								target.animate({
									'margin-left': -(ml)
								}, {
									duration: 'fast',
									complete: function () {

									}
								});
							}

						})
					});
				}
			}
		},

		slides: function () {

			var ele = jQuery('<div class="slides"><ul></ul></div>');

			if(this.parent)
				ele.hide().appendTo(this.parent)

			return {
				ele: ele,
				current: 0,
				add: function (content, options, return_item) {
					if( ! options) options = {};
					
					var item = $('<li />').html(content).appendTo(this.ele.children('ul'));

					var parent_width = this.ele.parent().width();
					var ul = this.ele.children('ul');
					var lis = ul.children('li');

					ul.css('width', parent_width * lis.length)
					lis.css('width', parent_width);//.not(':first-child').hide();
					
					if(return_item)
						return item;
					else
						return this;
				},
				get: function () {
					return this.ele.show();
				},
				_moveTo: function (index) {
					index--;

					target = this.ele.children('ul');

					if(target.children('li').eq(index).get(0)) {
						this.current = index;
						var ml = target.children('li').eq(index).width() * index;

						target.animate({
							'margin-left': -(ml)
						}, {
							duration: 'fast',
							complete: function () {
							}
						});
					}
				},
				moveTo: function (index, reverse) {
					index--;

					var target = this.ele.children('ul');
					var target_children = target.children('li');
					var ml = target_children.eq(index).width() * 1;

					target_children.hide();
					target_children.eq(index).show();
					target_children.eq(this.current).show();

					//console.log(index, this.current);

					var prop = [], direction;
					if(reverse) {
						target.css('margin-left', -(ml));
						direction = 'margin-left';
						prop['margin-left'] = 0;
					} else {
						direction = 'margin-left';
						prop['margin-left'] = -(ml);
					}
					
					
					var thisProxy = this;
					target.animate(prop, {
						duration: 'fast',
						complete: function () {
							target_children.eq(thisProxy.current).hide();
							thisProxy.current = index;
							target.css(direction, 0);
						}
					});

					return this;
				}
			}
		},

		list: function (header, options) {
			
			var back_button = false;
			var tpl = '<div class="list"><ul></ul></div>';
			var slide = this.slides();
			var ele = jQuery(tpl);
			slide.add(ele);

			if( ! options) options = {};

			if(header) {
				back_button = this.button().setTitle(options.btn_title || 'Back');
				header.attach(back_button.hide());

				back_button.click(function () {

					var parent_index = slide.ele.children('ul').children('li').eq(slide.current).data('parent');
					slide.moveTo(parent_index + 1, true)
					
					console.log(parent_index)
					if(parent_index < 1)
						back_button.hide();
				});
			}
			
			return {
				ele: ele,
				tpl: tpl,
				slide: slide,
				back_button: back_button,

				bind: function (data, fn) {
					
					// TODO

					return this;
				},
				add: function (content, options, parent) {
					if( ! options) options = {};
					
					var item = $('<li />').html(content).click(options.click || false);

					if(parent) {

						var parent_ele;
						var slide_ele;

						if( ! parent.data('slided'))
						{
							parent_ele = $(this.tpl);
							slide_ele = this.slide.add(parent_ele, {}, true);
							parent.data('slided', '1')
							parent.data('slide_ele', slide_ele)
							parent.data('child', this.slide.ele.children('ul').children('li').index(slide_ele));

							//console.log(slide_ele, parent.parent().parent().parent());
							//console.log();
							
							slide_ele.data('parent', this.slide.ele.children('ul').children('li').index(parent.parent().parent().parent()));

							var slideProxy = this.slide;
							var thisProxy = this;
							
							parent.addClass('parent').click(function () {
								if(thisProxy.back_button)
									thisProxy.back_button.show();
								slideProxy.moveTo($(this).data('child') + 1);
								//console.log(slideProxy.current);
							}).append('<span class="arrow">&raquo;</span>');
						}
						else
							slide_ele = parent.data('slide_ele');


						item.appendTo(slide_ele.children('div.list').children('ul'));
					}
					else
					{
						item.appendTo(this.ele.children('ul'));
					}
					
					return item;
				},
				html: function () {
					return this.ele;
				},
				get: function () {

					return this.slide.get();
				}
			}
		},

		form: function (heading) {
			ele = jQuery('<form class="form"></form>').submit(function (e) { e.preventDefault(); });
			if(heading)
				ele.append('<h2>'+heading+'</h2>')

			return {
				ele: ele,

				submit: function (fn) {
					if(fn)
						fn.apply(this.ele);

					return this;
				},

				get: function () {
					return this.ele;
				},

				fieldSet: function (label, input, options) {
					if( ! options) options = {};

					ele = jQuery('<fieldset />').addClass(options.className || '')

					if(options.fieldset)
						ele.appendTo(options.fieldset);
					else
						ele.appendTo(this.ele);

					if(label)
						ele.append(label);

					if(input)
						ele.append(input);

					return ele;
				},

				label: function (title, options) {
					if( ! options) options = {};

					ele = jQuery('<label class="label '+(title || '')+'" for="'+ (options.id || '') +'">'+title+'</label>');

					if(options.fieldset)
						ele.appendTo(options.fieldset);

					return ele;
				},

				field: function (name, options) {

					if( ! options) options = {};

					ele = jQuery('<input type="'+(options.type || 'text')+'" id="'+(options.id || '')+'" name="'+name+'" value="'+(options.value || '')+'" class="input '+(options.type || 'text')+' '+ (options.className || '') +'" />');

					if(options.fieldset)
						ele.appendTo(options.fieldset);

					return ele;
				},

				hiddenField: function (name, options) {

					options = jQuery.extend({
						type: 'hidden'
					}, options || {});

					return this.field(name, options);
				},

				textField: function (name, options) {

					options = jQuery.extend({
						type: 'text'
					}, options || {});

					return this.field(name, options);
				},

				passField: function (name, options) {

					options = jQuery.extend({
						type: 'password'
					}, options || {});
					
					return this.field(name, options);
				},

				checkBox: function (name, options) {

					options = jQuery.extend({
						type: 'checkbox'
					}, options || {});
					
					return this.field(name, options);
				},

				selectBox: function (name, options, selected) {

					if( ! options) options = {};

					ele = jQuery('<select name="'+name+'" class="input select '+ (options.className || '') +'"></select>');

					jQuery.each(options, function (key, value) {
						jQuery('<option value="'+key+'"'+((key == selected) ? 'selected="selected"' : '')+'>'+value+'</option>').appendTo(ele);
					});

					if(options.fieldset)
						ele.appendTo(options.fieldset);

					return ele;
				},

				button: function (name, options) {
					options = jQuery.extend({
						type: 'button'
					}, options || {});
					
					return this.field(name, options);
				}
			}
		}
	}

}
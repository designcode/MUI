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
							return this;
						},
						attach: function (object) {
							object.ele.appendTo(this.ele);
							return this;
						},
						setHeight: function (height) {
							this.ele.css('height', height).trigger('update');
							return this;
						}
					}
				},

				body: function () {

					var ele = jQuery('<div class="body"></div>').appendTo(this.ele);
					
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

			ele = jQuery('<a class="button '+(options.position || 'left')+' '+(options.class || 'none')+'"></a>');

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
				addClass: function (klass) {
					this.ele.addClass(klass);
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
			ele = jQuery('<ul class="tabs"></ul>');

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

			ele = jQuery('<div class="slides"><ul></ul></div>');

			if(this.parent)
				ele.hide().appendTo(this.parent)

			return {
				ele: ele,
				add: function (title, options) {
					if( ! options) options = {};
					$('<li />').html(title).appendTo(this.ele.children('ul'));
					return this;
				},
				get: function () {
					var parent_width = this.ele.parent().width();
					var ul = this.ele.children('ul');
					var lis = ul.children('li');

					ul.css('width', parent_width * lis.length)
					lis.css('width', parent_width);//.not(':first-child').hide();
					
					return this.ele.show();
				},
				moveTo: function (index) {
					index--;

					target = this.ele.children('ul');

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
				},
				_moveTo: function (index, current_index, reverse) {

					var target = this.ele.children('ul');
					var target_children = target.children('li');
					var ml = target_children.eq(index).width() * 1;
					
					if( ! current_index)
						current_index = 0;
					
					target_children.not(':eq('+index+')').not(':eq('+current_index+')').hide();
					target_children.eq(index).show();
					target_children.eq(current_index).show();
					

					var prop = [], direction;
					if(reverse) {
						target.css('margin-left', -(ml));
						direction = 'margin-left';
						prop['margin-left'] = 0;
					} else {
						direction = 'margin-left';
						prop['margin-left'] = -(ml);
					}
					
					
					target.animate(prop, {
						duration: 'fast',
						complete: function () {
							target_children.eq(current_index).hide();
							target.css(direction, 0);
						}
					});

					return this;
				}
			}
		},

		list: function () {
			
			ele = jQuery('<div class="list"><ul></ul></div>');

			return {
				ele: ele,
				slides: this.slides,
				parent: this.parent,
				button: this.button,

				bind: function (data, fn) {
					
					// TODO

					return this;
				},
				add: function (content, options, child) {
					if( ! options) options = {};
					
					item = $('<li />').html(content).click(options.click || false).appendTo(this.ele.children('ul'));
					
					if(child)
						item.append(child);
					
					return this;
				},
				html: function () {
					return this.ele;
				},
				get: function (header, options) {

					if( ! options) options = {};

					var slides = this.slides();
					var index = [];
					var current_index = 0;
					var previous_index = 0;

					if(header) {
						var back_button = this.button().setTitle(options.btn_title || 'Back');
						header.attach(back_button.hide());
					}


					slides.add(this.ele.get(0));

					this.ele.find('div.list > ul').each(function (i) {
						var parent = $(this).parent();

						parent.parent().addClass('parent').click(function () {
							slides._moveTo(i + 1, current_index);
							previous_index = current_index;
							current_index = i + 1;
							index[current_index] = previous_index;

							if(current_index > 0)
								back_button.show();
								
						}).append('<span class="arrow">&raquo;</span>');

						slides.add(parent.detach());
					});


					if(header) {
						back_button.click(function () {
							slides._moveTo(previous_index, current_index, true);
							
							current_index = previous_index;
							previous_index = index[current_index];
							
							if(current_index < 1)
								back_button.hide();
						});
					}

					return slides.get();
				}
			}
		}
	}

}
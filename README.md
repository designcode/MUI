# MUI
MUI (Mobile UI) is a JavaScript library to easily make UIs for Mobile Devices.

## Overview
There are already comprehensive libraries like jQuery mobile and Sencha Touch, so why another library? This library is written for designers and keeps the design layer totally separate from code.

## Getting Started
MUI comes with base.css, this is the file where the structure of elements is defined. You play with look and feel of the UI in your separate CSS file. MUI uses jQuery for DOM manipulation. You must include latest copy of jQuery in your html.

## Usage
First you must include jquery and mui.js in your html

	<script type="text/javascript" src="js/jquery-latest.js"></script>
	<script type="text/javascript" src="js/mui.js"></script>

### Initializing
	ui = new MUI(PATHTOCSS, YOURCSSFILE);
**PATHTOCSS** is the path where you have put **base.css** and your css file. **YOURCSSFILE** is the css file where you have made look and feel changes. MUI loads css files dynamically so you must wait until loading is completed before doing any operation. MUI comes with onReady method.

	ui = new MUI('css', 'ios.css');
	ui.onReady(function () {
		// Lets build some mobile ui here
		// All the example code below, that needs to be put within this function
	});

### Viewport
Viewport is a rectangle that touches the corner of your browser/mobile screen or the element provided in parameter. All the elements are encapsulate within viewport.

	viewport = ui.viewPort();
Attach viewport to an existing element in document

	viewport = ui.viewPort({
		ele: '#iphone'
	});

### Header, Body and Footer
**Viewport** have three components: header, body and footer. Each components have its methods and properties. Let's take a look at each one.

#### Header ####
	header = viewport.header() // Creates new header
	header.setTitle('MyTitle') // Set the title of title
	header.setHeight(100) // Set the height of header
	header.attach(someButton) // Attach a UI element to header
	// OR
	header = viewport.header().setTitle('MyTitle').setHeight(100).attach(someButton)

#### Body ####
	body = viewport.body() // Creates new body
	body.setContent(text, function () {
		// This is called when the content is set
		console.log(this.ele.get(0))
	}); // Set the content (html etc) of body

#### Footer ####
	footer = viewport.footer() // Creates new footer
	footer.setHeight(100) // Set the height of footer
	footer.attach(someButton) // Attach a UI element to footer

### Other UI Elements
MUI comes with following UI elements. Please note that header, footer, body and all the UI elements support method chainability.

#### Button ####
	btn = ui.button(); // Creates new button
	btn.setTitle('Help') // Set button title
	btn.setPosition('right') // Set button position
	btn.click(function () {
		console.log(arguments, 'clicked 2');
	}); // What happens when button is clicked

	header.attach(btn) // Attach the button we just created to header

#### Form Elements ####
	form = ui.form('Jump In'); // Creates new form and set heading to "Jump In"
	form.fieldSet(form.label('Nick'), form.textField('nick', {id: 'nick'})); // Create a new fieldset with label and a text field
	form.fieldSet(form.label('Nick'), form.seletBox('country', {id: 'country_list'}, 'Pakistan')); // Create a new fieldset with label and a select box (with Pakistan as selected country)

#### Lists ####
	list = ui.list(); // Creates new list
	l1 = list.add('ITEM 1') // Adds new item "ITEM 1" in list
	l2 = list.add('ITEM 2', {
		click: function () {
			console.log(this);
		}
	}); // Adds new item "ITEM 2" in list, also attach onclick handler to that item

	list.add('ITEM 2.1', {}, l2) // Adds new item "ITEM 2.1" as child of ITEM 2 in list
	list_html = list.html() // Gets the HTML of list we prepared above
	list_object = list.get() // Gets the list object we prepared above

#### Slides ####
Slides are basically segments of page, only one visible at a time.
	
	slides = ui.slides(); // Creates new slide
	slides.add('Slide 1') // Adds new slide
	slides.add('Slide 2') // Adds new slide
	slides.add('Slide 3') // Adds new slide
	slides.moveTo(2) // Makes the 2nd slide appear on screen
	slide_object = slides.get(); // Gets the slide object we prepared above

#### Tabs ####
	tabs = ui.tabs(); // Creates new tab
	tabs.add('Tab 1', {
		click: function () {
			console.log('Tab 1 Clicked');
		}
	}) // Adding more tab and attaching onclick handler to that tab
	tabs.add('Tab 2').add('Tab 3').add('Tab 4').add('Tab 5').add('Tab 6'); // Adding more tabs

	tabs.hook(slides.get()) // Hooking the slides with tabs, so clicking the tabs will change the slides

## TODO
Icons, List Binding and apparently a lot :)
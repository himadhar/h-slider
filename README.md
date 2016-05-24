# H Slider

H Slider - A jQuery based plugin built to provide a carousel / slider controls to the detailed level. The slider has elementary methods and actions to allow you a fully customized access on all features of a carausel. The plugin now works at the basic level and I will improvise as time permits and incorporate your feedbacks/suggestions.

This slider is designed to provide - right from a auto scrolling carousel to a independent pagination controls, is part of this plugin and the end goal is to make even lightweight while still retain its power to render accurate and customizable controls. You can include by simply adding this line in your project with the right path:
<br/>
<code>`<script src='js/hslider.min.js'></script>`</code>

###Below are some params I have now implemented and you can use it based on your custom needs.

####basic
    slideSpeed: 3000, //sliding pauses for slideSpeed value, in milliseconds
    transitionSpeed: 500, //sliding transition speed at which the transition happens, in milliseconds
    autoSlide: true, //set as true if sliding is to begin on load
    slidesOnView: 2, //set a value to show the number of slides in current view
    shiftSlides: 2, //shift the number of slides per carousel shift
    scrollDirection: 'right', // direction of the scroll to happen
    height: 350, //set the height as required
    width: 600, //set the width as required
    currentSlide: 0, // current slide index
    transitionStyle: 'slide', //currently animations added - ["fade", "slide"]

####data
    imagesArrayProvided: false, //set true if you pass the images src through an array for hslider to build, if false, picks the ul-li structure from the parentTagClass info provided
    imagesArray: [], //array of images to be rendered in the container
    showThumbnails: false, //set true if thumbnails are required
    captionNeeded: false, //set as true if a section dedicated to captions is required
    captionContentList: [], //array of strings of HTML  or normal text to be added as caption

####controls
    controls: true, //set as true if visual controls for next and previous slides are required
    pauseSlideOnHover: true, //pause slide when mouse hover occurs on the slide
    pauseButtonNeeded: true, //set as true if you need a button to pause the slider until required
    pausePlayButtonElement: 'a', //the tag used as the pause button element,
    pauseButtonText: 'Pause', //set the text value as required when pausing is required
    playButtonText: 'Play', //set the text value as required when playing is required

####containers
    parentTag: 'div', //the parent tag under the each LI tag
    parentTagClass: 'parent-container', //class for the parent tag
    captionContainerClass: 'captions-container', //class of the captions container added in the list
    prevButtonClass: 'prevButton', //customize the class you want for the previous button to handle its css
    nextButtonClass: 'nextButton', //customize the class you want for the next button to handle its css

####methods
    onSlideLoad: function () {}, //method called on load of the slides
    beforeSlideShift: function () {}, //method called before each slide shift
    afterSlideShift: function () {}, //method called after each slice shift
    previousSlideShift: function () {}, //method called for previous button click
    nextSlideShift: function () {}, //method called for next button click,
    resizeSlideShift: function () {}, //method to handle resize of the window
    thumbnailClick: function () {} //method to handle thumbnail clicks
    
You can message me anything that you feel is necessary in this plugin and I will work on it and upload as part of updates.

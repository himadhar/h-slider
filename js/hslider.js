/*!
 * H-Slider is a jQuery Based Plugin
 *
 * Author: Himadhar H
 * github: https://github.com/himadhar/h-slider
 *
 * Date: 2016-05-24T12:59Z
 */
 
/*globals jQuery:false */
(function ($) {
    'use strict';
    $.fn.hslider = function (options) {
        //variables needed to execute the below logic
        options = $.extend({
            //basic
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

            // data
            imagesArrayProvided: false, //set true if you pass the images src through an array for hslider to build, if false, picks the ul-li structure from the parentTagClass info provided
            imagesArray: [], //array of images to be rendered in the container
            showThumbnails: false, //set true if thumbnails are required
            captionNeeded: false, //set as true if a section dedicated to captions is required
            captionContentList: [], //array of strings of HTML  or normal text to be added as caption

            //controls
            controls: true, //set as true if visual controls for next and previous slides are required
            pauseSlideOnHover: true, //pause slide when mouse hover occurs on the slide
            pauseButtonNeeded: true, //set as true if you need a button to pause the slider until required
            pausePlayButtonElement: 'a', //the tag used as the pause button element,
            pauseButtonText: 'Pause', //set the text value as required when pausing is required
            playButtonText: 'Play', //set the text value as required when playing is required

            //containers
            parentTag: 'div', //the parent tag under the each LI tag
            parentTagClass: 'parent-container', //class for the parent tag
            captionContainerClass: 'captions-container', //class of the captions container added in the list
            prevButtonClass: 'prevButton', //customize the class you want for the previous button to handle its css
            nextButtonClass: 'nextButton', //customize the class you want for the next button to handle its css

            //methods
            onSlideLoad: function () {}, //method called on load of the slides
            beforeSlideShift: function () {}, //method called before each slide shift
            afterSlideShift: function () {}, //method called after each slice shift
            previousSlideShift: function () {}, //method called for previous button click
            nextSlideShift: function () {}, //method called for next button click,
            resizeSlideShift: function () {}, //method to handle resize of the window
            thumbnailClick: function () {} //method to handle thumbnail clicks
        }, options);

        // slider rendering method below
        var buildSlider = function () {
            //build the slider based on imagesArrayProvided flag
            if (this.length === 0) return this;
            //necessary variables
            var currentContainer = this;
            var liStartTag = options.parentTag;
            var liStartTagClass = options.parentTagClass;
            var ulClass = 'hslider-parent-container';
            var eachThumbnailSlideWidth = 0;
            // shouldResetSlide: to know if its a single slide per screen based or multiple slides per page
            var shouldResetSlide = (options.slidesOnView == 1) ? true : false;
            var thumbnailClickTriggered = false;
            var selectedThumbnailIndex = 0;
            var thumbnailClickDirection = '';

            options.slideInterval = ''; // the timer event tagged for action
            options.slideValue = 0; //used for sliding each time
            options.totalSlides = 0; //used to track the total slides available during the entire functionality
            options.manuallyPaused = true; //updates with current pause status of the carousel when its manual

            // begin the plugin action
            init();

            function init() {
                buildSliderView(); //function to build structure if it already doesn't exist
                buildThumbnails();
                buildCaptionsList();
                setRequestedStyles();
                if (options.autoSlide) {
                    beginSlides();
                }
                if (options.pauseButtonNeeded) {
                    buildPauseButtonContent();
                }
                bindFunctions();
            }

            // function to bind the events to values
            function bindFunctions() {
                if (options.controls) {
                    $('.' + options.prevButtonClass).off().on('click', previousSlideShift);
                    $('.' + options.nextButtonClass).off().on('click', nextSlideShift);
                }
                $('window').on('resize', resizeSlideShift);
                if (options.pauseSlideOnHover && !options.manuallyPaused) {
                    $(currentContainer).off().on('mouseenter', pauseOnMouseEnter);
                    $(currentContainer).on('mouseleave', playOnMouseOut);
                }
                if (options.pauseButtonNeeded) {
                    $('.slider-controller').off().on('click', manualPlayPauseController);
                }
            }

            //function to build the parent UL LI structure for rendering the carousel list
            function buildSliderView() {
                var btns = '';
                if (options.imagesArrayProvided && checkValid(options.imagesArray, 'array')) {
                    var parentUL = '<ul class="' + ulClass + '">';
                    var tempIndex = 0;
                    for (var i = 0; i < options.imagesArray.length; i++) {
                        if (i === 0 && options.slidesOnView == 1) {
                            // adding pseudo elements to keep the transition smooth
                            parentUL += '<li class="hslide" id="hslide-first">' +
                                '<' + liStartTag + ' class="' + liStartTagClass + '"><img src="' +
                                options.imagesArray[options.imagesArray.length - 1] + '">' +
                                '</' + liStartTag + '></li>';
                        }
                        var childLI = '<li class="hslide" id="hslide' + (tempIndex + 1) + '">' + '<' + liStartTag + ' class="' + liStartTagClass + '"><img src="' +
                            options.imagesArray[i] + '">' +
                            '</' + liStartTag + '></li>';
                        parentUL += childLI;
                        tempIndex++;
                        if (i == options.imagesArray.length - 1 && options.slidesOnView == 1) {
                            // adding pseudo elements to keep the transition smooth
                            parentUL += '<li class="hslide" id="hslide-last">' +
                                '<' + liStartTag + ' class="' + liStartTagClass + '"><img src="' +
                                options.imagesArray[0] + '">' +
                                '</' + liStartTag + '></li>';
                        }
                    }
                    parentUL += '</ul>';
                    $(currentContainer).empty().append(parentUL); //build the UL structure and append to the selector
                    btns = '<span class="' + options.prevButtonClass + '"><i class="fa fa-chevron-left fa-1x"></i></span>' +
                        '<span class="' + options.nextButtonClass + '"><i class="fa fa-chevron-right fa-1x"></i></span>';
                    $(currentContainer).append(btns);
                    options.totalSlides = options.imagesArray.length;
                } else {
                    options.totalSlides = $('ul.' + ulClass + ' li').length;
                    // add first and last slide for transition purpose
                    if (options.slidesOnView == 1) {
                        for (var j = 0; j < options.totalSlides; j++) {
                            $('ul.' + ulClass + ' li').eq(j).attr({
                                'class': 'hslide',
                                'id': 'hslide' + (j)
                            });
                            options.imagesArray.push($('ul.' + ulClass + ' li.hslide div.parent-container img').eq(j).attr('src'));
                        }
                        var firstSlideToAdd = '<li class="hslide" id="hslide-first">' + $('ul.' + ulClass + ' li').eq(options.totalSlides - 1).html() + '</li>';
                        var lastSlideToAdd = '<li class="hslide" id="hslide-last">' + $('ul.' + ulClass + ' li').eq(0).html() + '</li>';
                        var allSlides = $('ul.' + ulClass).html();
                        $('ul.' + ulClass).empty();
                        $('ul.' + ulClass).append(firstSlideToAdd + allSlides + lastSlideToAdd);
                        btns = '<span class="' + options.prevButtonClass + '"></span>' +
                            '<span class="' + options.nextButtonClass + '"></span>';
                        $(currentContainer).append(btns);
                    }
                }
                options.currentSlide = 1;
                options.slideValue = (options.slidesOnView == 1) ? -options.width : 0;
                options.onSlideLoad();
            }

            // function to build the thumbnails if requested
            function buildThumbnails() {
                var i = 0;
                if (!options.showThumbnails) {
                    return true;
                }
                if (!options.imagesArrayProvided && options.imagesArray.length <= 0) {
                    for (i = 0; i < options.totalSlides; i++) {
                        options.imagesArray.push($('ul.' + ulClass + ' li.hslide div.parent-container img').eq(i).attr('src'));
                    }
                }
                var thumbnailsDom = '<div class="thumbnails-parent-container"><ul class="thumbnails-container">';
                var liOpen = '<li class="thumbnail-slide" ';
                for (i = 0; i < options.totalSlides; i++) {
                    thumbnailsDom += liOpen + 'id="thumbnail-slide-' + (i + 1) + '">' +
                        '<img src="' + options.imagesArray[i] +
                        '"></li>';
                }
                thumbnailsDom += '</ul></div>';
                $(currentContainer).append(thumbnailsDom);
                $('.thumbnail-slide').off().on('click', triggerCurrentThumbnailSlide);
            }

            function setLeftPositionOfThumbnails(direction) { //direction is 'prev' or 'next'
                if (!options.showThumbnails) {
                    return true;
                }
                var ulWidth = parseInt($('.thumbnails-container').width());
                var containerWidth = parseInt($('.thumbnails-parent-container').width());
                var thumbnailSlideVal = (options.currentSlide - 1) * eachThumbnailSlideWidth;

                if (thumbnailSlideVal > ulWidth - containerWidth) {
                    thumbnailSlideVal = ulWidth - containerWidth;
                }

                $('.thumbnails-container').animate({
                        left: -(thumbnailSlideVal - 2) + 'px'
                    },
                    options.transitionSpeed,
                    function () {
                        //handle thumbnail slide post event here
                    }
                );
            }

            // function to set the captions view in place
            function buildCaptionsList() {
                var captionsLength = options.captionContentList.length;
                if (!options.captionNeeded || captionsLength === 0) {
                    return false;
                }
                var captionsListDOM = '<div class="' + options.captionContainerClass + '"></div>';
                for (var i = 1; i <= captionsLength; i++) {
                    $('#hslide' + i + ' div.parent-container').append(captionsListDOM);
                    $('#hslide' + i + ' div.parent-container .' +
                        options.captionContainerClass).text(options.captionContentList[i - 1]);
                    if (i == 1 && options.slidesOnView == 1) {
                        $('#hslide-last div.parent-container').append(captionsListDOM);
                        $('#hslide-last div.parent-container .' +
                            options.captionContainerClass).text(options.captionContentList[i - 1]);
                    } else if (i == captionsLength && options.slidesOnView == 1) {
                        $('#hslide-first div.parent-container').append(captionsListDOM);
                        $('#hslide-first div.parent-container .' +
                            options.captionContainerClass).text(options.captionContentList[i - 1]);
                    }
                }
            }

            // function set default UL styles
            function setRequestedStyles() {
                // slidesOnView: 2
                $('ul.' + ulClass).css({
                    width: options.width * $('ul.' + ulClass + ' li').length,
                    height: options.height,
                    left: '-' + (options.width / options.slidesOnView) + 'px'
                });
                $('ul.' + ulClass + ' li.hslide').css({
                    width: (options.width / options.slidesOnView)
                });
                // for thumbnail-slides hide, 4 added here is for the border provided to the thumbnail slide
                eachThumbnailSlideWidth = $('li.thumbnail-slide').width() + 4 +
                    (2 * parseInt($('li.thumbnail-slide').eq(1).css('margin-left')));
                $('ul.thumbnails-container').css('width', eachThumbnailSlideWidth * options.totalSlides);

                //set default "selected" class to the current slide
                $('.hslide, .thumbnail-slide').removeClass('selected');
                $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
            }

            // function to begin the slide action
            function beginSlides() {
                // shiftSlides: 2
                clearScrollingInterval(); //clear already existing timer before restarting it
                $('.hslide, .thumbnail-slide').removeClass('selected');
                $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                beginScrollingInterval();
            }

            // function to build the pause button section
            function buildPauseButtonContent() {
                var pauseBtn = '<' + options.pausePlayButtonElement + ' href="javascript:void(0)" class="slider-controller">' +
                    '<span>' + options.pauseButtonText + '</span>' +
                    '<i class="fa fa-pause" aria-hidden="true"></i>' +
                    '</' + options.pausePlayButtonElement + '>';
                $(currentContainer).append(pauseBtn);
            }

            // function to handle the slide transition when a thumbnail is clicked
            function triggerCurrentThumbnailSlide(e) {
                e.preventDefault();
                // selectedThumbnailIndex, thumbnailClickDirection are global variable to focus on current slide to transition
                selectedThumbnailIndex = parseInt($(this).attr('id').replace(/\D/g, ''));
                // ignore the current slide
                if ($(this).hasClass('selected') || options.currentSlide == selectedThumbnailIndex) {
                    return false;
                }
                thumbnailClickDirection = (options.currentSlide > selectedThumbnailIndex) ? 'prev' : 'next';
                console.log(thumbnailClickDirection);
                thumbnailClickTriggered = true;
                if (thumbnailClickDirection === 'prev') {
                    previousSlideShift();
                } else {
                    nextSlideShift();
                }
            };

            // function to handle the slide transition to left / previous
            function previousSlideShift() {
                if (thumbnailClickTriggered) {
                    options.slideValue = -(options.width * selectedThumbnailIndex);
                } else {
                    if (options.currentSlide == 1) {
                        options.slideValue = 0;
                    } else {
                        options.slideValue = options.slideValue + options.width;
                    }
                }
                options.beforeSlideShift();
                options.previousSlideShift(); //trigger custom functions by user if any
                animateSlideTransitionPrev();
                restartSlidingOnClick();
            }

            // function to handle the slide transition to right / next
            function nextSlideShift() {
                if (thumbnailClickTriggered) {
                    options.slideValue = -(options.width * selectedThumbnailIndex);
                } else {
                    if (options.currentSlide >= options.totalSlides) {
                        options.slideValue = 0;
                    } else {
                        options.slideValue -= options.width;
                    }
                }
                //scenario when only one slide per view is required
                if (options.currentSlide == options.totalSlides && options.slidesOnView == 1) {
                    options.slideValue = -((options.totalSlides + 1) * options.width);
                }
                options.beforeSlideShift();
                options.nextSlideShift(); //trigger custom functions by user if any
                animateSlideTransitionNext();
                restartSlidingOnClick();
            }

            // function to handle resize of window screen
            function resizeSlideShift() {
                buildSliderView(); //function to build structure if it already doesn't exist
                setRequestedStyles();
                if (options.autoSlide) {
                    beginSlides();
                }
                $('.hslide, .thumbnail-slide').removeClass('selected');
                $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                options.resizeSlideShift();
            }

            // function to handle the pause of the carousel flow
            function clearScrollingInterval() {
                clearInterval(options.slideInterval);
            }

            function beginScrollingInterval() {
                options.slideInterval = ''; //resetting to basic string before interval is assigned
                options.slideInterval = setInterval(function () {
                    if (options.scrollDirection == 'right') {
                        nextSlideShift(options.autoSlide);
                    } else {
                        previousSlideShift();
                    }
                }, options.slideSpeed);
            }

            // function to pause the slider when mouse over the slider
            function pauseOnMouseEnter() {
                clearScrollingInterval();
            }

            // function to play the slider when mouse out of the slider
            function playOnMouseOut() {
                if (options.manuallyPaused) {
                    return true;
                }
                beginScrollingInterval();
            }

            var manualPlayPauseController = function(e) {
                e.preventDefault();
                options.manuallyPaused = !options.manuallyPaused;
                if (!options.manuallyPaused) {
                    $(this).find('i').removeClass('fa-pause').addClass('fa-play');
                    $(this + ' .slider-controller span').text(options.playButtonText);
                    clearScrollingInterval();
                } else {
                    $(this).find('i').removeClass('fa-play').addClass('fa-pause');
                    $(this + ' .slider-controller span').text(options.pauseButtonText);
                    beginScrollingInterval();
                }
            };

            // function to trigger the slide again on scratch if button is clicked
            function restartSlidingOnClick() {
                if (options.autoSlide) {
                    beginSlides();
                }
                $('.hslide, .thumbnail-slide').removeClass('selected');
                $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
            }

            // function to check and set the current slide index
            function calculateCurrentSlideIndex(direction) { //direction is 'prev' or 'next'
                if (thumbnailClickTriggered) {
                    options.currentSlide = selectedThumbnailIndex;
                    thumbnailClickTriggered = false;
                } else {
                    if (direction == 'prev') {
                        options.currentSlide = (options.currentSlide == 1) ? options.totalSlides : (options.currentSlide - 1);
                    } else {
                        options.currentSlide = (options.currentSlide == options.totalSlides) ? 1 : (options.currentSlide + 1);
                    }
                }
                $('.hslide, .thumbnail-slide').removeClass('selected');
                $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                setLeftPositionOfThumbnails(direction);
            }

            // function to check whether the selected object is empty or not
            function checkValid(item, type) {
                var ret = false;
                if (item !== undefined && item !== null) {
                    ret = true;
                }
                if (ret) {
                    if (type == 'array' && item.length <= 0) {
                        ret = false;
                    } //check for non empty array
                    if (type == 'string' && item.length <= 0) {
                        ret = false;
                    } //check for non empty string
                }
                return ret;
            }

            // function to handle animation of each slide transition of previous button click
            function animateSlideTransitionPrev() {
                if (options.transitionStyle == 'fade') {
                    prevFADEAnimate();
                } else if (options.transitionStyle == 'slide') {
                    prevSLIDEAnimate();
                }
                calculateCurrentSlideIndex('prev');
            }

            // function to handle animation of each slide transition of next button click
            function animateSlideTransitionNext() {
                if (options.transitionStyle == 'fade') {
                    nextFADEAnimate();
                } else if (options.transitionStyle == 'slide') {
                    nextSLIDEAnimate();
                }
                calculateCurrentSlideIndex('next');
            }

            // function to handle the "slide" animation for prev button
            function prevSLIDEAnimate() {
                $('ul.' + ulClass).animate({
                        left: options.slideValue + 'px'
                    },
                    options.transitionSpeed,
                    function () {
                        if (shouldResetSlide && options.currentSlide == options.totalSlides) {
                            options.slideValue = -(options.width * options.totalSlides);
                            $('ul.' + ulClass).css('left', options.slideValue + 'px');
                            options.currentSlide = options.totalSlides;
                            $('.hslide, .thumbnail-slide').removeClass('selected');
                            $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                        }
                        options.afterSlideShift();
                    }
                );
            }

            // function to handle the "slide" animation for next button
            function nextSLIDEAnimate() {
                $('ul.' + ulClass).animate({
                        left: options.slideValue + 'px'
                    },
                    options.transitionSpeed,
                    function () {
                        if (shouldResetSlide &&
                            Math.abs(options.slideValue) > (options.totalSlides * options.width) &&
                            options.slidesOnView == 1) {
                            //go to last but one slide - to show its the same as slide one
                            options.slideValue = -options.width;
                            $('ul.' + ulClass).css('left', options.slideValue + 'px');
                            options.currentSlide = 1;
                            $('.hslide, .thumbnail-slide').removeClass('selected');
                            $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                        }
                        options.afterSlideShift();
                    }
                );
            }

            // function to handle the "fade" animation for prev button
            function prevFADEAnimate() {
                $('ul.' + ulClass).css({
                    left: options.slideValue + 'px',
                    opacity: 0
                });
                if (shouldResetSlide && options.currentSlide == 2) {
                    options.slideValue = -(options.width * (options.totalSlides - 2));
                    $('ul.' + ulClass).css('left', options.slideValue + 'px');
                    options.currentSlide = options.totalSlides;
                    $('.hslide, .thumbnail-slide').removeClass('selected');
                    $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                }
                $('ul.' + ulClass).animate({
                        opacity: 1
                    },
                    options.transitionSpeed,
                    function () {
                        // post fade in handler
                        options.afterSlideShift();
                    }
                );
            }

            // function to handle the "fade" animation for next button
            function nextFADEAnimate() {
                $('ul.' + ulClass).css({
                    left: options.slideValue + 'px',
                    opacity: 0
                });
                if (shouldResetSlide && options.currentSlide == options.totalSlides - 1) {
                    //go to last but one slide - to show its the same as slide one
                    options.slideValue = -options.width;
                    $('ul.' + ulClass).css('left', options.slideValue + 'px');
                    options.currentSlide = 1;
                    $('.hslide, .thumbnail-slide').removeClass('selected');
                    $('.hslide#hslide' + options.currentSlide + ', .thumbnail-slide#thumbnail-slide-' + options.currentSlide).addClass('selected');
                }
                $('ul.' + ulClass).animate({
                        opacity: 1
                    },
                    options.transitionSpeed,
                    function () {
                        // post fade in handler
                        options.afterSlideShift();
                    }
                );
            }
        };
        return this.each(buildSlider);
    };
}(jQuery));
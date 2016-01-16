/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function($) {
  $.transit = {
    version: "0.9.9",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft: 'margin',
      marginRight: 'margin',
      marginBottom: 'margin',
      marginTop: 'margin',
      paddingLeft: 'padding',
      paddingRight: 'padding',
      paddingBottom: 'padding',
      paddingTop: 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: true
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    //if (prop in div.style) { return prop; }

    for (var i = 0; i < prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) {
        return vendorProp;
      }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  support.transition = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.filter = getVendorPropertyName('Filter');
  support.transform3d = checkTransform3dSupport();

  // Detect the 'transitionend' event needed.
  var transitionEnd = (function() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'MSTransition': 'msTransitionEnd',
      'OTransition': 'oTransitionEnd'
    }

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  })();

  // Populate jQuery's `$.support` with the vendor prefixes we know.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  for (var key in support) {
    if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
      $.support[key] = support[key];
      //break;
    }
  }

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    'fastSlow': 'cubic-bezier(0.000, 0.025, 0.000, 1.000)',
    'linear': 'linear',
    'ease': 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'snap': 'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeInCubic': 'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
    'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack': 'cubic-bezier(.51,-1.29,.34,1.88)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks['transit:transform'] = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform') || new Transform();
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !isChrome) {
        elem.style[support.transform] = value.toString(false);
      }
      else {
        elem.style[support.transform] = value.toString(false);
      }

      $(elem).data('transform', value);
    }
  };

  // Add a CSS hook for `.css({ transform: '...' })`.
  // In jQuery 1.8+, this will intentionally override the default `transform`
  // CSS hook so it'll play well with Transit. (see issue #62)
  $.cssHooks.transform = {
    set: $.cssHooks['transit:transform'].set
  };

  // ## 'filter' CSS hook
  // Allows you to use the `filter` property in CSS.
  //
  //     $("#hello").css({ filter: 'blur(10px)' });
  //
  $.cssHooks.filter = {
    get: function(elem) {
      return elem.style[support.filter];
    },
    set: function(elem, value) {
      elem.style[support.filter] = value;
    }
  };

  // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
  // be necessary.
  if ($.fn.jquery < "1.8") {
    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
      get: function(elem) {
        return elem.style[support.transformOrigin];
      },
      set: function(elem, value) {
        elem.style[support.transformOrigin] = value;
      }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
      get: function(elem) {
        return elem.style[support.transition];
      },
      set: function(elem, value) {
        elem.style[support.transition] = value;
      }
    };
  }

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('scaleX');
  registerCssHook('scaleY');
  registerCssHook('translate');
  registerCssHook('translateZ');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') {
      this.parse(str);
    }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string') ? val.split(',') :
        (val.constructor === Array) ? val : [val];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      }
      else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      }
      else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) {
          y = x;
        }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) {
          this._translateX = 0;
        }
        if (this._translateY === undefined) {
          this._translateY = 0;
        }

        if (x !== null && x !== undefined) {
          this._translateX = unit(x, 'px');
        }
        if (y !== null && y !== undefined) {
          this._translateY = unit(y, 'px');
        }

        this.translate = this._translateX + "," + this._translateY;
      },
      translateZ: function(z){
        this.translateZ = unit(z, 'px');
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) {
          s[0] = parseFloat(s[0], 10);
        }
        if (s[1]) {
          s[1] = parseFloat(s[1], 10);
        }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i = 0; i <= 3; ++i) {
          if (s[i]) {
            s[i] = parseFloat(s[i], 10);
          }
        }
        if (s[3]) {
          s[3] = unit(s[3], 'deg');
        }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
              (i === 'rotateX') ||
              (i === 'rotateY') ||
              (i === 'perspective') ||
              (i === 'transformOrigin'))) {
            continue;
          }

          //if(this[i] == '' || this[i] == ',') continue;

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            }
            else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            }
            else {
              re.push(i + "(" + this[i] + ") translateZ(0)");
            }
          }
        }
      }

      ////console.log('================' + re.join(" "));
      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {

    if (queue === true) {
      self.queue(fn);
    }
    else if (queue) {
      self.queue(queue, fn);
    }
    else {

      self.each(function() {
        fn.call(this);
      });
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || $.cssProps[key] || key;
      key = uncamel(key); // Convert back to dasherized

      // Get vendor specify propertie
      if (support[key])
        key = uncamel(support[key]);

      if ($.inArray(key, re) === -1) {
        re.push(key);
      }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);


    // Account for aliases (`in` => `ease-in`).
    //if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    //var attribs = '' + toMS(duration) + ' ' + easing;
    //if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."

    // EDITED: ZEROONEA
    var is_duration_array = typeof duration === 'object' ? true : false;
    var is_easing_array = typeof easing === 'object' ? true : false;
    var is_delay_array = typeof delay === 'object' ? true : false;

    var transitions = [],
      attr_duration = '',
      attr_easing = '',
      attr_delay = '',
      count = 0;
    $.each(props, function(i, name) {
      attr_duration = '';
      attr_easing = '';
      attr_delay = '';

      if (duration) {
        attr_duration = is_duration_array ? duration[i] : duration;
        if (attr_duration == null) attr_duration = '';
        else attr_duration = toMS(attr_duration);
      }
      if (easing) {
        attr_easing = is_easing_array ? easing[i] : easing;
        if ($.cssEase[attr_easing]) attr_easing = $.cssEase[attr_easing];
      }
      if (delay) {
        attr_delay = is_delay_array ? delay[i] : delay;
        if (attr_delay == null) attr_delay = '';
        else attr_delay = toMS(attr_delay);
      }

      ////console.log(name + ' ' + attr_duration + ' ' + attr_easing + ' ' + attr_delay);

      transitions.push(name + ' ' + attr_duration + ' ' + attr_easing + ' ' + attr_delay);
      count++;
    });
    // END EDITED: ZEROONEA

    return [transitions.join(', '), count];
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //


  // EDITED: ZEROONEA
  $.fn.stopTransition = function(keep_style) {
    return this.each(function() {
      $(this).unbind(transitionEnd).clearQueue();
      if (!keep_style) {
        this.style[support.transition] = null;
      }
      return this;
    });
  };
  // END EDITED: ZEROONEA

  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self = this;
    var delay = 0;
    var queue = true;
    
    ////console.log('ts: ' + self.size());

    var theseProperties = jQuery.extend(true, {}, properties);

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, options)`.
    if (typeof duration === 'object') {
      easing = duration.easing;
      delay = duration.delay || 0;
      queue = duration.queue || true;
      callback = duration.complete;
      duration = duration.duration;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof theseProperties.easing !== 'undefined') {
      easing = theseProperties.easing;
      delete theseProperties.easing;
    }

    if (typeof theseProperties.duration !== 'undefined') {
      duration = theseProperties.duration;
      delete theseProperties.duration;
    }

    if (typeof theseProperties.complete !== 'undefined') {
      callback = theseProperties.complete;
      delete theseProperties.complete;
    }

    if (typeof theseProperties.queue !== 'undefined') {
      queue = theseProperties.queue;
      delete theseProperties.queue;
    }

    if (typeof theseProperties.delay !== 'undefined') {
      delay = theseProperties.delay;
      delete theseProperties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') {
      duration = $.fx.speeds._default;
    }
    if (typeof easing === 'undefined') {
      easing = $.cssEase._default;
    }

    //duration = toMS(duration);

    // Build the `transition` property.
    var tmp = getTransition(theseProperties, duration, easing, delay);
    var transitionValue = tmp[0];
    var transitionCount = tmp[1];

    ////console.log('transitionCount: ' + transitionCount);
    ////console.log('maxDuration: ' + duration + ' ' + delay);
    var maxDuration = duration ? Math.max.apply(Math, duration) : 0;
    var maxDelay = delay ? Math.max.apply(Math, delay) : 0;

    ////console.log('maxDuration2: ' + (maxDuration + maxDelay));

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (maxDuration + maxDelay) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(theseProperties);
        if (callback) {
          callback.apply(self);
        }
        if (next) {
          next();
        }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;
      var count = 1;

      // Prepare the callback.
      var cb = function(e) {
        e.stopPropagation();
        ////console.log(count + " : " + transitionCount);
        if (count == transitionCount) {
          
          if (bound) {
            self.unbind(transitionEnd, cb);
          }

          if (i > 0) {
            self.each(function() {
              this.style[support.transition] = (oldTransitions[this] || null);
            });
          }

          if (typeof callback === 'function') {
            callback.call(self, count, transitionCount);
          }
          if (typeof nextCall === 'function' && count == transitionCount) {
            nextCall();
          }
        }

        count++;
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        ////console.log('transitionEnd');
        bound = true;
        self.bind(transitionEnd, cb);
      }
      else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        var is_duration_array = typeof duration === 'object' ? true : false;
        var is_delay_array = typeof delay === 'object' ? true : false;

        for (var j = 0; j < transitionCount; j++) {
          var time = is_duration_array ? duration[j] : duration;
          time += is_delay_array ? delay[j] : delay;
          window.setTimeout(cb, time);
        }
      }
      
      var j = 0;
      // Apply transitions.
      self.each(function() {
        if (i > 0) {  
        //console.log('j: ' + j++ + ' - i:' + i + ' - ' + support.transition + ' : ' + transitionValue);
          this.style[support.transition] = transitionValue;
          ////console.log(support.transition + " : " + transitionValue);
        }
        $(this).css(properties);
      });
    };//end run

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
      this.offsetWidth; // force a repaint
      run(next);
    };

    // Use jQuery's fx queue.
    //callOrQueue(self, queue, deferredRun);
    run(null);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) {
      $.cssNumber[prop] = true;
    }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transit:transform');
        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transit:transform');
        t.setFromString(prop, value);

        $(elem).css({
          'transit:transform': t
        });
      }
    };

  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) {
      return '-' + letter.toLowerCase();
    });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    }
    else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  // toMS('fast') => $.fx.speeds[i] => "200ms"
  // toMS('normal') //=> $.fx.speeds._default => "400ms"
  // toMS(10) //=> '10ms'
  // toMS('100ms') //=> '100ms'  
  //
  function toMS(duration) {
    var i = duration;

    // Allow string durations like 'fast' and 'slow', without overriding numeric values.
    if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
      i = $.fx.speeds[i] || $.fx.speeds._default;
    }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;
})(jQuery);
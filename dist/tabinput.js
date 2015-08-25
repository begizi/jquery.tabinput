/**
 * tabinput - Date Input with tab complete
 * @version v1.2.1
 * @link http://brianegizi.com/
 * @license MIT
 */
(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);

  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));

  } else {
    // Browser globals
    factory(jQuery);
  }

}(function ($) {
  'use strict';

  function Tabinput(input, options) {
    this.$input = $(input);
    this.inputList = [];

    this.options = $.extend(true, {}, this.options, this.defaults, options);

    this.buildContainer();
    this.processFormat();
    this.buildInputList();
    this.val(this.$input.val());

    // Hide the original input and add the tabinput input
    this.$input.hide().after(this.$container);
  }

  Tabinput.prototype = {
    constructor: Tabinput,

    defaults: {
      format: 'MM/DD/YYYY',
      seperator: '/',
      filter: false,
      textAlign: 'left',
      cursor: 'text',
      placeholder: true,
      charWidth: 0.6,
      widthUnit: 'em',
      templates: {
        inputContainer: '<div class="tabinput"></div>',
        inputs: '<div class="tabinput-input" contenteditable="true" />',
        seperator: '<span class="tabinput-seperator"></span>'
      }
    },

    buildContainer: function() {
      var self = this;
      self.$container = $(self.options.templates.inputContainer);

      // Get css classes from original input
      self.$container.addClass(self.$input.attr('class'));

      // Set css options
      self.$container.css({
        cursor: self.options.cursor
      });

      // Listen for container clicks and focus the input
      self.$container.on('click', function(e) {
        var $target = $(e.target);
        // Focus and select the first input
        if (!$target.is('[contenteditable]')) {
          self.$container.find('[contenteditable]:first').focus().selectAllContent();
        }
      });
    },

    processFormat: function() {
      this.inputBlocks = this.options.format.split(this.options.seperator);
      this.numInputs = this.inputBlocks.length;
    },

    buildInputList: function() {
      var self = this;
      this.inputList = this.inputBlocks.map(function(block, i) {
        var input = self.buildInput(block.length, block);

        self.$container.append(input);

        // If this isn't the last input then append a seperator
        if (i !== self.numInputs-1) {
          self.$container.append(self.buildSeperator());
        }

        return input;

      });
    },

    buildInput: function(size, block) {
      var self = this;
      var $input = $(this.options.templates.inputs);
      $input.css({
        minWidth: (size * self.options.charWidth) + self.options.widthUnit,
        cursor: self.options.cursor,
        textAlign: self.options.textAlign
      });

      if (self.options.placeholder) {
        $input.text(block);
      }

      // Setup events
      $input.on('click', function(e) {
        var $target = $(e.target);
        $target.focus().selectAllContent();
      });

      $input.on('focus', function() {
        $(this).selectAllContent();
      });

      $input.on('keydown', function(e) {
        // Disable Enter, Left, Up, Right, Down
        if (/^(13|37|38|39|40)$/.test(e.which)) {
          return e.preventDefault();
        }
      });

      $input.on('input', function() {
        // Run the value through the formatter
        if (self.options.filter) {
          this.textContent = this.textContent.replace(self.options.filter, '');
          $input.selectEndContent();
        }

        // Replace an empty input with placeholders
        if (this.textContent.length === 0 && self.options.placeholder) {
          this.textContent = block;
          $input.selectAllContent();
          return;
        }

        // limit the input to the block size
        if (this.textContent.length > size) {
          this.textContent = this.textContent.substring(0, size);
        }

        if (this.textContent.length === size) {
          $input.nextAll('[contenteditable]').first().focus().selectAllContent();
        }

        self.pushVal();
      });

      return $input;
    },

    buildSeperator: function() {
      var seperator = $(this.options.templates.seperator);
      seperator.text(this.options.seperator);
      return seperator;
    },

    val: function(value) {
      if (value !== undefined && value !== '') {
        var valBlocks = value.split(this.options.seperator);

        this.inputList.forEach(function(input, i) {
          input.text(valBlocks[i]);
        });

        // Set inputs to original input
        return this.$input.val(value);
      } else {
        return this.$input.val();
      }
    },

    pushVal: function() {
      var val = this.inputList.map(function(input) {
        return input.text();
      });

      this.$input.val(val.join(this.options.seperator), true);
    },

    destroy: function() {
      this.$container.remove();
      this.$input.show();
      this.$input.data('tabinput', null);
    }
  };

  // Select contenteditable helper function
  $.fn.selectAllContent = function(){
    var element = this[0];
    var select = function() {
      if (element && window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(function() {
        select();
      });
    } else {
      setTimeout(function() {
        select();
      }, 0);
    }
  };

  $.fn.selectEndContent = function() {
    var element = this[0];
    if (element && element.childNodes.length > 0 && window.getSelection) {
      var selection = window.getSelection();
      var range = document.createRange();
      range.setStart(element.childNodes[0], element.childNodes[0].length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      element.focus();
    }
  };

  $.fn.tabinput = function(option, parameter, extraOptions) {
    var value;
    var chain = this.each(function () {
      var $this = $(this);
      var data = $this.data('tabinput');
      var options = typeof option === 'object' && option;

      // Initialize a new tabinput
      if (!data) {
        data = new Tabinput(this, options);
        $this.data('tabinput', data);
      }

      // Call tabinput method
      if (typeof option === 'string' && data[option] instanceof Function) {
        value = data[option](parameter, extraOptions);

        if (option === 'destroy') {
          $(this).data('tabinput', false);
        }
      }

    });

    // Return the value if method was called and has a return
    if (value !== undefined) {
      return value;
    }

    return chain;
  };

}));

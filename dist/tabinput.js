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

    this.options = $.extend(true, {}, this.options, this.defaults, options);

    this.buildContainer();
    this.processFormat();
    this.buildInputList();

    // Hide the original input and add the tabinput input
    this.$input.hide().after(this.$container);
  }

  Tabinput.prototype = {
    constructor: Tabinput,

    defaults: {
      format: 'ABC-DEF-GHI',
      seperator: '-',
      type: 'text',
      replace: /[^a-zA-Z0-9]/g,
      templates: {
        inputContainer: '<div class="tabinput"></div>',
        inputs: '<input type="text" class="tabinput-input" />',
        seperator: '<span class="tabinput-seperator"></span>'
      }
    },

    buildContainer: function() {
      var self = this;
      self.$container = $(self.options.templates.inputContainer);

      // Get css classes from original input
      self.$container.addClass(self.$input.attr('class'));

      // Listen for container clicks and focus the input
      self.$container.on('click', function(e) {
        var $target = $(e.target);
        // Focus and select the first input
        if (!$target.is('input')) {
          self.$container.find('input:first').focus().select();
        }
      });
    },

    processFormat: function() {
      this.inputBlocks = this.options.format.split(this.options.seperator);
      this.numInputs = this.inputBlocks.length;
    },

    buildInputList: function() {
      var self = this;
      this.inputBlocks.forEach(function(block, i) {
        var input = self.buildInput(block.length);

        self.$container.append(input);

        // If this isn't the last input then append a seperator
        if (i !== self.numInputs-1) {
          self.$container.append(self.buildSeperator());
        }

      });
    },

    buildInput: function(size) {
      var self = this;
      var $input = $(this.options.templates.inputs);
      $input.attr('size', size);
      $input.attr('maxlength', size);
      $input.attr('type', self.options.type);


      if (self.options.type === 'number') {
        $input.attr('min', 0);
        $input.attr('max', new Array(size+1).join('9'));
      }

      // Setup events
      $input.on('click', function(e) {
        var $target = $(e.target);
        $target.focus().select();
      });

      $input.on('input', function(e) {
        if (/^(9|13|16|27|37|38|39|40)$/.test(e.which)) {
          return;
        }

        // Run the value through the formatter
        if (self.options.replace) {
          this.value = this.value.replace(self.options.replace, '');
        }

        if ($input.val().length === size) {
          $input.nextAll('input').first().focus().select();
        }
      });

      return $input;
    },

    buildSeperator: function() {
      var seperator = $(this.options.templates.seperator);
      seperator.text(this.options.seperator);
      return seperator;
    },

    setInputs: function(value) {
      // Set inputs to original input
      this.$input.val(value);
    },

    val: function(value) {
      if (typeof value !== 'undefined') {
        this.setInputs(value);
        return this.$input;
      } else {
        return this.$input.val();
      }
    }
  };

  $.fn.tabinput = function(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('tabinput');
      var options = typeof option === 'object' && option;

      // Initialize a new tabinput
      if (!data) {
        data = new Tabinput(this, options);
        $this.data('tabinput', data);
      }
    });
  };

}));
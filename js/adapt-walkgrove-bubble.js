define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var BubbleView = ComponentView.extend({

    events: {
      'click .js-bubble-click-prev': 'onPrev',
      'click .js-bubble-click-next': 'onNext'
    },

    _bubbleIndex: 0,
    _bubblesTotal: 0,
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();

      this.setupInview();

      this._bubblesTotal = this.model.get('_items').length;
      this.$('.bubble__widget').eq(0).removeClass('is-hidden');
      this.$('.js-bubble-click-prev').prop('disabled', true);
      this.$('.js-bubble-click-next').prop('disabled', false);
    },

    setupInview: function() {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        //this.setCompletionStatus();
        return;
      }

      //this.setupInviewCompletion(selector);
    },

    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector: function() {
      if (this.model.get('body')) return '.component__body';

      if (this.model.get('instruction')) return '.component__instruction';

      if (this.model.get('displayTitle')) return '.component__title';

      return null;
    },

    onPrev: function () {
      if(this._bubbleIndex > 0) {
        this._bubbleIndex--;
      }
      this.setBubble();
    },

    onNext: function () {
      if(this._bubbleIndex < this._bubblesTotal-1) {
        this._bubbleIndex++;
      }
      this.setBubble();
    },

    setBubble: function () {
      this.model.get('_items').forEach((item, i) => {
        this.$('.bubble__widget').eq(i).addClass('is-hidden');
      });


      this.$('.bubble__widget').eq(this._bubbleIndex).removeClass('is-hidden');
      this.$('.bubble__widget').eq(this._bubbleIndex).a11y_focus();

      if(this._bubbleIndex === 0) {
        this.$('.js-bubble-click-prev').prop('disabled', true);
      } else {
        this.$('.js-bubble-click-prev').prop('disabled', false);
      }

      if(this._bubbleIndex === this._bubblesTotal-1) {
        this.$('.js-bubble-click-next').prop('disabled', true);
        this.setCompletionStatus();
      } else {
        this.$('.js-bubble-click-next').prop('disabled', false);
      }

    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  },
  {
    template: 'bubble'
  });

  return Adapt.register('bubble', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: BubbleView
  });
});

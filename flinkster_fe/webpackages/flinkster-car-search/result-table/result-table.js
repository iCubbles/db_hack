(function () {
  'use strict';
  /**
   * Get help:
   * > Lifecycle callbacks:
   * https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html#lifecycle-callbacks
   *
   */
  CubxPolymer({
    is: 'result-table',

    templates: {
      row:  '{{#items}}' + 
              '<div class="row">' +
                '<div class="flex-1 label">{{name}}</div>' +
                '<div class="flex-4">{{description}}</div>' +
              '</div>' +
            '{{/items}}'
    },

    /**
     * Manipulate an element’s local DOM when the element is created.
     */
    created: function () {
    },

    /**
     * Manipulate an element’s local DOM when the element is created and initialized.
     */
    ready: function () {
    },

    /**
     * Manipulate an element’s local DOM when the element is attached to the document.
     */
    attached: function () {
    },

    /**
     * Manipulate an element’s local DOM when the cubbles framework is initialized and ready to work.
     */
    cubxReady: function () {
      this.cubxReady = true;
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'slotName' has changed ...
     */
    modelRentalObjectsChanged: function (rentalObjects) {
      if (this.cubxReady) {
        this._render();
      }
    },

    _render: function () {
      const items = this.model.rentalObjects;
      let parent = this.$$('.data-table');

      parent.innerHTML = Mustache.render(this.templates.row, { items });
    }
  });
}());

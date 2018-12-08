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
      row:  '<div class="data-table-row header">'+
              '<div class="flex-2">Name</div>' +
              '<div class="flex-2">Beschreibung</div>' +
              '<div class="flex-1">Entfernung</div>' +
            '</div>' +
            '{{#items}}' + 
              '<div class="data-table-row" data-uuid="{{uuid}}">' +
                '<div class="flex-2">{{name}}</div>' +
                '<div class="flex-2">{{description}}</div>' +
                '<div class="flex-1 align-right">{{distance}}&nbsp;m</div>' +
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
      this._registerSelectListener();
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
    },

    _registerSelectListener: function () {
      this.addEventListener('click', function (event) {
        let current = event.target;
        let uuid = null;
        
        while (current !== this) {
          if (current.hasAttribute('data-uuid')) {
            uuid = current.getAttribute('data-uuid');
            if (this.model.selectedItem && this.model.selectedItem.uuid === uuid) {
              this._deselectItems();
            } else {
              this._selectItemByUuid(uuid);
            }
            break;
          } else {
            current = current.parentNode;
          }
        }
      }.bind(this));
    },

    _selectItemByUuid: function (uuid) {
      this.model.rentalObjects.forEach(function (item) {
        if (item.uuid === uuid) {
          this.$$(`[data-uuid="${item.uuid}"]`).classList.add('selected');
          this.setSelectedItem(item);
        } else {
          this.$$(`[data-uuid="${item.uuid}"]`).classList.remove('selected');
        } 
      }.bind(this));
    },

    _deselectItems: function () {
      this.model.rentalObjects.forEach(({ uuid }) => {
        this.setSelectedItem(null);
        this.$$(`[data-uuid="${uuid}"]`).classList.remove('selected')
      });
    }
  });
}());

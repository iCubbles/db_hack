(function () {
  'use strict';
  /**
   * Get help:
   * > Lifecycle callbacks:
   * https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html#lifecycle-callbacks
   *
   */
  CubxPolymer({
    is: 'flinkster-location-select',

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
      this.$$('button').addEventListener('click', function () {
        this.getAndSetSearch();
      }.bind(this));
    },

    getAndSetSearch: function () {
      const location = this.$$('.select-location').value;
      const radius = this.$$('.select-radius').value;

      const locations = {
        berlin: { lat: '52.529362', lon: '13.370630'},
        muenchen: { lat: '48.139130', lon: '11.580220'},
        hamburg: { lat: '53.553840', lon: '9.991650'},
        weimar: { lat: '50.979120', lon: '11.324480'},
        erfurt: { lat: '50.973740', lon: '11.022430'}
      }

      if (location === 'current') {
        navigator.geolocation.getCurrentPosition(function(position) {
          this.setSearch({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            radius
          });
        }.bind(this));
      } else {
        this.setSearch({
          lat: locations[location].lat,
          lon: locations[location].lon,
          radius
        });
      }

    }

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'slotName' has changed ...
     */
    // modelSlotNameChanged: function (newValue) {}
  });
}());

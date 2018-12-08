(function () {
  'use strict';
  /**
   * Get help:
   * > Lifecycle callbacks:
   * https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html#lifecycle-callbacks
   *
   */
  CubxPolymer({
    is: 'flinkster-request-builder',
    
    config: {
       url: "https://openwhisk.eu-de.bluemix.net/api/v1/web/getrequest_eval/default/dbhack-flinkster.json",
       method: "get"
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
      this.modelLocationChanged();
    },

    /**
     *  Observe the Cubbles-Component-Model: If value for slot 'slotName' has changed ...
     */
    modelLocationChanged: function (newValue) {
      newValue = newValue || {
        lat: '52.523430',
        lon: '13.411440' ,
        radius: 2000
      };
      const {
        lat = '52.523430',
        lon = '13.411440' ,
        radius = 2000
      } = newValue;

      const requestConfig = Object.assign({}, this.config, { params: { lat, lon, radius, calcWalkDistance: true }});
      this.setRequestConfig(requestConfig);
    }
  });
}());

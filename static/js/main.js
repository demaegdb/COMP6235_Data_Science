;(function(win, doc, $, undef) {
  'use strict'

  var
  myMap,

  /**
   * Init
   */
  init = function() {

    // Map
    myMap = new Map('map', {
      center: [ -1.404351 , 50.909698 ],
      zoom:   12
    })

    // Plot
    d3.json('http://localhost:5000/api/restaurants', function (collection) {
      
      myMap.points({
          fillColor:   "red",
          strokeWidth: 1,
          pointRadius: 2,
          rotation: 0,
          graphicName: "square"
      },collection)
    
    })
  
  }

  /// Start
  $(init)

})(this, document, jQuery)
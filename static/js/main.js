;(function(win, doc, $, undef) {
  'use strict'

  var
  myMap,
  myPieChart,

  /**
   * Init
   */
  init = function() {

    // Map
    myMap = new Map('map', {
      center: [ -1.404351 , 50.909698 ],
      zoom:   13
    })

    // Plot
    d3.json('http://localhost:5000/api/restaurants', function (collection) {
      
      myMap.points({
          fillColor: "#0000ff",
          strokeWidth: 1,
          strokeColor: '#0000ff',
          pointRadius: 2,
      },collection)
    
    })

    // pie chart
    myPieChart = new pieChart('pieChart')

    d3.json('http://localhost:5000/api/yelp_restaurants/rating', function(collection) {
      myPieChart.fillPieChart(collection)
    })
  
  }

  /// Start
  $(init)

})(this, document, jQuery)
;(function(win, doc, $, undef) {
  'use strict'

  var
  myMap,
  myPieChart,
  myBarChart,

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
    myPieChart = new pieChart('pieChart', {
      width: 700,
      height: 350
    })

    // bar chart
    myBarChart = new barChart('barChart', {
      width: 700,
      height: 350
    })

    d3.json('http://localhost:5000/api/yelp_restaurants/rating', function(collection) {
      myPieChart.fillPieChart(collection)
      myBarChart.createBar(collection)
    })

  
  }

  /// Start
  $(init)

})(this, document, jQuery)
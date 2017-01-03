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
      
      // myMap.points({
      //     fillColor: "#0000ff",
      //     strokeWidth: 1,
      //     strokeColor: '#0000ff',
      //     pointRadius: 2,
      // },collection)

      myMap.plot(collection, 
        {
          css: function(d) {
            return 'restaurant'
          },
          over: popup.over(tooltip.restaurant),
          out:  popup.out()
        })
    
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

  
  },

  /**
   * Tooltips
   */
  tooltip = {
    
    restaurant: function(d) {
      
      popup.title.html(function() {
        return d.properties.name
      })

      popup.body.html(function() {
        return '<dl class="dl-horizontal dl-xs">' +
          '<dt>City</dt>' +
          '<dd>' + d.properties.city + '</dd>' +
          '<dt>FHRSID</dt>' +
          '<dd>' + d.properties.FHRSID + '</dd>' +
          '</dl>'
      })

    }

  }

  /// Start
  $(init)

})(this, document, jQuery)
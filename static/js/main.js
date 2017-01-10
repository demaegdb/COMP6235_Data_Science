;(function(win, doc, $, undef) {
  'use strict'

  var
  myMap,
  myPieChart,
  myBarChart,
  myFoodAgencyData,
  myYelpData,
  myTripadvisorData,
  // myYelpDataRating,
  // myTripadvisorDataRating,

  /**
   * Init
   */
  init = function() {

    // Map
    myMap = new Map('map', {
      center: [ -1.404351 , 50.909698 ],
      zoom:   12
    })

    // Plot food Agency restaurants
    d3.json('http://localhost:5000/api/restaurants', function (collection) {
      
      myFoodAgencyData = collection

      myMap.plot(collection, 
        {
          css: 'foodAgency',
          over: popup.over(tooltip.foodAgency),
          out:  popup.out()
        })
    
    })

    // Download data from yelp
    d3.json('http://localhost:5000/api/yelp_restaurants', function (collection) {

      myYelpData = collection

    })

    // Download data from tripAdvisor
    d3.json('http://localhost:5000/api/tripadvisor_restaurants', function (collection) {

      myTripadvisorData = collection

    }) 

    // pie chart
    myPieChart = new pieChart('pieChart', {
      width: 700,
      height: 350
    })
    $('#pieChart').hide()

    // bar chart
    myBarChart = new barChart('barChart', {
      width: 700,
      height: 350
    })
    $('#barChart').hide()

    // handle event
    var 
    foodAgency = document.getElementById('foodAgency'),
    yelp = document.getElementById('yelp'),
    tripadvisor = document.getElementById('tripadvisor')
    
    foodAgency.addEventListener('click', function() {
      myMap.removeLayer()
      myMap.createD3Layer()
      myMap.plot(myFoodAgencyData, 
      {
        css: 'foodAgency',
        over: popup.over(tooltip.foodAgency),
        out:  popup.out()
      })

      $('#pieChart').hide(500)
      $('#barChart').hide(500)
    })

    yelp.addEventListener('click', function() {
      myMap.removeLayer()
      myMap.createD3Layer()
      myMap.plot(myYelpData,
      {
        css: 'yelp',
        over: popup.over(tooltip.yelp),
        out: popup.out()
      })

      $('#pieChart').show(500)
      $('#barChart').show(500)
      createBarChart('yelp')
      createPieChart('yelp')
    })

    tripadvisor.addEventListener('click', function() {
      myMap.removeLayer()
      myMap.createD3Layer()
      myMap.plot(myTripadvisorData,
      {
        css: 'tripadvisor',
        over: popup.over(tooltip.tripadvisor),
        out: popup.out()
      })

      $('#pieChart').show(500)
      $('#barChart').show(500)
      createBarChart('tripadvisor')
      createPieChart('tripadvisor')
    })

  
  },

  /**
   * Create a bar chart
   */
  createBarChart = function(data) {

    d3.json('http://localhost:5000/api/' + data + '_restaurants/rating', function (collection) {

      myBarChart.removeThings()
      myBarChart = new barChart('barChart', {
        width: 700,
        height: 350
      })
      myBarChart.createBar(collection)
      
    })

  },

  /**
   * Create a pie chart
   */
  createPieChart = function(data) {
    
    d3.json('http://localhost:5000/api/' + data + '_restaurants/rating', function (collection) {

      myPieChart.removeThings()
      myPieChart = new pieChart('pieChart', {
        width: 700,
        height: 350
      })
      myPieChart.fillPieChart(collection)

    })

  },


  /**
   * Tooltips
   */
  tooltip = {
    
    foodAgency: function(d) {
      
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

    },

    yelp: function(d) {
      
      popup.title.html(function() {
        return d.properties.name
      })

      popup.body.html(function() {
        return '<dl class="dl-horizontal dl-xs">' +
          '<dt>Categories</dt>' +
          '<dd>' + d.properties.categories[0][0] + '</dd>' +
          '<dt>rating</dt>' +
          '<dd>' + d.properties.rating + '</dd>' +
          '<dt>Number of reviews</dt>' +
          '<dd>' + d.properties.review_count + '</dd>' +
          '</dl>'
      })

    },

    tripadvisor: function(d) {
      
      popup.title.html(function() {
        return d.properties.name
      })

      popup.body.html(function() {
        return '<dl class="dl-horizontal dl-xs">' +
          '<dt>Categories</dt>' +
          '<dd>' + d.properties.categories + '</dd>' +
          '<dt>rating</dt>' +
          '<dd>' + d.properties.rating + '</dd>' +
          '<dt>Number of reviews</dt>' +
          '<dd>' + d.properties.review_count + '</dd>' +
          '</dl>'
      })

    },    

  }

  /// Start
  $(init)

})(this, document, jQuery)
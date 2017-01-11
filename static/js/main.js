;(function(win, doc, $, undef) {
  'use strict'

  var
  myMap,
  myPieChart,
  myBarChart,
  myTwitterGraph,
  myInstagramGraph,
  myFoodAgencyData,
  myYelpData,
  myTripadvisorData,
  myTwitterPizza,
  myTwitterBurger,
  myTwitterVegan,
  myTwitterCoffee,
  myTwitterTea,
  /**
   * Init
   */
  init = function() {

    // Map
    myMap = new Map('map', {
      center: [ -1.404351 , 50.909698 ],
      zoom:   13
    })

    // slider
    var tripadvisor_slider = document.getElementById('tripadvisor_slider')
    tripadvisor_slider.style.width = '200px'
    $('#tripadvisor_slider').hide()

    var yelp_slider = document.getElementById('yelp_slider')
    yelp_slider.style.width = '200px'
    $('#yelp_slider').hide()

    // dropdown
    var tripadvisor_dropdown = document.getElementById("tripadvisor_dropdown")
    $('#tripadvisor_dropdown').hide()

    var dropdown = document.getElementById("s1")
    dropdown.addEventListener("change", function() {
      var choice = dropdown.options[dropdown.selectedIndex].value
      myMap.updateChoice(choice)
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

      var min = d3.min(collection, function(d) { return d.properties.review_count })
      var max = d3.max(collection, function(d) { return d.properties.review_count })

      noUiSlider.create(yelp_slider, {
        start: [min, max],
        connect: true,
        range: {
          "min" : min,
          "max" : max
        },
        step: 1,
        tooltips: true
      })
      
      yelp_slider.noUiSlider.on('slide', function(values, handle) {
        myMap.updateLayer(values)
      })

    })

    // Download data from tripAdvisor
    d3.json('http://localhost:5000/api/tripadvisor_restaurants', function (collection) {

      myTripadvisorData = collection
      var min = d3.min(collection, function(d) { return d.properties.review_count })
      var max = d3.max(collection, function(d) { return d.properties.review_count })

      noUiSlider.create(tripadvisor_slider, {
        start: [min, max],
        connect: true,
        range: {
          "min" : min,
          "max" : max
        },
        step: 1,
        tooltips: true
      })
      
      tripadvisor_slider.noUiSlider.on('slide', function(values, handle) {
        myMap.updateLayer(values)
      })

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

    // create graph
    myTwitterGraph = new graph('twitterGraph', {
      width: 550,
      height: 300
    })

    myInstagramGraph = new graph('instagramGraph', {
      width: 550,
      height: 300
    })


    // fill html table
    d3.json('http://localhost:5000/api/twitter_pizza', function (collection) {
      fillCell("twitter_pizza", "pizza", collection.length)
    })
    d3.json('http://localhost:5000/api/twitter_burger', function (collection) {
      fillCell("twitter_burger", "burger", collection.length)
    })
    d3.json('http://localhost:5000/api/twitter_coffee', function (collection) {
      fillCell("twitter_coffee", "coffee", collection.length)
    })
    d3.json('http://localhost:5000/api/twitter_tea', function (collection) {
      fillCell("twitter_tea", "tea", collection.length)
    })
    d3.json('http://localhost:5000/api/twitter_vegan', function (collection) {
      fillCell("twitter_vegan", "vegan", collection.length)
    })

    d3.json('http://localhost:5000/api/instagram_food/total_count', function (collection) {
      for(var i = 0 ; i < collection.length ; i ++) {
        fillCell("instagram_" + collection[i].foodType, collection[i].foodType, collection[i].count)
      }
    })

    d3.json('http://localhost:5000/api/instagram_food/time_count', function (collection) {
      console.log(collection)
      myInstagramGraph.createGraph(collection)
    })

    d3.json('http://localhost:5000/api/twitter_time_count', function (collection) {
      console.log(collection)
      myTwitterGraph.createGraph(collection)
    })

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
      $('#tripadvisor_slider').hide(300)
      $('#yelp_slider').hide(300)
      $('#tripadvisor_dropdown').hide(300)
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
      $('#yelp_slider').show(300)
      $('#tripadvisor_slider').hide(300)
      $('#tripadvisor_dropdown').hide(300)
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
      $('#yelp_slider').hide(300)
      $('#tripadvisor_slider').show(300)
      $('#tripadvisor_dropdown').show(300)
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
   * fill HTML table
   */
  fillCell = function(id, name, count) {

    var selectedId = document.getElementById(id)

    selectedId.innerHTML = "<b>#" + name + "</b> : " + count

  },

  /**
   * process twitter data
   */

  // processTwitterData = function(collection) {

  //   var tmpCollection = collection

  //   for( var i = 0 ; i < tmpCollection.length ; i++) {
  //     var tmp = tmpCollection[i].createdTime.split(" ")
  //     tmp.splice(3, 1)
  //     tmp.splice(3, 1)
  //     tmp.splice(0, 1)
  //     tmpCollection[i].createdTime = tmp.join(" ")
  //   }

  //   var result = [{"createdTime": tmpCollection[0].createdTime, "count": 1, "foodType": tmpCollection[0].foodType}]

  //   outer_loop:
  //   for(var i = 1 ; i < collection.length ; i++) {
  //     for(var j = 0 ; j < result.length ; j++) {
  //       if (result[j].createdTime === tmpCollection[i].createdTime) {
  //         result[j].count ++
  //         continue outer_loop
  //       }
  //     }
  //     result.push({
  //       createdTime: tmpCollection[i].createdTime,
  //       count: 1,
  //       foodType: tmpCollection[i].foodType
  //     })
  //   }

  //   return result

  // },

  // updateTwitterTimeCount = function(data) {
  //   for(var i = 0 ; i < data.length ; i++) {
  //     myTwitterProcessedData.push(data[i])
  //   }
  //   data = []
  // },

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
          '<dt>neighborhood</dt>' +
          '<dd>' + d.properties.city + '</dd>' +
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
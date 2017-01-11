;(function(win, doc, undef) {
  'use strict'

  /**
   * Graph widget
   * @param  string id    Container ID
   * @param  object opts  Chart options
   * @return object       Bar Chart instance
  */

  var graph = win.klass.extends({
    /**
     * Construct the graph
     * @param id     id ref in HTML
     * @param opts   options when creating the pie chart
     */

     __construct: function(id, opts) {

      opts = opts || {}
      this.opts = opts

      this.margin = {
        top: 30,
        right: 20,
        bottom: 70,
        left: 50
      }

      this.width = this.opts.width - this.margin.right - this.margin.left
      this.height = this.opts.height - this.margin.bottom - this.margin.top

      this.x = d3.time.scale().range([0, this.width])
      this.y = d3.scale.linear().range([this.height, 0])

      this.xAxis = d3.svg.axis().scale(this.x)
                                .orient("bottom")
                                .ticks(5)

      this.yAxis = d3.svg.axis().scale(this.y)
                                .orient("left")
                                .ticks(5)

      this.svg = d3.select("#" + id)
                  .append("svg")
                  .classed("graph", true)
                  .attr("width", this.opts.width)
                  .attr("height", this.opts.height)
                .append("g")
                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

     },

     createGraph: function(collection) {

      var that = this

      var parseDate = d3.time.format("%B %Y").parse
      var color = d3.scale.category10()

      var dataLine = d3.svg.line()
                        .x(function(d) { return that.x(d.createdTime)})
                        .y(function(d) { return that.y(d.count)})

      collection.forEach(function(d) {
        d.createdTime = parseDate(d.createdTime)
        d.count = +d.count
      })

      this.x.domain(d3.extent(collection, function(d) { return d.createdTime }))
      this.y.domain([0, d3.max(collection, function(d) { return d.count })])

      var dataNest = d3.nest()
                      .key(function(d) {return d.foodType})
                      .entries(collection)

      var legendSpace = this.width/dataNest.length

      dataNest.forEach(function(d,i) {

        that.svg.append("path")
                .classed("line", true)
                .style("stroke", function() {
                  return d.color = color(d.key)
                })
                .attr("id", 'tag'+d.key.replace(/\s+/g, ''))
                .attr("d", dataLine(d.values))


        that.svg.append("text")
                .attr("x", (legendSpace/2)+i*legendSpace) 
                .attr("y", that.height + (that.margin.bottom/2)+ 5)
                .classed("legend", true)
                .style("fill", function() {
                  return d.color = color(d.key) 
                })
                .on("click", function(){
                  var active   = d.active ? false : true,
                  newOpacity = active ? 0 : 1 
                  d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity", newOpacity)
                d.active = active;
                })  
            .text(d.key) 
      })

      this.svg.append("g")
              .classed("x axis", true)
              .attr("transform", "translate(0," + this.height + ")")
              .call(that.xAxis)

      this.svg.append("g")
          .classed("y axis", true)
          .call(that.yAxis)

           
     }  
  })

  /// Stage
  win.graph = graph

})(this, document)
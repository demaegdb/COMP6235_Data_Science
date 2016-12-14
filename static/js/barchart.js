;(function(win, doc, undef) {
  'use strict'

  /**
   * Bar Chart widget
   * @param  string id    Container ID
   * @param  object opts  Chart options
   * @return object       Bar Chart instance
  */

  var barChart = win.klass.extends({
    /**
     * Construct the Bar Chart
     * @param id     id ref in HTML
     * @param opts   options when creating the pie chart
     */

    __construct: function(id, opts) {

      opts = opts || {}
      this.opts = opts

      this.margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
      }

      this.width = this.opts.width - this.margin.right - this.margin.left
      this.height = this.opts.height - this.margin.bottom - this.margin.top

      this.x = d3.scale.ordinal()
                .rangeRoundBands([0, this.width], .1)

      this.y = d3.scale.linear()
                .range([this.height, 0])

      this.xAxis = d3.svg.axis()
                        .scale(this.x)
                        .orient("bottom")

      this.yAxis = d3.svg.axis()
                        .scale(this.y)
                        .orient("left")

      this.svg = d3.select("#" + id)
                  .append("svg")
                  .classed("barchart", true)
                  .attr("width", this.opts.width)
                  .attr("height", this.opts.height)
                
      this.g = this.svg.append("g")
                      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

    },

    createBar: function(collection) {
      var that = this

      this.x.domain(collection.map(function(d) {
        return d.label
      }))

      this.y.domain([0, d3.max(collection, function(d) {
        return d.count
      })])

      this.g.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis)

      this.g.append("g")
          .classed("y axis", true)
          .call(this.yAxis)

      this.g.selectAll(".bar")
        .data(collection)
        .enter().append("rect")
          .classed("bar", true)
          .attr("x", function(d) { return that.x(d.label) })
          .attr("y", function(d) { return that.y(d.count) })
          .attr("width", this.x.rangeBand())
          .attr("height", function(d) { return that.height - that.y(d.count) })
    }

  })


  /// Stage
  win.barChart = barChart

})(this, document)
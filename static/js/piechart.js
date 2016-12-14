;(function(win, doc, undef) {
  'use strict'

  /**
   * Pie Chart widget
   * @param  string id    Container ID
   * @param  object opts  Chart options
   * @return object       Chart instance
  */

  var pieChart = win.klass.extends({

    /**
     * Construct the Pie Chart
     * @param id     id ref in HTML
     * @param opts   options when creating the pie chart
     */

     __construct: function(id, opts) {

      opts = opts || {}
      this.opts = opts

      this.width = this.opts.width
      this.height = this.opts.height
      this.radius = Math.min(this.width, this.height) / 2

      this.colorRange = d3.scale.category20()
      this.pieColor = d3.scale.ordinal()
                      .range(this.colorRange.range())

      
      this.svg = d3.select("#" + id)
                    .append('svg')
                    .classed('donut', true)
                    .append('g')


      this.svg.append("g")
              .classed("slices", true)

      this.svg.append("g")
              .classed("labelName", true)

      this.svg.append("g")
              .classed("labelValue", true)

      this.svg.append("g")
              .classed("lines", true)

      this.pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                      return d.count
                    })

      this.arc = d3.svg.arc()
                    .outerRadius(this.radius * 0.8)
                    .innerRadius(this.radius * 0.4)

      this.outerArc = d3.svg.arc()
                        .innerRadius(this.radius * 0.9)
                        .outerRadius(this.radius * 0.9)

      this.legendSpacing = this.radius * 0.02

      this.svg.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")

     },

     fillPieChart: function(collection) {

      var that = this
      // process the data
      var count = 0
      for (var i = 0 ; i < collection.length ; i++) {
        count += collection[i].count
      }

      for (var j = 0 ; j < collection.length ; j++ ) {
        collection[j].count = Math.round(collection[j].count * 100 / count)
        collection[j].label = 'star : ' + collection[j].label 
      }

      // pie slices
      this.slice = this.svg.select('.slices')
                            .selectAll("path.slice")
                            .data(that.pie(collection), function(d) {
                              return d.data.label
                            })

      this.slice.enter()
                .insert("path")
                .style("fill", function(d){
                  return that.pieColor(d.data.label)
                })
                .classed("slice", true)

      this.slice.transition().duration(1000)
                .attrTween('d', function(d) {
                  this._current = this._current || d
                  var interpolate  = d3.interpolate(this._current, d)
                  this._current = interpolate(0)
                  return function(t) {
                    return that.arc(interpolate(t))
                  }
                })

      this.addTextLabel(collection)

     },

     addTextLabel: function(collection) {

      var that = this

      this.text = this.svg.select(".labelName")
                          .selectAll("text")
                          .data(that.pie(collection), function(d) {
                            return d.data.label
                          })

      this.text.enter()
              .append("text")
              .attr("dy", ".35em")
              .text(function(d) {
                return (d.data.label + ": " + d.value + "%")
              })

      this.text.transition().duration(1000)
                            .attrTween("transform", function(d) {
                              this._current = this._current || d
                              var interpolate = d3.interpolate(this._current, d)
                              this._current = interpolate(0)
                              return function(t) {
                                var d2 = interpolate(t)
                                var pos = that.outerArc.centroid(d2)
                                pos[0] = that.radius * (that.midAngle(d2) < Math.PI ? 1 : -1)
                                return "translate("+ pos +")";
                              }
                            })
                            .styleTween("text-anchor", function(d) {
                              this._current = this._current || d
                              var interpolate = d3.interpolate(this._current, d)
                              this._current = interpolate(0)
                              return function(t) {
                                var d2 = interpolate(t)
                                return that.midAngle(d2) < Math.PI ? "start":"end";
                              }
                            })
                            .text(function(d) {
                              return (d.data.label + ": " + d.value + "%" ) 
                            })

      this.addLines(collection)

     },

     midAngle: function(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2
     },

     addLines: function(collection) {
      
      var that = this

      this.polyline = this.svg.select(".lines")
                              .selectAll("polyline")
                              .data(that.pie(collection), function(d) {
                                return d.data.label
                              })

      this.polyline.enter()
                  .append("polyline")

      this.polyline.transition().duration(1000)
                                .attrTween("points", function(d){
                                  this._current = this._current || d
                                  var interpolate = d3.interpolate(this._current, d)
                                  this._current = interpolate(0)
                                  return function(t) {
                                    var d2 = interpolate(t)
                                    var pos = that.outerArc.centroid(d2)
                                    pos[0] = that.radius * 0.95 * (that.midAngle(d2) < Math.PI ? 1 : -1)
                                    return [that.arc.centroid(d2), that.outerArc.centroid(d2), pos];
                                  }
                                })
     
     }

  })


  /// Stage
  win.pieChart = pieChart

})(this, document)
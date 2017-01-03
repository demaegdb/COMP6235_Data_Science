;(function(win, doc, undef) {
  'use strict'

  var ol = OpenLayers

  /**
   * Map widget
   * @param  string id    Container ID
   * @param  object opts  Map options
   * @return object       Map instance
  */

  var Map = win.klass.extends({

    /**
     * Construct the Map
     * @param id     id ref in HTML
     * @param opts   options when creating the map
     */

    __construct: function(id, opts) {

      opts = opts || {}
      this.opts = opts

      // baselayer
      this.baseLayer = new ol.Layer.OSM()

      // other layers
      this.layers = {
        over: new ol.Layer.Vector('restaurants')
      }

      this.projs = [
        new ol.Projection('EPSG:900913'),
        new ol.Projection('EPSG:4326')
      ]
      
      this.mouse  = new ol.Control.MousePosition({
        displayProjection: this.projs[1]
      })

      this.map    = new ol.Map(id, {
        numZoomLevels:     0,
        minZoomLevel:      0,
        maxZoomLevel:      15,
        projection:        this.projs[0],
        displayProjection: this.projs[1],
        theme:             '/css/lib/openlayers.css',
        tileManager: null,
        controls: [
          new ol.Control.Navigation({
            dragPanOptions: { enableKinetic: true }
          }),
          new ol.Control.Zoom(),
          new ol.Control.ScaleLine(),
          this.mouse
        ],
        transitionEffect: 'map-resize'
      })

      this.map.addLayers([ this.baseLayer, this.layers.over ])
      
      this.center(this.opts.center, this.opts.zoom)


    },

    /**
     * Set center
     * @param  LatLong/array c  New center
     * @param  integer       z  Optional zoom
     */
    
    center: function(c, z) {

      this.map.setCenter(new ol.LonLat(c).transform('EPSG:4326', 'EPSG:900913'), z)

    },

    /**
     * Toggle visibility
     * @param  string  name     Layer name
     * @param  boolean visible  Visible?
     */
    toggle: function(name, visible) {

      this.layers[name].setVisibility(visible)

    },

    /**
     * Plot restaurants using OL
     * @param  object style       Points style
     * @param  array  collection  data
     */

    points: function(opts, collection) {

      var
      map = this.map,
      mouse = this.mouse,
      projs = this.projs,
      features = [ ]

      this.layers["restaurants"] = new ol.Layer.Vector("restaurants", {
        eventListeners: {
          featureselected: function(evt) {
            opts.over(evt.feature.data, [ mouse.lastXy.x, mouse.lastXy.y ])
          },
          featureunselected: function(evt) {
            opts.out(evt.feature.data)
          }
        }
      })

      this.layers["restaurants"].setVisibility(true)
      this.map.addLayer(this.layers["restaurants"])

      collection.forEach(function(d, i) {
        var
        coords  = d.geometry.coordinates,
        feature = new ol.Feature.Vector(new ol.Geometry.Point(coords[0], coords[1]).transform(projs[1], projs[0]), d.properties)
        feature.style = {
          fillColor:   opts.fillColor,
          strokeWidth: opts.strokeWidth,
          strokeColor: opts.strokeColor,
          pointRadius: opts.pointRadius,
        }

        features.push(feature)
      })
      
      this.layers["restaurants"].addFeatures(features)
      
    },

    /**
     * Plot restaurants using D3
     * @param  object style       Points style
     * @param  array  collection  data
     */
    plot: function(collection, opts) {
      var that = this

      var myData = {}
      myData.type = "FeatureCollection"
      myData.features = collection

      // remove null coordinates
      myData.features = myData.features.filter(function(d) {
        return d.geometry.coordinates[0] != null
      })   

      this.bounds = d3.geo.bounds(myData)

      this.div = d3.selectAll('#' + this.layers.over.div.id)
      this.div.selectAll('svg').remove()

      this.svg  = this.div.append('svg')
      this.g    = this.svg.append('g')
      this.path = d3.geo.path().projection(this.project)

      this.g.selectAll('path.circle')
        .data(myData.features)
        .enter()
        .append('path')
        .attr('d', 'M4 0 L0 10 L8 10 Z')
        .attr('class', opts.css)
        .classed('circle', true)
        .on({
          mouseover: opts.over,
          mouseout:  opts.out
        })

      this.map.events.register('moveend', this.map, this.centerPlot)
      this.centerPlot()

    },

    /**
     * Center plot
     */
    centerPlot: function() {

      var
      delta = 30,
      proj  = this.project,
      bl    = this.project(this.bounds[0]),
      tr    = this.project(this.bounds[1]),
      dx    = delta - bl[0],
      dy    = delta - tr[1]

      this.svg
        .attr({
          width:  tr[0] - bl[0] + 2 * delta,
          height: bl[1] - tr[1] + 2 * delta
        })
        .style({
          'margin-left': (bl[0] - delta) + 'px',
          'margin-top':  (tr[1] - delta) + 'px'
        })
      this.g.attr('transform', 'translate(' + dx + ',' + dy + ')')

      this.g.selectAll('path.circle')
        .attr('transform', function(d) {
          var xy = proj(d.geometry.coordinates)
          return 'translate(' + (xy[0] - 4) + ',' + (xy[1] - 7) + ') ' 
        })

    },

    /**
     * Projection OL (GPS) > d3.js (px)
     */
    project: function(x) {

      var
      gps   = new ol.LonLat(x[0], x[1]).transform('EPSG:4326', 'EPSG:900913'),
      point = this.map.getViewPortPxFromLonLat(gps)

      return [ point.x, point.y ]

    }
    
  })

  /// Stage
  win.Map = Map

})(this, document)


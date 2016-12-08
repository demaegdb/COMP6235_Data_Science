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
     * Plot restaurants
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
        feature = new ol.Feature.Vector(new ol.Geometry.Point(coords[0], coords[1])
                                        .transform(projs[1], projs[0]), d.properties)
        feature.style = {
          fillColor:   opts.color,
          strokeWidth: opts.strokeWidth,
          pointRadius: opts.pointRadius,
          rotation: opts.rotation,
          graphicName: opts.graphic
        }

        features.push(feature)
      })
      
      this.layers["restaurants"].addFeatures(features)
      
    }

  })

  /// Stage
  win.Map = Map

})(this, document)


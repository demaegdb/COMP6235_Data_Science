;(function(win, doc, $, undef) {
  'use strict'

  /**
   * Popup
   */
  var popup = {

    on:    false,
    box:   d3.select('#popup'),
    zone:  d3.select('#popup').node().parentNode,
    title: d3.select('#popup .title'),
    body:  d3.select('#popup .body'),

    over: function(html, container) {

      return function(d, pos) {

        var
        pos = pos.indexOf ? pos : d3.mouse(this.parentNode)
        if (container) pos[1] -= d3.select(container).property('scrollTop')

        // Clear timer
        if (popup.on) clearTimeout(popup.on)

        // Update content
        html.call(this, d)

        // Avoid out-of-screen popup
        popup.box.style({ visibility: 'hidden', display: 'block' })
        if (pos[0] + popup.box.node().offsetWidth > popup.zone.offsetWidth)
          pos[0] -= popup.box.node().offsetWidth + 40
        if (popup.zone.offsetHeight > 300
            && pos[1] + popup.box.node().offsetHeight > popup.zone.offsetHeight)
          pos[1] -= popup.box.node().offsetHeight + 40

        // Place box
        popup.box
          .style({
            left:    (pos[0] + 20) + 'px',
            top:     (pos[1] + 20) + 'px',
            visibility: 'visible'
          })
          .on({
            mouseover: function() { clearTimeout(popup.on) },
            mouseout:  function() { popup.out()() }
          })

      }

    },

    out: function() {

      return function(d) {

        if (popup.on) clearTimeout(popup.on)
        popup.on = setTimeout(function() {
          popup.box.on({ mouseover: null, mouseout: null })
            .style('display', 'none')
        }, 500)
      }

    }

  }

  // stage 
  win.popup  = popup

})(this, document, jQuery)
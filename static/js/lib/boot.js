;(function(win, doc, undef) {
  "use strict"


  /**
   * Minimalist OOP
   * @param  object protos  Prototypes
   * @param  object parent  Object parent class
   * @return object         Class instance
   */
  var klass = function(protos, parent) {

    var
    k = function() {
      /// Autobind functions (optional)
      for (var i in this)
        if (this[i] instanceof Function)
          this[i] = this[i].bind(this)
      /// Default constructor (optional)
      if (this.__construct)
        this.__construct.apply(this, arguments)
    }

    parent = parent || { }
    protos.static = protos
    protos.parent = parent.prototype
    k.prototype   = protos
    k.parent      = parent
    k.extends     = function(protos) {
      for (var i in this.prototype)
        if (protos[i] === undef)
          protos[i] = this.prototype[i]
      return new klass(protos, this)
    }

    return k

  }


  /// Stage
  win.klass = new klass({

    on: function(evt, f) {
      //console.log('on', evt)
      if (!this.evts) this.evts = { }
      if (!this.evts[evt])
        this.evts[evt] = [ ]
      if (f) this.evts[evt].push(f)
      else console.warn('not a valid callback for ' + evt, f)
      return this
    },
    
    off: function(evt, f) {
      //console.log('off', evt)
      var i
      if (!this.evts[evt])
        return this
      if (f === undef) {
        this.evts[evt] = [ ]
        return this
      }
      i = this.evts[evt].indexOf(f)
      if (i != -1)
        this.evts[evt].splice(i, 1)
      return this
    },
    
    trigger: function() {
      var
      i, a = Array.prototype.slice.apply(arguments),
      evt = a.shift()
      //console.log('trigger', evt, a)
      if (!this.evts || !this.evts[evt])
        return this
      for (i = 0; i < this.evts[evt].length; i++)
        this.evts[evt][i].apply(this, a)
      return this      
    }
    
  })


})(window, document)

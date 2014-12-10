var APP = APP || {};

APP.Lyrics = {
  setUp: function() {
    console.log("APP Started")
  },
  Canvas: {
    _mycanvas: "",
    _ctx: "",
    setUp: function() {
      this.getCanvas("dcanvas")
        //this.startCanvas()
    },
    getCanvas: function(id) {
      this._mycanvas = document.getElementById(id);
      this._ctx = this._mycanvas.getContext("2d")
    },
    startCanvas: function() {
      var scene = new Scene(this._mycanvas);

      scene.init();
      window.setInterval(function() {
        scene.draw(this._ctx);
      }, 1000 / 60);
    }
  },
  Drawable: {
    setUp: function() {}
  }
}

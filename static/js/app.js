var SG = function() { 
  
  this.init();  
  
};

SG.prototype = {

  init: function() {
  
    // event handler
    $(document).hammer();
    $(document).on('tap', '#credits-toggle', $.proxy(this.credits, this));
    $(document).on('tap', 'g.interactive', $.proxy(this.highlightElement, this));
    
    // load SVG into DOM
    $.get('svg/truck.svg', null, function(data) {
      var el = $('svg', data);
      var svg = document.adoptNode(el[0]);
      $('#graphic1').html(svg);
    }, 'xml');
      
  },
  
  /***************************************
  * Helpers 
  ***************************************/

  /***************************************
  * Events
  ***************************************/

  credits: function(e) {
    $('#credits').toggle();
  },
  
  highlightElement: function() {
    
  }
  
};

$(function() {
  var sg = new SG();
});
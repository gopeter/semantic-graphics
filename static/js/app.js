var SG = function() { 

  this.activeHoverEl = null;  
  this.SVGClickInactive = false;
  this.init();  
  
};

SG.prototype = {

  init: function() {
  
    // event handler
    $(document).on('click', '#credits-toggle', $.proxy(this.credits, this));
    $(document).on('click mouseenter mouseleave', 'g *', $.proxy(this.highlightTableElement, this));
    $(document).on('mouseenter mouseleave', 'td.hover', $.proxy(this.highlightSVGElement, this));    
    $(document).on('click', '#parse1', $.proxy(this.parse1, this));
    $(document).on('click', '#parse2', $.proxy(this.parse2, this));    
    $(document).on('click', '.loadFurtherInformation', $.proxy(this.loadFurtherInformation, this));        
    
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
  
  checkForInfo: function(obj) {
    var info = false;
    var str = obj;
    if (obj.match(/heroku/)) {
      str = '<a href="' + obj + '" class="loadFurtherInformation">' + obj + '</a>';
      info = true;
    }
    return {'info': info, 'el': str};
  },

  /***************************************
  * Events
  ***************************************/

  credits: function() {
    $('#credits').toggle();
  },
  
  highlightTableElement: function(el) {

    var self = this;  
    var $target = $(el.target);
    var $el;
  
    if (el.type == 'mouseenter') {
    
      $el = $target.closest('.interactive');
      this.activeHoverEl = $el;      
      var context = $el.attr('resource') || $el.attr('src');
      
      if (this.checkForInfo(context).info) {
        $('html,body').css('cursor','pointer');        
      }

      lunar.addClass($el[0], 'active');
      lunar.addClass(document.querySelector('svg'), 'active');            
      $('td[data-content="' + context + '"]').addClass('active');
      
    } else if (el.type == 'mouseleave') {
      
      $el = this.activeHoverEl;
      
      $('html,body').css('cursor','inherit');      
      
      lunar.removeClass($el[0], 'active');
      lunar.removeClass(document.querySelector('svg'), 'active');            
      $('td').removeClass('active');      
      
      
    } else if (el.type == 'click') {
    
      if (!this.SVGClickInactive) {
    
        $el = this.activeHoverEl;
        
        // prevent from firing multiple times, because all alements in this svg grouped get clicked
        this.SVGClickInactive = true;

        this.loadFurtherInformation($el);

        setTimeout(function() {
          self.SVGClickInactive = false;          
        }, 100);
      
      }
      
    }
    
  },
  
  highlightSVGElement: function(el) {

    var $target = $(el.target);
    var context = $target.data('context');
    var $el;
  
    if (el.type == 'mouseenter') {
    
      $target.addClass('active');
      
      if ($('[resource="' + context +'"]').length > 0) {
        $el = $('[resource="' + context +'"]');
      } else if ($('[src="' + context +'"]').length > 0) {
        $el = $('[src="' + context +'"]')
      }
      
      if ($el) {
        this.activeHoverEl = $el;
        lunar.addClass($el[0], 'active');
        lunar.addClass(document.querySelector('svg'), 'active');      
      }
      
    } else if (el.type == 'mouseleave') {
    
      $('td.active').removeClass('active');
      
      $el = this.activeHoverEl;
      
      if ($el) {
        lunar.removeClass($el[0], 'active');      
        lunar.removeClass(document.querySelector('svg'), 'active');            
      }
      
    }

  },
  
  parse1: function() {
  
    var self = this;
  
    $.ajax({
      url: '/query1',
      type: 'get',
      dataType: 'json',
      success: function(res) {
        
        $resultTable = $('#results1').find('table');
        $resultTable.empty();
        
        $resultTable.append('<tr><th>Subject</th><th>Predicat</th><th>Object</th></tr>');
        
        $.each(res, function(i, obj) {
          var s = obj[0];
          var p = obj[1];
          var o = obj[2];
          
          $resultTable.append('<tr><td class="hover" data-context="' + s + '">' + self.checkForInfo(s).el + '</td><td data-context="' + p +'">' + self.checkForInfo(p).el + '</td><td class="hover" data-context="' + o + '">' + self.checkForInfo(o).el + '</td></tr>');    
        });
        
        $('#results1').show();
        
      }
    });
      
  },
  
  parse2: function() {
    
  },
  
  loadFurtherInformation: function(el) {
  
    var context = $(el).attr('src') || $(el.target).attr('href');

    // load second SVG into DOM
    $.get(context, null, function(data) {
      var el = $('svg', data);
      var svg = document.adoptNode(el[0]);
      $('#graphic1').html(svg);
    }, 'xml');

    return false;
    
  }
  
};

$(function() {
  var sg = new SG();
});
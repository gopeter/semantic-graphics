var SG = function() { 

  this.activeHoverEl = null;  
  this.SVGClickInactive = false;
  this.filename = null;
  this.init();  
  
};

SG.prototype = {

  init: function() {
  
    // event handler
    $(document).on('click', '#credits-toggle', $.proxy(this.credits, this));
    $(document).on('click mouseenter mouseleave', 'g *', $.proxy(this.hoverSVG, this));
    $(document).on('mouseenter mouseleave', 'td.hover', $.proxy(this.hoverTable, this));    
    $(document).on('click', '.parse', $.proxy(this.parse, this));
    $(document).on('click', '.loadFurtherInformation', $.proxy(this.loadFurtherInformation, this));        
    
    // load SVG into DOM
    $.get('svg/Truck.svg', null, function(data) {
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
  
  getFilenameFromURL: function(url) {
    return url.substring(url.lastIndexOf('/')+1);
  },

  highlightSVG: function($el, type, detail) {
  
    var selector = (detail) ? '#step2 svg' : '#Truck';

    var s = Snap(selector);
    var e = ($el[0].tagName == 'svg') ? s : s.select('#'+ $el.attr('id'));    
    var f = s.filter([Snap.filter.brightness(0.8), Snap.filter.contrast(0.8)]);      
    
    if (type == 'add') {

      console.log('add', $el);
    
      e.attr({
        filter: f,
        strokeWidth: 3        
      });         
      
    } else if (type == 'remove') {
    
      console.log('remove', $el);
      
      e.attr({
        filter: '',
        strokeWidth: ''
      });          
      
    }
  },

  /***************************************
  * Events
  ***************************************/

  credits: function() {
    $('#credits').toggle();
  },
  
  hoverSVG: function(el) {

    var self = this;  
    var $target = $(el.target);
    var $el;
    var detail = ($target.closest('svg').attr('id') != 'Truck');   
  
    if (el.type == 'mouseenter') {
    
      if (lunar.hasClass($target[0], '.interactive')) {
        $el = $target;
      } else {
        $el = $target.closest('.interactive');
      }
        
      this.activeHoverEl = $el;      
      var context = $el.attr('resource') || $el.attr('src');
      
      if (this.checkForInfo(context).info) {
        $('html,body').css('cursor','pointer');        
      }

      this.highlightSVG($el, 'add', detail);
      $('td[data-context="' + context + '"]').addClass('active');
            
    } else if (el.type == 'mouseleave') {
      
      $el = this.activeHoverEl;
      
      $('html,body').css('cursor','inherit');      
      
      this.highlightSVG($el, 'remove', detail);
      $('td').removeClass('active');      
      
      
    } else if (el.type == 'click') {
    
      if (!this.SVGClickInactive) {
    
        $el = this.activeHoverEl;
        
        // prevent from firing multiple times, because all alements in this svg grouped fire click events
        this.SVGClickInactive = true;

        if ($el.attr('src')) {
          this.loadFurtherInformation($el);
        }

        setTimeout(function() {
          self.SVGClickInactive = false;          
        }, 100);
      
      }
      
    }
    
  },
  
  hoverTable: function(el) {

    var $target = $(el.target);
    var context = $target.data('context');
    var $el;
    var detail = ($target.closest('section').attr('id') == 'step2');
    
    if (el.type == 'mouseenter') {
    
      $target.addClass('active');
      
      if ($('[resource="' + context +'"]').length > 0) {
        $el = $('[resource="' + context +'"]');
      } else if ($('[src="' + context +'"]').length > 0) {
        $el = $('[src="' + context +'"]')
      }
      
      if ($el) {
        this.activeHoverEl = $el;
        this.highlightSVG($el, 'add', detail);
      }
      
    } else if (el.type == 'mouseleave') {
    
      $('td.active').removeClass('active');
      
      $el = this.activeHoverEl;            
      
      if ($el) {
        this.highlightSVG($el, 'remove', detail);         
      }
      
    }

  },
  
  parse: function(el) {
  
    var self = this;
    var i = $(el.target).data('i');
    
    var f = (i == 1) ? null : this.filename;
  
    $.ajax({
      url: '/query',
      type: 'post',
      data: {
        filename: f
      },
      dataType: 'json',
      success: function(res) {
        
        $resultTable = $('#results' + i).find('table');
        $resultTable.empty();
        
        $resultTable.append('<tr><th>Subject</th><th>Predicat</th><th>Object</th></tr>');
        
        $.each(res, function(i, obj) {
          var s = obj[0];
          var p = obj[1];
          var o = obj[2];
          
          $resultTable.append('<tr><td class="hover" data-context="' + s + '">' + self.checkForInfo(s).el + '</td><td data-context="' + p +'">' + self.checkForInfo(p).el + '</td><td class="hover" data-context="' + o + '">' + self.checkForInfo(o).el + '</td></tr>');    
        });
        
        $('#results' + i).show();
        
      }
    });
      
  },
  
  loadFurtherInformation: function(el) {
  
    var context = $(el).attr('src') || $(el.target).attr('href');
    var filename = this.getFilenameFromURL(context);
    this.filename = filename;

    // load second SVG into DOM
    $.get('svg/' + filename, null, function(data) {
      var el = $('svg', data);
      var svg = document.adoptNode(el[0]);
      $('#graphic2').html(svg);
    }, 'xml');
    
    $('#step2').show();

    return false;
    
  }
  
};

$(function() {
  var sg = new SG();
});
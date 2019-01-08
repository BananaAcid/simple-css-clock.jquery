/**
 * simple css clock  (jQuery)
 * 
 * @ref simple-css-clock.jquery.js
 *
 * @url https://github.com/BananaAcid/simple-css-clock.jquery
 * @url https://jsfiddle.net/BananaAcid/9hso5zyd/
 *
 * @author Nabil Redmann (BananaAcid)
 * @license MIT
 * @version 1.0
 *
 * @note
 *  You do not need the javascript, you could just set the hour,minute,second with:
 *   clock minute {
 *     transform: rotateZ(90deg);
 *   }
 *
 *  Markup: (leave out, what you do not want to be shown)
 *    clock
 *      period
 *      hour
 *      minute
 *      second
 *      center
 *
 * @usage
 *  $(elem).clock() to make it run with the current time
 *  Use the attribute `autostart` on the clock elem to make it start on domready. 
 *  Use the attribute `center` to overlay a center spot (use `center="?"` to add an icon within the spot). You may also use the <center> tag.
 *  Use the attribute `time="10:11:12"` to manually set the time (it will not progress).
 *    - using `time` or `time=""` or `time="now"` will result in the current time.
 *  Use the attribute `timezone="Australia/Sydney"` to manually set the timezone.
 *
 *  $(elem).clock('09:12:45'); to set it to a specific time.
 *  $(elem).clock('09:12:45', 'Australia/Sydney'); to set it to a specific time and timezone.
 *  $(elem).clock(undefined, 'Australia/Sydney'); to set it to a specific timezone only.
 *  $(elem).clock(new Date);   to pass a date object and set it to a specific time
 *
 *  $(elem).clock().stop(); to stop the selected clocks
 *  $(elem).clockStop();    to stop the selected clocks
 *
 *  var dateOfClock = $(elem).clock().date();  to get the first clock's date object
 *  var dateOfClock = $(elem).clockDate();     to get the first clock's date object
 *
 *  $.DEBUG_clock = true; to enable debug logging
 *
 *  Style:
 *   clock
 *     - bockground-color / background-image
 *     - width/height       for size
 *     + Attr: center=""    set a center spot and use the param if used - for its  style see `clock[center]:after`
 *     + Attr: time=""      set the time to show on the clock
 *     + Attr: timezone=""  set the timezone to convert time to
 *
 *   minute, hour, second
 *     - background-color   for the color
 *     - width              for the hand's thickness
 *     - height             50% is the max length (diameter/2), 0% the shortest
 *
 *   period
 *     - background-color   for a box around AM/PM
 *     + Attr: am / pm      the am or pm text to show
 *     + Prop: fill         to fill the background to be used as image holder (use `period[is="am"] {background:...}` )
 *     ... clock[period="am"] or period="pm" will be set for styling
 *
 *   center, clock[center]:after
 *     - min-width / min-height  for the center spot size
 *     - background-color        for the spot color
 *     - font-family             if not set on the clock, set it here to use a specific font-awesome icon
 *     - font-size               for the icon size
 *     - line-height             for the vertical alignment - should match the px height of min-height if used
 *     - color                   for the icon color
 **/

;(function($) {
  
  var
      // selectors used to find the child elements - if you prefer classes, or web-controls style, change it here (and the css)
      sel = {
        clock: 'clock',
        hour: 'hour',
        minute: 'minute',
        second: 'second',
        period: 'period'        
      },
      
      // just think about it: 90deg == 3 o'clock --> 30deg == 1 o'clock.
      hrDeg = 30,
      minDeg = 6,
      secDeg = 6
      ;
  
  // stepping inbetween full hours, returns degrees
  function calcHrsAdd(mins) {
    return mins / 3;
  }
  
  // create a date from time
  function getDateFromTime(time) {
    //return new Date('1970-01-01T' + time);
    return new Date(new Date().toISOString().split('T')[0] + 'T' + time);
  }
  
  // put a date object in and request the local time in the supplied timezone
  function getDateFromTimezone(date, timezone) {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  }

  // set the hands
  function update(parent, date) {
    $(parent).data('clock-date', date); // make it available to any other javascript
    
    $(sel.minute, parent).css('transform', 'translateX(-50%) rotateZ(' + date.getMinutes()*minDeg + 'deg)');
    
    var secsDeg = date.getSeconds()*secDeg,
        $sec = $(sel.second, parent),
        bak = $sec.css('transition');
    // just disable the css clock>second: transition to not animate the seconds
    if (!secsDeg && bak) {
      $sec.css({transition: '0s', transform: 'translateX(-50%) rotateZ(-' + secDeg + 'deg)'}).delay(15).queue(function(next) {$sec.css({transition: bak, transform: 'translateX(-50%) rotateZ(-' + secsDeg + 'deg)'}); next();})
    }
    else
      $(sel.second, parent).css('transform', 'translateX(-50%) rotateZ(' + secsDeg + 'deg)');

    $(sel.hour, parent).css('transform',
      'translateX(-50%) ' +
      'rotateZ(' + (
        (date.getHours()*hrDeg) + calcHrsAdd(date.getMinutes())
      ) + 'deg)'
    );
    
    var $period = $(sel.period, parent),
        periodVal = date.getHours() >= 12 ? 'pm' : 'am';
    $period.text( $period.attr(periodVal) );
    $(parent).attr('period', periodVal);
    
    $.DEBUG_clock && 
      console.log('clock', {
        el: $(parent).get(0), fn: 'update',
        
        sec_deg: date.getSeconds()*secDeg,
        min_deg: date.getMinutes()*minDeg,
        hr_deg: date.getHours()*hrDeg + calcHrsAdd(date.getMinutes()),
        hr_deg_add: calcHrsAdd(date.getMinutes()),
        period: periodVal
      });
  }
  
  // stop the clock interval
  function stopClock(clockElements) {
    var iv = $(clockElements).data('clock-ed');
    
    $.DEBUG_clock && 
      console.log('clock', {'el': $(clockElements).get(0), 'fn': 'stopClock', iv:iv});
    
    if (iv !== undefined) {
      clearInterval(iv);
      $(clockElements).removeData('clock-ed');
      //return true;
    }
    else
      return false;
  }
  
  // get the date object from the clock element
  function dateClock(clockElement) {
    return $(clockElement).data('clock-date');
  }

  // jQeuery FN
  $.fn.clock = function clock() {
    var timeArg = arguments[0],
        timezoneArg = arguments[1];
    
    // use current time if available but not defined
    if (timeArg == "now")
      timeArg = new Date();
    
    $.DEBUG_clock && 
      console.log('clock', {fn_args: arguments, timeArg: timeArg});
    
    this.each(function() {
      var $self = $(this);
      
      var time = timeArg || ( 
        $self.is('[time]') 
        ? (
          $self.attr('time') === 'now' || !$self.attr('time')
          ? new Date() 
          : $self.attr('time')
        )
        : undefined );
      
      if (!time) {

        // do not trigger twice
        if ($self.data('clock-ed') === undefined) {
          var tDate = new Date();
          // param might have been .clock(undefined, timezone) ...
          var tz = timezoneArg || $self.attr('timezone') || undefined;
          
          // apply timezone to date
          if (tz)
            tDate = getDateFromTimezone(tDate, tz);
          
          // initial
          $( function() { update($self, tDate); } );
          // update
          var iv = setInterval( 
            function() {
              var timez = tz;
              
              update($self, 
                timez
                  ? getDateFromTimezone(new Date(), timez)
                  : new Date()
              ); 
           }, 
           1000
          );
          
          $.DEBUG_clock && 
            console.log('clock', {el: $self.get(0), fn: 'update iv', iv: iv});

          // mark as running
          $self.data('clock-ed', iv);
        }
        
      }
      // handle params
      else {
        var date = (time instanceof Date) ? time : getDateFromTime(time),
            timezone = timezoneArg || $self.attr('timezone') || undefined;
            
        if (timezone)
          date = getDateFromTimezone(date, timezone);
          
        update($self, date);
      }
    });
    
    // append control function: stop
    this.stop = $.fn.clockStop;
    // append control function: date
    this.date = $.fn.clockDate;
    
    return this;
  };
  
  // stop the current clock
  $.fn.clockStop = function clockStop() {
    this.each(function() {
      var $self = $(this),
          ret = stopClock($self);

      $.DEBUG_clock && 
        console.log('clock', {el: this, fn: 'stop', ret: ret});
    });
    
    return this;
  };
  
  // get current clocks date object
  $.fn.clockDate = function clockDate() {
    return dateClock(this);
  }
  
  // on DomReady, trigger autostart clocks
  $(function() {
    $(sel.clock+'[autostart], '+sel.clock+'[time]').clock();
  });
  
})(jQuery);

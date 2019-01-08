# simple css clock  (jQuery)


![screen](https://user-images.githubusercontent.com/1894723/50827062-c628b480-133d-11e9-921f-1959abb9225e.png)

## USAGE:

### TEST
Test it here: https://jsfiddle.net/BananaAcid/9hso5zyd/

or with [NodeJS](https://nodejs.org/) installed enter this at the commandline (Windows, Mac, Linux) within the folder
```shell
npx light-server -s . -p 8080 -o
```

### INSTALL

```html
<link rel="stylesheet" type="text/css" href="simple-css-clock.jquery.css">
<script type="text/javascript" src="simple-css-clock.jquery.js"></script>
```

### MARKUP
```html
<clock autostart>
  <period am="AM" pm="PM"></period>
  <hour></hour>
  <minute></minute>
</clock>
```

The clock js will find any clock with autostart or time and will initialize them. This can be done with the jQuery methods as well.

What the clock shows or how it works, depends on the other attributes like timezone and so on. For the jQuery route, there are 



## NOTE - CSS ONLY (JavaScript free)
 You do not need the javascript, you could just set the hour, minute, second with:
```css
clock minute {
  transform: rotateZ(90deg);
}
```
and a markup only solution could be
```html
<clock period="am"> <!--  center=""> -->
  <period>AM</period>
  <hour style="transform: rotateZ(112deg);"></hour>
  <minute style="transform: rotateZ(3deg);"></minute>
  <second style="transform: rotateZ(60deg);"></second>
  <!-- <center></center> -->
</clock>
```
to rotate: 6 deg for each minute or second, 30 deg for each hour.

## Markup hirachy
leave out, what you do not want to be shown
- `<clock>`{:.html}
    + Attr: `center=""`         set a center spot and use the param if used - for its  style see `clock[center]:after`
    + Attr: `time=""`           set the time to show on the clock
    + Attr: `timezone=""`       set the timezone to convert time to

	1. `<period>`{:.html}
	    + Attr: `am="AM" / pm="PM"`           the am or pm text to show (ideas: you could leave both empty, if you want to use fill anyways - or just set one.)
	    + Prop: `fill`              to fill the background to be used as image holder (use `period[is="am"] {background:...}`{:.css} )

	2. `<hour>`{:.html}
	3. `<minute>`{:.html}
	4. `<second>`{:.html}
	5. `<center>`{:.html}

## jQuery commands
- `$(elem).clock()` to make it run with the current time
- Use the attribute `autostart` on the clock elem to make it start on domready. 
- Use the attribute `center` to overlay a center spot (use `center="?"` to add an icon within the spot). You may also use the `<center>`{:.html} tag.
- Use the attribute `time="10:11:12"` to manually set the time (it will not progress).
   - using `time` or `time=""` or `time="now"` will result in the current time.
- Use the attribute `timezone="Australia/Sydney"` to manually set the timezone.
   - the time will be modified by timezone before displaying.

- `$(elem).clock('09:12:45');`{:.js} to set it to a specific time.
- `$(elem).clock('09:12:45', 'Australia/Sydney');`{:.js} to set it to a specific time and timezone.
- `$(elem).clock(undefined, 'Australia/Sydney');`{:.js} to set it to a specific timezone only.
- `$(elem).clock(new Date);`{:.js}   to pass a date object and set it to a specific time

- `$(elem).clock().stop();`{:.js} to stop the selected clocks
- `$(elem).clockStop();`{:.js}    to stop the selected clocks

- `var dateOfClock = $(elem).clock().date();`{:.js}  to get the first clock's date object
- `var dateOfClock = $(elem).clockDate();`{:.js}     to get the first clock's date object

- `$.DEBUG_clock = true;`{:.js} to enable debug logging

## Style

### clock {}

    - bockground-color / background-image
    - width/height            for size
 
### minute, hour, second {}

    - background-color        for the color
    - width                   for the hand's thickness
    - height                  50% is the max length (diameter/2), 0% the shortest

### period {}

    - background-color        for a box around AM/PM

... `clock[period="am"]`{:.css} will be set for styling by jQuery

### center, clock[center]:after {}

    - min-width / min-height  for the center spot size
    - background-color        for the spot color
    - font-family             if not set on the clock, set it here to use a specific font-awesome icon
    - font-size               for the icon size
    - line-height             for the vertical alignment - should match the px height of min-height if used
    - color                   for the icon color

`<center>`{:.html} will be overlapped in the html view hirachy by `<clock center="">`{:.html} - so both could be used for a more complex styling.

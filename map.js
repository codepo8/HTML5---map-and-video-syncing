/*
  Animating a path on a Google Map by Christian Heilmann
  Homepage: http://isithackday.com/spirit-of-indiana/map.html
  Copyright (c)2010 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
  var spirit = {};
  spirit.initialize = function(){

/* Define start and end points */
    var start = [40.743529, -73.611844],
        end = [48.8566667, 2.3509871],
        startpos = new google.maps.LatLng(start[0],start[1]),
        endpos = new google.maps.LatLng(end[0],end[1]),
        mapelm = document.getElementById('mapcanvas');

/* Draw map */
   var map = new google.maps.Map(
                mapelm,
                {
                  disableDefaultUI:true,
                  zoom: 2,
                  center: new google.maps.LatLng(start[0],start[1]),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
                });
    var markernyc = new google.maps.Marker({
         position: startpos, 
         map:map, 
         title:'NYC'
     });
     var markerparis = new google.maps.Marker({
          position:endpos, 
          map:map, 
          title:'Paris'
     });
        
        
/* Assume 30 animation frames and calculate the necessary increase */
     var animationstart = 0,
         animationend = 30,
         now = animationstart,
         amount = animationend - animationstart,
         pos = [],
         addx = (end[0] - start[0]) / amount,
         addy = (end[1] - start[1]) / amount,
         i,full,path;
        
/* Calculate the points and seed the array */        
    for(i=animationstart;i<animationend;i++){
      pos[i] = new google.maps.LatLng(start[0] += addx,start[1] += addy);
    }

/* Once all tiles have loaded, start the animation */
    google.maps.event.addListener(map,'tilesloaded',function(){
      spirit.draw();
    },false);

/* Recursive method to draw the line and move the map*/
    spirit.draw = function(){
      var path = new google.maps.Polyline({
            path: [startpos,pos[now]],
            strokeColor:'#c00',
            strokeOpacity:0.7,
            strokeWeight:10
      });
      path.setMap(map);
      map.panTo(pos[now]);
      now = now + 1;
      if(now < animationend-1){
        setTimeout(spirit.draw,200);
      }
    };
  };
  
/* Create the map when the page is done */  
  window.addEventListener('load',function(){
    spirit.initialize();
  }, false);  

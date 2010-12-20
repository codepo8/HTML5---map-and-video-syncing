/*
  Spirit of Indiana HTML5 demo by Christian Heilmann
  Homepage: http://isithackday.com/spirit-of-indiana
  Copyright (c)2010 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/

var spirit = {};
spirit.initialize = function() {

  var i,but,now,full,path,audioplay = false,hidden = true;

/* Boolean to see if the video started */
  var played = false;
  
/* Get all the necessary DOM elements, including audio and video */  
  var mapelm = document.getElementById('mapcanvas'),
      stage = document.getElementById('stage'),
      v = document.getElementsByTagName('video')[0],
      a = document.getElementsByTagName('audio')[0];
      var drmbedamned = document.createElement('span');
      drmbedamned.innerHTML = 'Darn copyright&hellip;';
      drmbedamned.className = 'drm';
      stage.appendChild(drmbedamned);
  
/* Define the start and endpoint of the path animation and draw map */
  var start = [40.743529, -73.611844],
      end = [48.8566667, 2.3509871],
      startpos = new google.maps.LatLng(start[0],start[1]),
      endpos = new google.maps.LatLng(end[0],end[1]),
      map = new google.maps.Map(
        mapelm,
        {
          disableDefaultUI:true,
          zoom: 2,
          center: new google.maps.LatLng(start[0],start[1]),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        }
      );
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


/* 
  Start the animation at second 21 and calculate the amount of 
  needed steps in th path animation.
*/  
  var animationstart = 21,
      animationend = parseInt(v.duration,10)+1,
      amount = animationend - animationstart,
      pos = [],
      addx = (end[0] - start[0]) / amount,
      addy = (end[1] - start[1]) / amount;
  
/* Create an array of location points in between start and end */    
  for(i = animationstart; i < animationend; i++) {
    pos[i] = new google.maps.LatLng(
                                     start[0] += addx,
                                     start[1] += addy
                                   );
  }

/* Fast forward the video to second 7 */
v.currentTime = 7;

/* Once the map has finished rendering... */
  google.maps.event.addListener(map,'tilesloaded',function(){

/* If the animation hasn't played (as tilesloaded fires on pan :( ) */
    if(played === false){

/* Create a button to start the video */
      var but = document.createElement('button');
      but.innerHTML = 'Click to see Lindbergh\'s flight';
      but.addEventListener('click',function(e){
        v.currentTime = 7;
        now = animationstart;
        v.play();
        this.style.display = 'none';
        e.preventDefault();
      },false);
      stage.appendChild(but);

/* Loop the song... */
      a.addEventListener('ended', function(o) {
        a.currentTime = 0;
      },false);

/* 
   Once the video has finished, stop the audio, remove the button 
   and roll the credits
*/
      v.addEventListener('ended',function(o){
        a.pause();
        spirit.credslist.parentNode.style.display = 'block';
        spirit.creds();
      },false);

/* When the timestamp has changed... (this fires a lot!) */ 
      v.addEventListener('timeupdate',function(o){

/* execute every second rather than fraction of second */
        full = parseInt(v.currentTime,10);

/* 
  If the time is the right to start the animation, change map and video
  opacity to show both...
*/
        if(full === now-1){
          mapelm.style.opacity = 0.8;
          v.style.opacity = 0.4;
        }

/* If the animation started, play the music*/
        if(full === animationstart+1 && audioplay === false){
          a.play();
          audioplay = true;
        }

/* show and hide copyright nag */
        if(full === animationstart+2 && hidden === true){
          drmbedamned.style.display = 'block';
          hidden = false;
        }

        if(full === animationstart+3 && hidden === false){
          drmbedamned.style.display = 'none';
          hidden = true;
        }

/* 
  if the next second was reached, draw the line and pan the map, then 
  increase the counter
*/
        if(full >= now) {
          path = new google.maps.Polyline({
              path: [startpos,pos[full]],
              strokeColor:'#c00',
              strokeOpacity:0.7,
              strokeWeight:10
          });
          path.setMap(map);
          map.panTo(pos[full]);
          now = now + 1;
        }

      },false);

/* set played to true to prevent double execution from tilesloaded */
      played = true;
    }
  });
};

/* 
  Very rough and ready animation of the credits 
  nothing amazing to see here... 
*/
spirit.now = 400;
spirit.credslist = document.getElementById('credits').
                   getElementsByTagName('ul')[0];
spirit.creds = function(){
  spirit.now -= 2;
  spirit.credslist.style.marginTop = spirit.now+'px';
  if(spirit.now > -300){
    setTimeout(spirit.creds,50);
  }
};

/* If the page loaded - go for it... */
window.addEventListener('load',function(){
  spirit.initialize(); 
},false);  

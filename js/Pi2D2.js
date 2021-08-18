/*
 Pi2D2 A Dynon D2 knock off to run on the Rasberry Pi 2
 David Ross
 yada yada
 blah blah

*/

var Pi2D2 =  {

   configs: {
      // things I expect the user will want to change
      vspeeds: { Vso: 41, Vsi: 45, Vfe: 82, Vno: 108, Vne: 136 },
      gmeter: { maxload: 4 },
      vsi: { maxrate: 1500 },
      alarms: {
         pitch: { max: 100, min: -100 },
         roll: { max: 150, min: -150 },
         speed: { max: 140, min: 60 },
         gload: { max: 4, min: -2 },
         vsi: { max: 400, min: -400 },
         compass: 15,
         altitude: 50
      },
//**********  EMS Stuff **********************************************************
      RPM_limits: { Green: 1800, Yellow: 5200, Red: 5800},
      Oil_Temp_limits: { YellowLow: -50, Green: 50, YellowHigh: 100, RedHigh:120 }
   },

   settings: {
    // things I expect a programer will want to change for a different sreen size
      screen: {x: 480, y:320},
      compass: {x: 240, y: 855, r: 590, opacity: .3 },
      altitude: { x: 385, y: 55 },
      speed: { x: 90, y: 160},
      smallFont: { fill: '#ffffff', stroke: 'none', 'font-size': '18', 'text-anchor': 'middle' },
      largeFont: { fill: '#ffffff', stroke: 'none', 'font-size': '35', 'text-anchor': 'middle' },
      cardinalFont: { fill: '#ffffff', stroke: 'none', 'font-size': '32', 'text-anchor': 'middle' },
      compassFont: { fill: '#ffffff', stroke: 'none', 'font-size': '30', 'text-anchor': 'middle' },
      gmeter: { maxrate: 4, x: 50, y: 160, degrees: 120 },
      vertspeed: {x: 430, y: 160 },
//**********  EMS Stuff **********************************************************
      rpm: {x: 20, y: 410, r: 70}, // x,y - position, r - radius of the round gauge, s - width of the line
      FuelFlow: {x: 55, y: 500 },
      FuelPressure: {x: 55, y: 545 },
      FuelTank1: {x: 0, y: 560, BarSize: 120 },
      OilPressure: {x: 200, y: 345 },
      OilTemperature: {x: 200, y: 385 },
      Volts: {x: 350, y: 345 },
      AmpsAlternator: {x: 350, y: 385 },
      AmpsBattery: {x: 350, y: 425 },
      FlightClock: {x: 215, y: 445 },
      EGT1: {x: 230, y: 492 },
      EGT2: {x: 340, y: 492 },
      EGT3: {x: 230, y: 512 },
      EGT4: {x: 340, y: 512 },
      CHT1: {x: 230, y: 560 },
//      CHT2: {x: 340, y: 540 },
//      CHT3: {x: 230, y: 560 },
      CHT4: {x: 340, y: 560 },

   },

   values: {
    // Current values of each widget
      pitch: 0,
      roll: 0,
      speed: 0,
      cdi: 0,
      glideslope: 0,
      altitude: 0,
      slip: 0,
      turn: 0,
      altimeter: 1013,
      heading: 1,
      headingBug: 0,
      altitudeBug: 0,
      gload: {load: 1, maxpos: 1, maxneg: 1},
      vertspeed: {rate: 0},
      rpm: 0,
      FuelFlow: 0,
      FuelTank1: 0,
      OilPressure: 0,
      OilTemperature: 0,
      Volts: 0,
      AmpsAlternator: 0,
      AmpsBattery: 0
   },

   inop: {
      cdi: {},
      glideslope: {},
      gmeter: {},
      vertspeed: {},
      compass: {},
      speed: {},
      pitch: {},
      roll: {},
      atittude: {}
   },

   alarm: {
      gmeter: {},
      vertspeed: {},
      compass: {},
      speed: {},
      pitch: {},
      roll: {},
      atittude: {}
   },


   init: function() {
      s = this.settings;
      v = this.values;
      c = this.configs;
      svg = Snap('#Pi2D2_SVG');
      this.pitch = this.pitch();
      this.roll = this.roll();
      this.compass = this.compass();
      this.headingBug = this.headingBug();
      this.speed = this.speed();
      this.altitude = this.altitude();
      this.altimeter = this.altimeter();
//      this.gmeter = this.gmeter();
      this.vertspeed = this.vertspeed();
//      this.cdi = this.cdi();
//      this.glideslope = this.glideslope();
//      this.altitudeBug = this.altitudeBug();
      this.slip = this.slipIndicator();
      this.turn = this.turnIndicator();

// hide the bottom part of the compass and create blan fiels for EMS gauges
     svg.rect(0, s.screen.y ,s.screen.x, s.screen.y).attr( {fill: '#000000'});

     this.rpm = this.rpm();
     this.FuelFlow = this.FuelFlow();
     this.FuelPressure = this.FuelPressure();
     this.FuelTank1 = this.FuelTank1();
     this.Endurance = this.Endurance();
     this.OilPressure = this.OilPressure();
     this.OilTemperature = this.OilTemperature();
     this.Volts = this.Volts();
     this.AmpsAlternator = this.AmpsAlternator();
     this.AmpsBattery = this.AmpsBattery();

     this.FlightClock = this.FlightClock();

     this.EGT1 = this.EGT1();
     this.EGT2 = this.EGT2();
     this.EGT3 = this.EGT3();
     this.EGT4 = this.EGT4();

     this.CHT1 = this.CHT1();
//     this.CHT2 = this.CHT2();
//     this.CHT3 = this.CHT3();
     this.CHT4 = this.CHT4();


// lines between EMS gages to make them more readabale
svg.line(   0, 325, 479, 325).attr( {stroke:'#AAAAAA', 'stroke-width': '2'});  // horiz 0
svg.line(   0, 417, 335, 417).attr( {stroke:'#AAAAAA', 'stroke-width': '2'});  // horiz 1
svg.line(   190, 460, 479, 460).attr( {stroke:'#AAAAAA', 'stroke-width': '2'});  // horiz 2
svg.line(   190, 529, 479, 529).attr( {stroke:'#AAAAAA', 'stroke-width': '2'});  // horiz 3

svg.line( 190, 325, 190, 570).attr( {stroke:'#AAAAAA', 'stroke-width': '2'});  // vert 1
svg.line( 335, 325, 335, 460).attr( {stroke:'#AAAAAA', 'stroke-width': '2'});  // vert 2

// static text
svg.text(322, 475, "EGT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });
svg.text(322, 544, "CHT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });


   return 1;

   },

   ///////////////////
   gmeter: function(){
      x = s.screen.x;
      y = s.screen.y;
      gx = s.gmeter.x;
      gy = s.gmeter.y;
      steps = c.gmeter.maxload+1; // ten steps
      degrees = 33/steps; // 2 degrees per step

      gmeterScale = svg.g();
         startX = -250;
         startY = y/2;
         radius = 306;
         startAngle = 339;
         endAngle = 28;
         var x1 = startX + radius * Math.cos(Math.PI * startAngle/180);
         var y1 = startY + radius * Math.sin(Math.PI * startAngle/180);
         var x2 = startX + radius * Math.cos(Math.PI * endAngle/180);
         var y2 = startY + radius * Math.sin(Math.PI * endAngle/180);

         var pathString = "M"+ startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " z";

         gmeterScale.add(svg.path( pathString ).attr( { opacity: .1, onclick: 'Pi2D2.gmeter("reset")'}) ); // TODO use this arc for inop

      for ( i=0; i<steps; i++ ){
         gmeterScale.add(
            svg.line( gx-20, y/2, gx-10, y/2 ).attr( { stroke: '#ffffff', 'stroke-width': 2 }).animate({transform: 'r' +((i*degrees)+degrees) +',' +(-250)+',' +(y/2) }, 100),
            svg.line( gx-20, y/2, gx-10, y/2 ).attr( { stroke: '#ffffff', 'stroke-width': 2 }).animate({transform: 'r-' +((i*degrees)-degrees) +',' +(-250)+',' +(y/2) }, 100),
            svg.text(gx, gy+7, i ).attr(s.smallFont).animate({transform: 'r' +((i*degrees)+degrees) +',' +(-250)+',' +(y/2) }, 100),
            svg.text(gx, gy+7, i).attr(s.smallFont).animate({transform: 'r-' +((i*degrees)-degrees) +',' +(-250)+',' +(y/2) }, 100)
         );
      }

      gmeterScale.add( svg.text(gx, gy+7, '0').attr(s.smallFont).animate({transform: 'r' +(degrees) +',' +(-250)+',' +(y/2) }, 100) );

      this.Gload = svg.line( gx-10, y/2, -250, y/2 ).attr( {stroke:'#ffffff', 'stroke-width': '5'});
      this.GloadMaxPos = svg.circle( gx-10, y/2, 3 ).attr( {stroke:'#ffffff', 'stroke-width': '3', fill: '#ffffff' });
      this.GloadMaxNeg = svg.circle( gx-10, y/2, 3 ).attr( {stroke:'#ffffff', 'stroke-width': '3', fill: '#ffffff' });


//INOP
      this.inop.gmeter = svg.group(
        svg.path (pathString).attr( {fill: 'red', opacity: .8 })
      ).attr( {display: 'none'});

      this.alarm.gmeter = svg.group(
            svg.rect((x/2)-100, 50, 200, 50).attr( {fill: 'red', opacity: .9 }),
            svg.text((x/2), 90, "G LOAD").attr( s.cardinalFont )
            ).attr( { display: 'none'} );

      return function( load ) {
         if ( load == null ) { return v.gload; }
         x = s.screen.x;
         y = s.screen.y;
         gx = s.gmeter.x;
         gy = s.gmeter.y;
         degrees = 33/(c.gmeter.maxload+1); // 2 degrees per step

         if (load == 'reset' ) {
            v.gload.load =  1;
            v.gload.maxpos = 1;
            v.gload.maxneg = 1;
            this.GloadMaxPos.animate({transform: 'r0,' +(-250)+',' +(y/2) }, 100);
            this.GloadMaxNeg.animate({transform: 'r0,' +(-250)+',' +(y/2) }, 100);
            this.Gload.animate({transform: 'r0,' +(-250)+',' +(y/2) }, 100);
            return v.gload;
         }
/*
         if ( load == 'inop') { this.inop.gmeter.attr({display: 'inline'}); }
         else {this.inop.gmeter.attr({display: 'none'}); }

         if ( load > c.alarms.gload.max || load < c.alarms.gload.min  ) { this.alarm.gmeter.attr({display: 'inline'}); }
         else {this.alarm.gmeter.attr({display: 'none'}); }
*/
         this.Gload.animate({transform: 'r' +((load*degrees)-degrees)*-1 +',' +(-250)+',' +(y/2) }, 100);
            if ( load > v.gload.maxpos ){
               v.gload.maxpos = load;
               this.GloadMaxPos.animate({transform: 'r' +((load*degrees)-degrees)*-1 +',' +(-250)+',' +(y/2) }, 100);
            }
            if ( load < v.gload.maxneg ){
               v.gload.maxneg = load;
               this.GloadMaxNeg.animate({transform: 'r' +((load*degrees)-degrees)*-1 +',' +(-250)+',' +(y/2) }, 100);
            }
            return (v.gload.load =  load);
         };
   },

   //////////////////
   cdi: function() {
      x = s.screen.x;
      y = s.screen.y;

      svg.group(
//          svg.rect( (x/2)-120, (y/2)+70, 240, 36).attr({fill: '#54350a'} ),

         svg.rect( (x/2)-110, (y/2)+75, 220, 20).attr( {fill: 'black', opacity: .7 }),

         svg.circle( (x/2), 245, 10).attr( {'stroke':'#ffffff', 'stroke-width':4, fill: 'none'}),

         svg.circle( (x/2)+25,  245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x/2)+50,  245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x/2)+75,  245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x/2)+100, 245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),

         svg.circle( (x/2)-25,  245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x/2)-50,  245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x/2)-75,  245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x/2)-100, 245, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'})
      );

      this.CDINeedle = svg.group(
         svg.line(240,230, 240, 260).attr({ 'stroke': '#00ff00', 'stroke-width': 10 }), //, 00ff00mask: svg.circle( 240, 245, 5 ).attr( {fill: 'none'}) } )
         svg.circle( 240, 245, 5).attr( { fill: '#000'})
      );

      // VOR Box
      svg.rect( 65, 198, 60, 60).attr({ opacity: .4, fill: 'black' } );
      svg.text( 95, 215, '117.95').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '15', 'text-anchor': 'middle' });
      svg.text( 95, 235, '039').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20', 'text-anchor': 'middle' });
      svg.text( 95, 250, 'TO').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '15', 'text-anchor': 'middle' });

      //GPS Box
      svg.rect( 65, 124, 60, 24).attr({ opacity: .4, fill: 'black' } );
      svg.text( 95, 143, 'GPS').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20', 'text-anchor': 'middle' });

      this.inop.cdi = svg.group (
         svg.rect( (x/2)-110, (y/2)+70, 220, 30).attr( {fill: 'red', opacity: .8 })
      ).attr( {display: 'none'});

       return function( deflection ) {
         if ( deflection == null ) { return v.cdi; }
         step = 25; // 25 pixles for one degree or mile of deflection
         this.CDINeedle.animate( {transform: 't' +(step*deflection)+',0' }, 100);
         return (v.cdi =  deflection);
         };
   },


///////////////////////////
   glideslope: function() {
      x = s.screen.x;
      y = s.screen.y;

      svg.g(
         svg.rect( (x-80), (y/2)-97, 20, 194).attr( {fill: 'black', opacity: .5 }),
         svg.circle( (x-70), (y/2), 10).attr( {'stroke':'#ffffff', 'stroke-width':4, fill: 'none'}),
         svg.circle( (x-70), (y/2)+22, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)+44, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)+66, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)+88, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)-22, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)-44, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)-66, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'}),
         svg.circle( (x-70), (y/2)-88, 7).attr( {'stroke':'#ffffff', 'stroke-width':2, fill: 'none'})
      );

      this.ILSNeedle = svg.group(
         svg.line(395, (y/2), 425, (y/2)).attr({ 'stroke': '#00ff00', 'stroke-width': 10 }),
         svg.circle( (x-70), (y/2), 5).attr( { fill: '#000'})
      );

      //ILSNeedle.animate({transform: 't0,40'},100);

      this.inop.glideslope = svg.group (
         svg.rect( (x-85), (y/2)-97, 30, 194).attr( {fill: 'red', opacity: .8 })
      ).attr( {display: 'none'});
/*
       /// VLOC Box
      svg.rect( 335,184, 60, 24).attr({fill: 'black', opacity: .5 } );
      svg.text( 365,203, 'VLOC').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20', 'text-anchor': 'middle' });
*/

      // Altitude Box
      this.altitudeBugBox = svg.g(
         svg.rect( 320, 114, 75, 32).attr({fill: 'black', opacity: .3 } ),
         svg.text( 335, 123, "ALT Bug").attr({fill: '#ffffff', stroke: 'none', 'font-size': '10' }),
         this.altitudeBugText = svg.text( 358, 143, '0').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20', 'text-anchor': 'middle' })
      );

       return function( deflection ) {
         if ( deflection == null ) { return v.glideslope; }
         if ( deflection > 5 ) { deflection = 5;  }
         if ( deflection < -5 ) { deflection = -5;  }
         step = 22; // 25 pixles for one degree or 10 feet of deflection
         this.ILSNeedle.animate( {transform: 't0,' +(step*deflection) }, 100);
         return (v.glideslope =  deflection);
         };

      return 1;
   },


/////////////////////////
   vertspeed: function(){
      x = s.screen.x;
      y = s.screen.y;
      maxrate = c.vsi.maxrate; // if 1000 fpm
      steps = (maxrate/100)+1; // ten steps
      degrees = 20/steps; // 2 degrees per step
      gx = s.vertspeed.x;
      gy = s.vertspeed.y;

      startX = x+250;
      //startX = x/2;
      startY = y/2;
      radius = 300;
      startAngle = 159;
      endAngle = 200;

      var x1 = startX + radius * Math.cos(Math.PI * startAngle/180);
      var y1 = startY + radius * Math.sin(Math.PI * startAngle/180);
      var x2 = startX + radius * Math.cos(Math.PI * endAngle/180);
      var y2 = startY + radius * Math.sin(Math.PI * endAngle/180);

      var pathString = "M"+ startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " z";

      vsiScale = svg.g(
                       svg.path( pathString ).attr( { opacity: .2 }),
                       svg.text(gx+20, gy+7, '0').attr(s.smallFont)
                      );

      for ( i=0; i<steps; i++ ){
         if ( i%5 === 0 ) {
            vsiScale.add (
               svg.text(gx+22, gy+7, i ).attr(s.smallFont).animate({transform: 'r' +(i*degrees) +',' +(x+250)+',' +(y/2) }, 100),
               svg.text(gx+22, gy+7, i).attr(s.smallFont).animate({transform: 'r-' +(i*degrees) +',' +(x+250)+',' +(y/2) }, 100),
               svg.line( gx+13, y/2, gx, y/2 ).attr( { stroke: '#ffffff', 'stroke-width': 3 }).animate({ transform: 'r' +(i*degrees) +',' +(x+250)+',' +(y/2) }, 100),
               svg.line( gx+13, y/2, gx, y/2 ).attr( { stroke: '#ffffff', 'stroke-width': 3 }).animate({ transform: 'r-' +(i*degrees) +',' +(x+250)+',' +(y/2) }, 100)
            );
         }
         else {
            vsiScale.add(
               svg.line( gx+8, y/2, gx, y/2 ).attr( { stroke: '#ffffff', 'stroke-width': 2 }).animate({ transform: 'r' +(i*degrees) +',' +(x+250)+',' +(y/2) }, 100),
               svg.line( gx+8, y/2, gx, y/2 ).attr( { stroke: '#ffffff', 'stroke-width': 2 }).animate({ transform: 'r-' +(i*degrees) +',' +(x+250)+',' +(y/2) }, 100)
            );
         }
      }

      // VSI needle
      this.VertSpeed = svg.line( gx+10, y/2, x+250, y/2 ).attr( {stroke:'#ffffff', 'stroke-width': '5'});

        //INOP
      this.inop.vertspeed = svg.group(
         svg.path( pathString ).attr( {fill: 'red', opacity: .8 })
         ).attr({display: 'none'});

      this.alarm.vertspeed = svg.group(
            svg.rect((x/2)-75, 50, 150, 50).attr( {fill: 'red', opacity: .9 }),
            svg.text((x/2), 90, "VSI").attr( s.cardinalFont )
            ).attr( { display: 'none'} );


      return function( rate ) {
         if ( rate == null ) { return v.vertspeed; }
/*
         if ( rate == 'inop') { this.inop.vertspeed.attr({display: 'inline'}); }
         else { this.inop.vertspeed.attr({display: 'none'}); }
         if ( rate > c.alarms.vsi.max || rate < c.alarms.vsi.min  ) { this.alarm.vertspeed.attr({display: 'inline'}); }
         else { this.alarm.vertspeed.attr({display: 'none'}); }
*/
         x = s.screen.x;
         y = s.screen.y;
         gx = s.vertspeed.x;
         gy = s.vertspeed.y;
//         maxrate = c.vsi.maxrate; // if 1000 fpm
//         steps = (c.vsi.maxrate/100)+1; // ten steps
         degrees = 20/((c.vsi.maxrate/100)+1); // 2 degrees per step
         this.VertSpeed.animate({ transform: 'r' +((rate/100)*degrees) +',' +(x+250)+',' +(y/2) }, 100);
         return ( v.vertspeed.rate = rate);
      };
   },


   ///////////////////
   pitch: function(){
      x = s.screen.x;
      y = s.screen.y;
      //////////////////////////////
      this.pitchLadder = svg.g ();
      for ( i=0; i<10; i++ ) {
            this.pitchLadder.add( svg.line( (x/2)-35,  ((y/2)+(i*-40)), (x/2)+35, ((y/2)+(i*-40)) ).attr( { stroke: '#ffffff', 'stroke-width': '2' }) );
            this.pitchLadder.add( svg.text( 187, ((y/2)+(i*-40))+5, (i*10) ).attr( s.smallFont ) );
            this.pitchLadder.add( svg.text( 292, ((y/2)+(i*-40))+5, (i*10) ).attr( s.smallFont ) );
            this.pitchLadder.add( svg.line( (x/2)-20,  ((y/2)+(i*-20))+20, (x/2)+20, ((y/2)+(i*-20))+20 ).attr( { stroke: '#ffffff', 'stroke-width': '2' }) );
            this.pitchLadder.add( svg.line( (x/2)-35,  ((y/2)+(i*40)), (x/2)+35, ((y/2)+(i*40)) ).attr( { stroke: '#ffffff', 'stroke-width': '2' }) );
            this.pitchLadder.add( svg.text( 187, ((y/2)+(i*40))+5, (i*10) ).attr( s.smallFont ) );
            this.pitchLadder.add( svg.text( 292, ((y/2)+(i*40))+5, (i*10) ).attr( s.smallFont ) );
            this.pitchLadder.add( svg.line( (x/2)-20,  ((y/2)+(i*20))-20, (x/2)+20, ((y/2)+(i*20))-20 ).attr( { stroke: '#ffffff', 'stroke-width': '2' }) );
      }

      this.pitchLadderPitch = svg.group( this.pitchLadder );

      this.theworld = svg.group(
         svg.rect( -1000, -1000, 2000, 2000).attr({fill: '#004cff'} ), // Sky
         svg.rect ( -1000, (y/2), 2000, 2000).attr({fill: '#96693F'} ),//54350a'} ), // Earth
         svg.line ( -1000, (y/2), 2000, (y/2) ).attr( { stroke: '#ffffff', 'stroke-width': '1' }), // while line

         // Side horizon markers (yellow)
         svg.rect( 120, 157.5, 20, 5 ).attr( {fill: '#ffde29' }),
//         svg.rect( 120, 157.5, 5, 15 ).attr( {fill: '#ffde29' }),
         svg.rect( 340, 157.5, 20, 5 ).attr( {fill: '#ffde29' }),
//         svg.rect( 355, 157.5, 5, 15 ).attr( {fill: '#ffde29' }),
         svg.circle( (x/2),  (y/2), 6 ).attr( { fill: '#fff' }) // Little ball in the middle
      );

      this.inop.pitch = svg.group(
                        svg.circle((x/2), (y/2), 160).attr( {'fill': 'red', 'fill-opacity': .8} )
                    ).attr( {display: 'none'});

      this.alarm.pitch = svg.group(
            svg.rect((x/2)-75, 50, 150, 50).attr( {fill: 'red', opacity: .9 }),
            svg.text((x/2), 90, "PITCH").attr( s.cardinalFont )
            ).attr( { display: 'none'} );

      return function( pitch ) {
         if ( pitch == null ) { return v.pitch; }
/*
         if ( pitch == 'inop' ) { this.inop.pitch.attr( {display: 'inline'}); }
         else {
            if ( pitch > c.alarms.pitch.max || pitch < c.alarms.pitch.min ) {
               this.alarm.pitch.attr( {display: 'inline'});
            }
            else {
               this.alarm.pitch.attr( {display: 'none'});
            }
         this.inop.pitch.attr( {display: 'none'});
*/
         this.pitchLadderPitch.animate( { transform: 't0,'+(pitch*4) }, 100  );
         this.theworld.animate( { transform: 't0,'+(pitch*4) }, 100  );
      return ( v.pitch = pitch);
      }
   },

   //////////////////
   roll: function(){
      x = s.screen.x;
      y = s.screen.y;
      //TODO automate build
      // hashes 0, 5, 10, 15, 20,
      this.rollBars = svg.group(
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-140  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r10," + (x/2)+"," + (y/2) },100),
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-140  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r20," + (x/2)+"," + (y/2) },100),
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-140  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r-10," + (x/2)+"," + (y/2) },100),
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-140  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r-20," + (x/2)+"," + (y/2) },100),

         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-150  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r30," + (x/2)+"," + (y/2) },100),
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-150  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r60," + (x/2)+"," + (y/2) },100),
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-150  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r-30," + (x/2)+"," + (y/2) },100),
         svg.line(  x/2, (y/2)-125, (x/2), (y/2)-150  ).attr( { stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r-60," + (x/2)+"," + (y/2) },100),

         svg.circle( x/2, (y/2)-130, 3 ).attr( { fill: '#ffffff', stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r-45," + (x/2)+"," + (y/2) },100),
         svg.circle( x/2, (y/2)-130, 3 ).attr( { fill: '#ffffff', stroke: '#ffffff', 'stroke-width': '4' }).animate( {transform: "r45," + (x/2)+"," + (y/2) },100),
         svg.path( "m 250, 15 -20, 0 10 , 25").attr({  fill: "#ffffff"})
      );

      this.pitchLadderRoll = svg.group( this.pitchLadderPitch );
      this.thewholeworld = svg.group( this.theworld, this.rollBars);
      this.pitchLadderWindow = svg.group ( this.pitchLadderRoll ).attr( { clip: (svg.circle( (x/2), (y/2), 115) )});

            // The horizon bar tracks aircraft.
         this.horizonBar = svg.group (
            svg.path( "m 225, 60 30, 0 -15 , -25").attr({  fill: "#ffde29"}), // Top Roll Marker

            svg.circle( 240, 160, 9  ).attr({  stroke: "#ffde29", "stroke-width":  3, fill:'none'}),

            svg.line( 142, (y/2), 202, (y/2) ).attr({ stroke: '#ffde29', 'stroke-width': '5'}),
            svg.line( (x/2)-5, (y/2)+6, (x/2)-22, (y/2)+20 ).attr( { stroke: '#ffde29', 'stroke-width': '5'}),
            svg.line( (x/2)-20, (y/2)+20, (x/2)-40, (y/2) ).attr( { stroke: '#ffde29', 'stroke-width': '5'}),

            svg.line( 278, (y/2), 338, (y/2) ).attr({ stroke: '#ffde29', 'stroke-width': '5'}),
            svg.line( (x/2)+5, (y/2)+6, (x/2)+22, (y/2)+20 ).attr( { stroke: '#ffde29', 'stroke-width': '5'}),
            svg.line( (x/2)+20, (y/2)+20, (x/2)+40, (y/2) ).attr( { stroke: '#ffde29', 'stroke-width': '5'})
            );

//INOP
        this.inop.roll = svg.group(
                  svg.circle((x/2), (y/2), 145).attr( {'fill': 'red', 'fill-opacity': .8} )
              ).attr( {display: 'none'});

         this.alarm.roll = svg.group(
            svg.rect((x/2)-75, 50, 150, 50).attr( {fill: 'red', opacity: .9 }),
            svg.text((x/2), 90, "ROLL").attr( s.cardinalFont )
            ).attr( { display: 'none'} );


        return function (roll){
            if ( roll == null ) { return v.roll; }

/*
            if ( roll == 'inop' ) { this.inop.roll.attr( {display: 'inline'}); }
            else { this.inop.roll.attr( {display: 'none'}); }
            if ( roll > c.alarms.roll.max || roll < c.alarms.roll.min  ) { this.alarm.roll.attr({display: 'inline'}); }
            else { this.alarm.roll.attr({display: 'none'}); }
*/
            this.thewholeworld.animate( { transform: 'r' +roll +',240,160' }, 100 );
            this.pitchLadderRoll.animate( { transform: 'r' +roll +',240,160' }, 100 );
            return (v.roll = roll);
        };
    },


      ////////////////////
   compass: function(){
         Cx = s.compass.x;
         Cy = s.compass.y;
         Cr = s.compass.r;
         y = s.screen.y;
         x = s.screen.x;
         opacity = s.compass.opacity;

         //Build the compass
         svg.circle(Cx,Cy,Cr).attr( {'fill-opacity': 1} ).attr({onclick: "setThis('headingBug', ((Pi2D2.compass() % 360)+360)%360 );"});
                 //Compass Marker
        svg.polygon(
                    Cx +',' +((Cy-Cr)+35) +' '
                    +(Cx-15) +',' +((Cy-Cr)+60) +' '
                    +(Cx+15) +',' +((Cy-Cr)+60)
                    ).attr( {fill: '#ffde29'} );
         compassRose = svg.group();

         headingBug = compassRose.line(Cx, Cy, Cx, (Cy-Cr) ).attr( { 'stroke-width': '10',stroke: '#FF00FF'} );

         compassRose.text( Cx, (Cy - Cr*.94), 'N').attr( s.cardinalFont );

         for (var i = 0; i < 36; i++) {
            var r = ( i * 10 );
            var m = r;
            var font = s.compassFont;
            if ( Cr < 20 ) { font = { fill: '#ffffff', stroke: 'none', 'font-size': '10', 'text-anchor': 'middle' };}
            if ( r == 90 )  { m = 'E'; font = s.cardinalFont; }
            if ( r == 180 ) { m = 'S'; font = s.cardinalFont; }
            if ( r == 270 ) { m = 'W'; font = s.cardinalFont; }
            compassRose.text( Cx, (Cy - Cr*.95), m).attr( font ).animate({ transform: 'r' +r+','+Cx+',' +Cy}, 100);
        }

        for (var i = 0; i < 360; i++) {
            y1 = (Cy - Cr*.90);
            y2 = (Cy - Cr*.93);
            width=2;
            if ( i % 5 === 0 ) {
               y2 = (Cy - Cr*.95);
               width=4;
            }
            compassRose.line( Cx, y2, Cx, y1 ).attr( { stroke: '#ffffff', 'stroke-width': width }).animate({ transform: 'r' +i +',' +Cx+',' +Cy }, 100);
        }


//INOP
        this.inop.compass = svg.group(
                                svg.circle(Cx,Cy,Cr).attr( {'fill': 'red', 'fill-opacity': .8} ),
                                svg.text( Cx, (Cy - Cr*.85), 'INOP').attr( s.cardinalFont )
                            ).attr( {display: 'none'});

         this.alarm.compass = svg.group(
               svg.rect((x/2)-100, 50, 200, 50).attr( {fill: 'red', opacity: .9 }),
               svg.text((x/2), 90, "HEADING").attr( s.cardinalFont )
               ).attr( { display: 'none'} );

        return function( heading ) {
            if ( heading == null ) { return v.heading }
/*
            if ( heading == 'inop' ) { this.inop.compass.attr( {display: 'inline'}); }
            else {  this.inop.compass.attr( {display: 'none'}); }
            heading = ( (heading % 360)+360 ) %360;
            if ( ( heading - v.headingBug ) > c.alarms.compass || ( v.headingBug - heading) > c.alarms.compass  ) { this.alarm.compass.attr({display: 'inline'}); }
            else { this.alarm.compass.attr({display: 'none'}); }
*/
            compassRose.animate( { transform: 'r' +heading*-1 +',' +Cx +',' +Cy }, 1 );
            return (v.heading = heading);
        };
    },

   slipIndicator: function() {},

   ///////////////////////////
   turnIndicator: function() {
      y = s.screen.y;
      x = s.screen.x;

      svg.rect( (x/2)-100, 0, 200, 15 ).attr( {opacity: .2 });

      this.turnNeedle = svg.rect( (x/2)-8, 0, 16,15 ).attr( { fill: '#fff' });

      svg.g(
         // The Dog Houses
         svg.rect( (x/2)-13  , 0, 3, 15 ),
         svg.rect( (x/2)+10  , 0, 3, 15 ),
         svg.rect( (x/2)-13,  15, 26, 3 ),

         svg.rect( (x/2)+77  , 0, 3, 18 ),
         svg.rect( (x/2)+100  , 0, 3, 18 ),
         svg.rect( (x/2)+80,  15, 20, 3 ),

         svg.rect( (x/2)-80  , 0, 3, 18 ),
         svg.rect( (x/2)-103  , 0, 3, 18 ),
         svg.rect( (x/2)-100, 15, 20, 3 )
      );

      return function ( rate ) {
         if ( rate == null ) { return v.rate; }
         // 3 degrees per second = two minute turn
         // 99 pixles = 2 minute turn
         this.turnNeedle.animate( { transform: 't' +rate*30 +',0' }, 100 );
         return( v.turn = rate);
      };
   },


   /////////////////////////
   headingBug: function() {
      return function( bug ) {
         if ( bug == null ) { return v.headingBug }
         headingBug.animate( { transform: 'r' +bug +',' +Cx +',' +Cy }, 100 );
         return (v.headingBug = bug);
      };
   },

   /////////////////////////
   altitudeBug: function() {
      return function( alt ) {
         if ( alt == null ) { return v.altitudeBug }
         this.altitudeBugText.attr( {text: alt } );
         v.altitudeBug = alt;
         this.altitude( this.altitude() );
         return (v.altitudeBug);
      };
   },



   ////////////////////////
    altimeter: function() {
        svg.rect( 410, 260, 63, 35).attr({fill: 'black', opacity: .4 } );
        svg.text( 440, 270, 'QNH').attr( {fill: '#ffffff', stroke: 'none', 'font-size': '10', 'text-anchor': 'middle' });

        // TODO Make the number inputs be actual vs haing to *10 and /10 for decimals
        altBox = svg.text( 440, 290, v.altimeter).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20', 'text-anchor': 'middle', onclick: "setThis('altimeter', Pi2D2.altimeter() *100 );" });

       return function( altimeter ){
            if ( altimeter == null ) { return v.altimeter; }
            altBox.attr( {text: altimeter } );
            return (v.altimeter = altimeter);
          };
    },


    ////////////////////////////////////////////////////////////////////////////
    altitude: function( ) {
        x = s.altitude.x;
        y = s.altitude.y;
        // build the altimeter

        alt = { dims: { x: x, y: y },
                      dial : [],
                      centers: [],
                      window: {}
            };

//        alt.group = svg.rect(x, (y-25), 90, 30).attr( {fill: 'none' });
        alt.group = svg.rect(x, (y-25), 90, 30).attr( {fill: 'none' });
        svg.text( x, (y-40), "ALT - FT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '10' });

        tX = -50;
        rX = 120;
        for (j=0; j<5; j++) {
            alt.dial[j] = svg.group(); // 10,000
            tX = tX + 25;
            rX = rX - 25;
            alt.centers[j] = x-rX;
            alt.dial[j].text( (x+tX), y, '0').attr( s.largeFont );
            for (var i = 0; i < 10; i++) {
                r = i*36;
                alt.dial[j].text( (x+tX), y, i).attr( s.largeFont ).attr( { transform: 'r-' +r +','+alt.centers[j] +',' +y }, 1000 );
            }
        }
       alt.window = svg.group( alt.dial[0], alt.dial[1], alt.dial[2], alt.dial[3], alt.dial[4] ).attr({ clip: svg.rect((x-43), (y-35), 200, 40), onclick: "setThis('altitudeBug', Pi2D2.altitude() )" });

//INOP
      this.inop.altitude = svg.group(
         svg.rect((x-43), (y-35), 200, 40).attr( {fill: 'red', opacity: .8 })
            ).attr( {display: 'none'});

      this.alarm.altitude = svg.group(
            svg.rect((x/2)-110, 50, 220, 50).attr( {fill: 'red', opacity: .9 }),
            svg.text((x/2), 90, "ALTITUDE").attr( s.cardinalFont )
            ).attr( { display: 'none'} );

        return function( altitude ){
    //TODO prevent rolling back to 99999
            if ( altitude == null ) { return v.altitude; }
/*
            if ( altitude == 'inop' ) { this.inop.altitude.attr( {display: 'inline'}); }
            else { this.inop.altitude.attr( {display: 'none'}); }
*/
//            correctedAltitude = ( ((v.altimeter - 29.92)*1000) + altitude  );
			correctedAltitude =  altitude  ;
            x = s.altitude.x;
            y = s.altitude.y;
            alt.dial[0].animate( { transform: 'r' +Math.floor( correctedAltitude / 10000 )*36 +',' +alt.centers[0] +',' +y }, 200 );
            alt.dial[1].animate( { transform: 'r' +Math.floor( correctedAltitude / 1000 )*36 +',' +alt.centers[1] +',' +y }, 200 );
            alt.dial[2].animate( { transform: 'r' +Math.floor( correctedAltitude / 100 )*36 +',' +alt.centers[2] +',' +y }, 200 );
            alt.dial[3].animate( { transform: 'r' +Math.floor( correctedAltitude / 10 )*36 +',' +alt.centers[3] +',' +y }, 200 );
            alt.dial[4].animate( { transform: 'r' +Math.floor( correctedAltitude / 1 )*36 +',' +alt.centers[4] +',' +y }, 2 );


/*            if ( ( v.altitudeBug  - altitude ) > c.alarms.altitude || ( altitude - v.altitudeBug ) > c.alarms.altitude  ) {
               this.alarm.altitude.attr({display: 'inline'});
               }
            else { this.alarm.altitude.attr({display: 'none'}); }
*/

       //     this.glideslope( (altitude - v.altitudeBug)/10 );

            return (v.altitude = altitude);
        };
    },
////////////////////////////////////////////////////////////////////////////////
   speed: function(  ){
        // Build speed
        x = s.speed.x;
        y = s.speed.y;
        Vso = c.vspeeds.Vso;
        Vsi = c.vspeeds.Vsi;
        Vfe = c.vspeeds.Vfe;
        Vno = c.vspeeds.Vno;
        Vne = c.vspeeds.Vne;

        asi = {   dial : [],
                  centers: [],
                  window: {} };
        svg.text( (x-20), (y-40), "IAS - KTS").attr({fill: '#ffffff', stroke: 'none', 'font-size': '10' });

        asi.shade1 = svg.rect(0, 0, 50, 320).attr( {fill: '#000000', opacity: 0.3 });
        asi.shade2 = svg.rect(50, 110, 90, 60).attr( {fill: '#000000', opacity: 0.3 });
        asi.group = svg.rect(x, (y-25), 55, 30).attr( {fill: 'none' });

        tX = -50; //tX text placement x coordinate
        rX = 120; //rX text rotation x coordinate
        for (j=0; j<3; j++) {
            asi.dial[j] = svg.group();
            tX = tX + 25;
            rX = rX - 25;
            asi.centers[j] = x-rX;
            asi.dial[j].text( (x+tX), y, '0').attr( s.largeFont );
            for (var i = 0; i < 10; i++) {
                r = i*36;
                asi.dial[j].text( (x+tX), y, i).attr( s.largeFont ).attr( { transform: 'r-' +r +','+asi.centers[j] +',' +y }, 1000 );
            }
        }
        asi.window = svg.group( asi.dial[0], asi.dial[1], asi.dial[2] ).attr({ clip: svg.rect((x-40), (y-35), 100, 45) });

        zero = y;
        asi.arcs = svg.group (
                            //Green Arc
                           svg.rect( 0, zero - Vno*3, 15, Vno*3 - Vsi*3 ).attr( {fill: 'green',stroke: "none", 'stroke-width': "0" }),
                            // White Arc
                            svg.rect( 0, (zero - Vfe*3), 8, (Vfe*3 - Vso*3)).attr( {fill: 'white',stroke: "none", 'stroke-width': "0" }),
                            //Yellow Arc
                            svg.rect( 0, (zero - Vne*3), 15, (Vne*3 - Vno*3) ).attr( {fill: 'yellow',stroke: "none", 'stroke-width': "0" }),
                            //RedLine
                            svg.rect( 0, ( (zero - 150) - Vne*3 ), 15, 150 ).attr( {fill: 'red',stroke: "none", 'stroke-width': "0" })
                         );
         for ( i=0; i<200; i=i+5 ){
            if ( i%10 === 0 ) {
              asi.arcs.add (
                 svg.line(0, zero-i*3, 18, zero-i*3).attr( { stroke: '#ffffff', 'stroke-width': '2' }),
                 svg.text(35, zero-i*3 + 4, i).attr(s.smallFont)
              );
            }
            else {
               asi.arcs.add(
                 svg.line(  0, zero-i*3, 13, zero-i*3).attr( { stroke: '#ffffff', 'stroke-width': '1' })
               );
            }
         }

             // Zero center line for speed tape
    svg.group( asi.arcs ).attr( { clip: svg.rect( 0,20, 50, 300 ) });
//    svg.group( asi.arcs ).attr( {fill: 'red', opacity: .8 });

        svg.polygon( '20,147 40,137 40,157').attr( {fill: '#fff'} );
//INOP
         this.inop.speed = svg.group(
                                svg.rect(x-75, (y-35), 125, 40).attr( {fill: 'red', opacity: .8 })
//                                svg.text(x-10, (y), "INOP").attr( s.cardinalFont )
                            ).attr( {display: 'none'});

         this.alarm.speed = svg.group(
               svg.rect((x/2)-80, 50, 160, 50).attr( {fill: 'red', opacity: .9 }),
               svg.text((x/2), 90, "SPEED").attr( s.cardinalFont )
               ).attr( { display: 'none'} );



        return function ( speed ){
            if ( speed == null ) { return v.speed; }
/*
            if ( speed == 'inop' ) { this.inop.speed.attr( {display: 'inline'}); }
            else { this.inop.speed.attr( {display: 'none'}); }
*/
            x = s.speed.x;
            y = s.speed.y;
            asi.arcs.animate( { transform: 't0,' +((speed*3)-12) }, 200 );
            asi.dial[0].animate( { transform: 'r' +Math.floor( speed / 100 )*36 +',' +asi.centers[0] +',' +y }, 200 );
            asi.dial[1].animate( { transform: 'r' +Math.floor( speed / 10 )*36 +',' +asi.centers[1] +',' +y }, 200 );
            asi.dial[2].animate( { transform: 'r' +Math.floor( speed / 1 )*36 +',' +asi.centers[2] +',' +y }, 200 );
            return v.speed = speed;
        };
    },
//*********************************************************************************************************************
//============================================  EMS Stuff  ============================================================
//*********************************************************************************************************************
    rpm: function(  ){
         x = s.rpm.x;
         y = s.rpm.y;
         r = s.rpm.r;
         YellowLow = 1800;
         YellowHigh = 5500;
         RedHigh = 5800;
         RedTop = 7000;
         svg.text( x, y-r, "RPM").attr({fill: '#ffffff', stroke: 'none', 'font-size': '14' });
         //'stroke-dasharray': '241, 482'
         // 2*3.14*80 = 251
         Arc = 3.14 * r;
         svg.circle(x+r,y,r).attr({stroke: 'green', 'stroke-width': '10', 'stroke-dasharray': + Arc + ',' + (2*Arc) + '', fill: 'none', transform: 'r180'} );
         svg.circle(x+r,y,r).attr({stroke: 'red', 'stroke-width': '10', 'stroke-dasharray': ''+(RedTop - RedHigh)*Arc/RedTop +',' + (2*Arc) + '', fill: 'none', transform: 'r-'+(RedTop - RedHigh)*180/RedTop} );
         svg.circle(x+r,y,r).attr({stroke: 'yellow', 'stroke-width': '10', 'stroke-dasharray': ''+(RedHigh - YellowHigh)*Arc/RedTop +',' + (2*Arc) + '', fill: 'none', transform: 'r-'+((RedTop - YellowHigh)*180/RedTop)} );
         svg.circle(x+r,y,r).attr({stroke: 'yellow', 'stroke-width': '10', 'stroke-dasharray': ''+(YellowLow)*Arc/RedTop +',' + (2*Arc) + '', fill: 'none', transform: 'r-180'} );
//       RPM Needle
         //this.rpmNeedle = svg.line( x, y, x+40, y).attr( {stroke:'#ffffff', 'stroke-width': '5'});
         this.rpmNeedle = svg.rect( x-7, y, r/2, 6).attr( {stroke:'#999999', 'stroke-width': '1', fill: '#FFFFFF'});

  //       rpmBox = svg.text( 440, 390, v.rpm).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20'});
         rpmBox = svg.text( x+r, y-10, 0).attr( {fill: '#ffffff', 'dominant-baseline': 'middle', 'text-anchor': 'middle', stroke: 'none', 'font-size': '30'});

         return function ( rpm ){
             x = s.rpm.x;
             y = s.rpm.y;
             r = s.rpm.r;
             YellowLow = 1800;
             YellowHigh = 5500;
             RedHigh = 5800;
             RedTop = 7000;
             if ( rpm == null ) { return v.rpm; }
             rpmBox.attr( {text: rpm } );
             if (rpm < YellowLow) {
               rpmBox.attr( {fill: 'yellow' } );
             }
             if (rpm < YellowHigh && rpm > YellowLow ) {
               rpmBox.attr( {fill: '#ffffff' } );
             }
             if (rpm < RedHigh && rpm > YellowHigh ) {
               rpmBox.attr( {fill: 'yellow' } );
             }
             if (rpm > RedHigh ) {
               rpmBox.attr( {fill: 'red' } );
             }

             this.rpmNeedle.animate({ transform: 'r'+(rpm*180/RedTop) +',' + (x+r) + ',' + (y)}, 100);
             return v.rpm = rpm;
         };
     },

     FuelFlow: function(  ){
          x = s.FuelFlow.x;
          y = s.FuelFlow.y;
          BarSize = 120;
          MaxFlow = 40;
          YellowHigh = 35;
          YellowLow = 5;

          // normal fuel flow expected to be between 6 and 35 l/hr avaraging around 18 l/hr
          svg.line( x, y+12, x+(YellowLow*BarSize/MaxFlow), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
          svg.line( x+(YellowLow*BarSize/MaxFlow), y+12, x+(YellowHigh*BarSize/MaxFlow), y+12).attr( {stroke:'green', 'stroke-width': '12'});
          svg.line( x+(YellowHigh*BarSize/MaxFlow), y+12, x+BarSize, y+12).attr( {stroke:'yellow', 'stroke-width': '12'});

          svg.text( x, y, "FUEL FLOW").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });
   //       rpmBox = svg.text( 440, 390, v.rpm).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20'});
          FuelFlowBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
          this.FuelFlowNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

          return function ( FuelFlow ){
              if ( FuelFlow == null ) { return v.FuelFlow; }
              FuelFlowBox.attr( {text: FuelFlow.toFixed(1) } );
              this.FuelFlowNeedle.animate({ transform: 't'+(FuelFlow*BarSize/MaxFlow) +',0'}, 100);
              this.Endurance(v.FuelTank1, FuelFlow);
              return v.FuelFlow = FuelFlow;
          };
      },

      FuelPressure: function(  ){
           x = s.FuelPressure.x;
           y = s.FuelPressure.y;
           BarSize = 120;
           MaxFuelPressure = 0.5;
           YellowHigh = 0.4;
           YellowLow = 0.15;

// Fuel pressure
// Rotax 912 ULS:
// Max 0.4 Bar (5.8 PSI)
// Min 0.15 Bar (2.2 PSI)
// The new style pump creates around 4.5 PSI for most people.
// If you run an aux electric pump then that number may be .5 to 1.0 psi higher.

           // normal fuel flow expected to be between 6 and 35 l/hr avaraging around 18 l/hr
           svg.line( x, y+12, x+(YellowLow*BarSize/MaxFuelPressure), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
           svg.line( x+(YellowLow*BarSize/MaxFuelPressure), y+12, x+(YellowHigh*BarSize/MaxFuelPressure), y+12).attr( {stroke:'green', 'stroke-width': '12'});
           svg.line( x+(YellowHigh*BarSize/MaxFuelPressure), y+12, x+BarSize, y+12).attr( {stroke:'yellow', 'stroke-width': '12'});

           svg.text( x, y, "FUEL PRESS.").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });
    //       rpmBox = svg.text( 440, 390, v.rpm).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20'});
           FuelPressureBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
           this.FuelPressureNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

           return function ( FuelPressure ){
             BarSize = 120;
             MaxFuelPressure = 0.8;
             YellowHigh = 0.4;
             YellowLow = 0.15;

               if ( FuelPressure == null ) { return v.FuelPressure; }
               FuelPressureBox.attr( {text: FuelPressure.toFixed(2) } );
               if (FuelPressure < MaxFuelPressure) {
                 this.FuelPressureNeedle.animate({ transform: 't'+(FuelPressure*BarSize/MaxFuelPressure) +',0'}, 100);
               } else {
                 this.FuelPressureNeedle.animate({ transform: 't'+ BarSize +',0'}, 100);
               }
               return v.FuelPressure = FuelPressure;
           };
       },

       FuelTank1: function(  ){
            x = s.FuelTank1.x;
            y = s.FuelTank1.y;
            BarSize = s.FuelTank1.BarSize;
            MaxFuelTank = 75;
            YellowLow = 20;
            RedLow = 10;

            svg.line( x+10, y, x+10, y - 15 - BarSize*RedLow/MaxFuelTank).attr( {stroke:'red', 'stroke-width': '20'});
            svg.line( x+10, y - BarSize*RedLow/MaxFuelTank, x+10, y - BarSize*YellowLow/MaxFuelTank).attr( {stroke:'yellow', 'stroke-width': '20'});
            svg.line( x+10, y - BarSize*YellowLow/MaxFuelTank, x+10, y - BarSize).attr( {stroke:'green', 'stroke-width': '20'});

            svg.line( x, y - BarSize/2, x+25, y - BarSize/2).attr( {stroke:'white', 'stroke-width': '2'});
            svg.line( x, y - BarSize*3/4, x+15, y - BarSize*3/4).attr( {stroke:'white', 'stroke-width': '1'});
            svg.line( x, y - BarSize/4, x+15, y - BarSize/4).attr( {stroke:'white', 'stroke-width': '1'});

            svg.text( x, y - BarSize - 5, "FUEL:").attr({fill: '#ffffff', stroke: 'none', 'font-size': '14' });
     //       rpmBox = svg.text( 440, 390, v.rpm).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20'});
            FuelTank1Box = svg.text( x + 45, y - BarSize - 5, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '14', align: 'right'});
//            this.FuelTank1Needle = svg.rect( x+10, y - 18, 20, 6).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});
            this.FuelTank1Needle = svg.polygon( (x+20)+ ',' + (y) + ' ' + (x+40) + ',' + (y-7) + ' ' + (x+40) + ',' + (y+7)).attr( {fill: '#fff'} );


            return function ( FuelTank1 ){
              x = s.FuelTank1.x;
              y = s.FuelTank1.y;
              BarSize = s.FuelTank1.BarSize;
              MaxFuelTank = 75;
              YellowLow = 20;
              RedLow = 10;

                if ( FuelTank1 == null ) { return v.FuelTank1; }
                FuelTank1Box.attr( {text: FuelTank1+'L' } );
                EnduranceFlowBox.attr( {text: v.FuelFlow } );
                this.Endurance(FuelTank1, v.FuelFlow);
                this.FuelTank1Needle.animate({ transform: 't0,-'+(FuelTank1*BarSize/MaxFuelTank)}, 100);
                return v.FuelTank1 = FuelTank1;
            };
        },

        Endurance: function(  ){
             x = s.FuelTank1.x;
             y = s.FuelTank1.y;
             BarSize = s.FuelTank1.BarSize;

             svg.text( x + 85, y - BarSize - 5, "ENDURANCE").attr({fill: '#ffffff', stroke: 'none', 'font-size': '14' });
             svg.text( x + 70, y - BarSize + 15, "PLN: ").attr({fill: '#ffffff', stroke: 'none', 'font-size': '14' });
             svg.text( x + 70, y - BarSize + 35, "FLW: ").attr({fill: '#ffffff', stroke: 'none', 'font-size': '14' });
             EndurancePlnBox = svg.text( x + 110, y - BarSize + 15, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '14', align: 'right'});
             EnduranceFlowBox = svg.text( x + 110, y - BarSize + 35, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '14', align: 'right'});

             return function ( FuelTank1, FuelFlow ){
               EndFlow = 0;
               EndFlowMin = 0;
               EndPln = 0;
               EndPlnMin = 0;

               EndPln = FuelTank1/20; // Plan for 20Lhour
                 if (FuelFlow > 0) {
                   EndFlow = FuelTank1/FuelFlow;
                 } else {
                   EndFlow = 0;
                 }
                 EndFlowMin = EndFlow * 60;
                 EndPlnMin = EndPln * 60;
                 EndurancePlnBox.attr( {text: EndPln.toFixed(1) + ' (' + EndPlnMin.toFixed(0) + ')' } );
                 EnduranceFlowBox.attr( {text: EndFlow.toFixed(1) + ' (' + EndFlowMin.toFixed(0) + ')' } );

               return 1;
             };
         },

         OilPressure: function(  ){
              x = s.OilPressure.x;
              y = s.OilPressure.y;
              BarSize = 120;
              MaxOilPressure = 8;
              RedHigh = 7;
              YellowHigh = 5;
              YellowLow = 2;
              RedLow = 0.8;

// Oil pressure
// According to the Rotax 912 ULS operator manual page 2-5 the considered normal pressures are:
// Max. 7 bar (102 psi) (Red)
// Min. 0.8 bar (12 psi) (below 3500 rpm) (Red)
// Normal 2.0 to 5.0 bar (29-73 psi) (above 3500 rpm) (Green)

              // normal fuel flow expected to be between 6 and 35 l/hr avaraging around 18 l/hr
              svg.line( x, y+12, x+(RedLow*BarSize/MaxOilPressure), y+12).attr( {stroke:'red', 'stroke-width': '12'});
              svg.line( x+(RedLow*BarSize/MaxOilPressure), y+12, x+(YellowLow*BarSize/MaxOilPressure), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
              svg.line( x+(YellowLow*BarSize/MaxOilPressure), y+12, x+(YellowHigh*BarSize/MaxOilPressure), y+12).attr( {stroke:'green', 'stroke-width': '12'});
              svg.line( x+(YellowHigh*BarSize/MaxOilPressure), y+12, x+(RedHigh*BarSize/MaxOilPressure), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
              svg.line( x+(RedHigh*BarSize/MaxOilPressure), y+12, x+BarSize, y+12).attr( {stroke:'red', 'stroke-width': '12'});

              svg.text( x, y, "OIL PRESS.").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });
       //       rpmBox = svg.text( 440, 390, v.rpm).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '20'});
              OilPressureBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
              this.OilPressureNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

              return function ( OilPressure ){
                BarSize = 120;
                MaxOilPressure = 8;
                RedHigh = 7;
                YellowHigh = 5;
                YellowLow = 2;
                RedLow = 0.8;

                  if ( OilPressure == null ) { return v.OilPressure; }
                  OilPressureBox.attr( {text: OilPressure.toFixed(1) } );
                  if (OilPressure < MaxOilPressure) {
                    this.OilPressureNeedle.animate({ transform: 't'+(OilPressure*BarSize/MaxOilPressure) +',0'}, 100);
                  } else {
                    this.OilPressureNeedle.animate({ transform: 't'+ BarSize +',0'}, 100);
                  }
                  return v.OilPressure = OilPressure;
              };
          },

          OilTemperature: function(  ){
               x = s.OilTemperature.x;
               y = s.OilTemperature.y;
               BarSize = 120;
               MaxOilTemperature = 140;
               RedHigh = 130;
               YellowHigh = 110;
               YellowLow = 90;
               RedLow = 50;
               ZeroOffest = 40; //Needle will not move lower than this point

// Oil Temperature
// For Rotax 912
// Max 130C
// Min 50C
// normal range 90 - 110

               // normal fuel flow expected to be between 6 and 35 l/hr avaraging around 18 l/hr
               svg.line( x, y+12, x+((RedLow-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12).attr( {stroke:'red', 'stroke-width': '12'});
               svg.line( x+((RedLow-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12, x+((YellowLow-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
               svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12, x+((YellowHigh-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12).attr( {stroke:'green', 'stroke-width': '12'});
               svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12, x+((RedHigh-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
               svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)), y+12, x+BarSize, y+12).attr( {stroke:'red', 'stroke-width': '12'});

               svg.text( x, y, "OIL TEMP.").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

               OilTemperatureBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
               this.OilTemperatureNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

               return function ( OilTemperature ){
                 BarSize = 120;
                 MaxOilTemperature = 120;
                 YellowHigh = 90;
                 YellowLow = 50;

                   if ( OilTemperature == null ) { return v.OilTemperature; }
                   OilTemperatureBox.attr( {text: OilTemperature.toFixed(1) } );
                   if (OilTemperature < MaxOilTemperature && OilTemperature > ZeroOffest) {
                     this.OilTemperatureNeedle.animate({ transform: 't'+((OilTemperature-ZeroOffest)*BarSize/(MaxOilTemperature-ZeroOffest)) +',0'}, 100);
                   } else {
                     if (OilTemperature > MaxOilTemperature) {
                       this.OilTemperatureNeedle.animate({ transform: 't'+ BarSize +',0'}, 100);
                     } else {
                       this.OilTemperatureNeedle.animate({ transform: 't0,0'}, 100);
                     }
                   }
                   return v.OilTemperature = OilTemperature;
               };
           },

           Volts: function(  ){
                x = s.Volts.x;
                y = s.Volts.y;
                BarSize = 120;
                MaxVolts = 19;
                RedHigh = 17;
                YellowHigh = 15;
                YellowLow = 13;
                RedLow = 11;
                ZeroOffest = 9; //Needle will not move lower than this point

                svg.line( x, y+12, x+((RedLow-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12).attr( {stroke:'red', 'stroke-width': '12'});
                svg.line( x+((RedLow-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12, x+((YellowLow-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
                svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12, x+((YellowHigh-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12).attr( {stroke:'green', 'stroke-width': '12'});
                svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12, x+((RedHigh-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
                svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)), y+12, x+BarSize, y+12).attr( {stroke:'red', 'stroke-width': '12'});

                svg.text( x, y, "VOLTAGE").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                VoltsBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                this.VoltsNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                return function ( Volts ){
                  BarSize = 120;
                  MaxVolts = 19;
                  RedHigh = 17;
                  YellowHigh = 15;
                  YellowLow = 13;
                  RedLow = 11;
                  ZeroOffest = 9; //Needle will not move lower than this point


                    if ( Volts == null ) { return v.Volts; }
                    VoltsBox.attr( {text: Volts.toFixed(1) } );
                    if (Volts < MaxVolts && Volts > ZeroOffest) {
                      this.VoltsNeedle.animate({ transform: 't'+((Volts-ZeroOffest)*BarSize/(MaxVolts-ZeroOffest)) +',0'}, 100);
                    } else {
                      if (Volts > MaxVolts) {
                        this.VoltsNeedle.animate({ transform: 't'+ BarSize +',0'}, 100);
                      } else {
                        this.VoltsNeedle.animate({ transform: 't0,0'}, 100);
                      }
                    }
                    return v.Volts = Volts;
                };
            },

            AmpsAlternator: function(  ){
                 x = s.AmpsAlternator.x;
                 y = s.AmpsAlternator.y;
                 BarSize = 120;
                 MaxAmpsAlternator = 30;
                 RedHigh = 25;
                 YellowHigh = 20;
                 YellowLow = 2;
                 RedLow = 1;
                 ZeroOffest = 0; //Needle will not move lower than this point

                 // normal fuel flow expected to be between 6 and 35 l/hr avaraging around 18 l/hr
                 svg.line( x, y+12, x+((RedLow-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12).attr( {stroke:'red', 'stroke-width': '12'});
                 svg.line( x+((RedLow-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12, x+((YellowLow-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
                 svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12, x+((YellowHigh-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12).attr( {stroke:'green', 'stroke-width': '12'});
                 svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12, x+((RedHigh-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
                 svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)), y+12, x+BarSize, y+12).attr( {stroke:'red', 'stroke-width': '12'});

                 svg.text( x, y, "AMP ALTERN").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                 AmpsAlternatorBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                 this.AmpsAlternatorNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                 return function ( AmpsAlternator ){
                   BarSize = 120;
                   BarSize = 120;
                   MaxAmpsAlternator = 30;
                   RedHigh = 26;
                   YellowHigh = 20;
                   YellowLow = 2;
                   RedLow = 1;
                   ZeroOffest = 0; //Needle will not move lower than this point

                     if ( AmpsAlternator == null ) { return v.AmpsAlternator; }
                     if (AmpsAlternator < 0) { AmpsAlternator = 0;}
                     AmpsAlternatorBox.attr( {text: AmpsAlternator.toFixed(1) } );
                     if (AmpsAlternator < MaxAmpsAlternator && AmpsAlternator > ZeroOffest) {
                       this.AmpsAlternatorNeedle.animate({ transform: 't'+((AmpsAlternator-ZeroOffest)*BarSize/(MaxAmpsAlternator-ZeroOffest)) +',0'}, 100);
                     } else {
                       if (AmpsAlternator > MaxAmpsAlternator) {
                         this.AmpsAlternatorNeedle.animate({ transform: 't'+ BarSize +',0'}, 100);
                       } else {
                         this.AmpsAlternatorNeedle.animate({ transform: 't'+ x +',0'}, 100);
                       }
                     }
                     return v.AmpsAlternator = AmpsAlternator;
                 };
             },

             AmpsBattery: function(  ){
                  x = s.AmpsBattery.x;
                  y = s.AmpsBattery.y;
                  BarSize = 120;
                  MaxAmpsBattery = 20;
                  RedHigh = 18;
                  YellowHigh = 16;
                  YellowLow = 0;
                  RedLow = -15;
                  ZeroOffest = -20; //Needle will not move lower than this point

   // Oil Temperature
   // For Rotax 912
   // Max 130C
   // Min 50C
   // normal range 90 - 110

                  // normal fuel flow expected to be between 6 and 35 l/hr avaraging around 18 l/hr
                  svg.line( x, y+12, x+((RedLow-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12).attr( {stroke:'red', 'stroke-width': '12'});
                  svg.line( x+((RedLow-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12, x+((YellowLow-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
                  svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12, x+((YellowHigh-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12).attr( {stroke:'green', 'stroke-width': '12'});
                  svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12, x+((RedHigh-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12).attr( {stroke:'yellow', 'stroke-width': '12'});
                  svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)), y+12, x+BarSize, y+12).attr( {stroke:'red', 'stroke-width': '12'});

                  svg.text( x, y, "AMP BATT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                  AmpsBatteryBox = svg.text( x + BarSize-28, y, 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                  this.AmpsBatteryNeedle = svg.rect( x, y+3, 6, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                  return function ( AmpsBattery ){
                    BarSize = 120;
                    MaxAmpsBattery = 20;
                    RedHigh = 18;
                    YellowHigh = 16;
                    YellowLow = 0;
                    RedLow = -15;
                    ZeroOffest = -20; //Needle will not move lower than this point

                      if ( AmpsBattery == null ) { return v.AmpsBattery; }
                      AmpsBatteryBox.attr( {text: AmpsBattery.toFixed(1) } );
                      if (AmpsBattery < MaxAmpsBattery && AmpsBattery > ZeroOffest) {
                        this.AmpsBatteryNeedle.animate({ transform: 't'+((AmpsBattery-ZeroOffest)*BarSize/(MaxAmpsBattery-ZeroOffest)) +',0'}, 100);
                      } else {
                        if (AmpsBattery > MaxAmpsBattery) {
                          this.AmpsBatteryNeedle.animate({ transform: 't'+ BarSize +',0'}, 100);
                        } else {
                          this.AmpsBatteryNeedle.animate({ transform: 't'+ x +',0'}, 100);
                        }
                      }
                      return v.AmpsBattery = AmpsBattery;
                  };
              },

              FlightClock: function(  ){
                   x = s.FlightClock.x;
                   y = s.FlightClock.y;

                   FlightClockBox = svg.text( x, y, 'xxx').attr({fill: '#55FF55', stroke: 'none', 'font-size': '20' });
                   return function ( FlightClock ){
                     FlightClockBox.attr( {text: FlightClock } );
                     return 1;
                   };
              },

              EGT1: function(  ){
                   x = s.EGT1.x;
                   y = s.EGT1.y;
                   BarSize = 100;
                   MaxEGT1 = 1000;
                   RedHigh = 880;
                   YellowHigh = 800;
                   YellowLow = 600;
                   ZeroOffest = 400; //Needle will not move lower than this point

                   svg.line( x + BarSize, y, x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                   svg.line( x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y, x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                   svg.line( x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y, x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                   svg.line( x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y, x, y).attr( {stroke:'red', 'stroke-width': '10'});

                   //svg.text( x, y, "EGT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                   EGT1Box = svg.text( x-30, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                   this.EGT1Needle = svg.rect(x + BarSize - 5, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                   return function ( EGT1 ){
                     BarSize = 100;
                     MaxEGT1 = 1000;
                     RedHigh = 880;
                     YellowHigh = 800;
                     YellowLow = 600;
                     ZeroOffest = 300; //Needle will not move lower than this point

                       if ( EGT1 == null ) { return v.EGT1; }
                       EGT1Box.attr( {text: EGT1.toFixed(0) } );
                       if (EGT1 < MaxEGT1 && EGT1 > ZeroOffest) {
                         this.EGT1Needle.animate({ transform: 't-'+((EGT1-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)) +',0'}, 100);
                       } else {
                         if (EGT1 > MaxEGT1) {
                           this.EGT1Needle.animate({ transform: 't-'+ BarSize + ',0'}, 100);
                         } else {
                           this.EGT1Needle.animate({ transform: 't0,0'}, 100);
                         }
                       }
                       return v.EGT1 = EGT1;
                   };
               },

               EGT2: function(  ){
                    x = s.EGT2.x;
                    y = s.EGT2.y;
                    BarSize = 100;
                    MaxEGT2 = 1000;
                    RedHigh = 880;
                    YellowHigh = 800;
                    YellowLow = 600;
                    ZeroOffest = 400; //Needle will not move lower than this point


                    svg.line( x, y, x+((YellowLow-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                    svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)), y, x+((YellowHigh-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                    svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)), y, x+((RedHigh-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                    svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)), y, x+BarSize, y).attr( {stroke:'red', 'stroke-width': '10'});

                    //svg.text( x, y, "EGT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                    EGT2Box = svg.text( x + BarSize + 10, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                    this.EGT2Needle = svg.rect( x, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                    return function ( EGT2 ){
                      BarSize = 100;
                      MaxEGT2 = 1000;
                      RedHigh = 880;
                      YellowHigh = 800;
                      YellowLow = 600;
                      ZeroOffest = 300; //Needle will not move lower than this point

                        if ( EGT2 == null ) { return v.EGT2; }
                        EGT2Box.attr( {text: EGT2.toFixed(0) } );
                        if (EGT2 < MaxEGT2 && EGT2 > ZeroOffest) {
                          this.EGT2Needle.animate({ transform: 't'+((EGT2-ZeroOffest)*BarSize/(MaxEGT2-ZeroOffest)) +',0'}, 100);
                        } else {
                          if (EGT2 > MaxEGT2) {
                            this.EGT2Needle.animate({ transform: 't'+ BarSize +',0'}, 100);
                          } else {
                            this.EGT2Needle.animate({ transform: 't0,0'}, 100);
                          }
                        }
                        return v.EGT2 = EGT2;
                    };
                },

                EGT3: function(  ){
                     x = s.EGT3.x;
                     y = s.EGT3.y;
                     BarSize = 100;
                     MaxEGT3 = 1000;
                     RedHigh = 880;
                     YellowHigh = 800;
                     YellowLow = 600;
                     ZeroOffest = 400; //Needle will not move lower than this point

                     svg.line( x + BarSize, y, x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                     svg.line( x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y, x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                     svg.line( x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y, x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                     svg.line( x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxEGT1-ZeroOffest)), y, x, y).attr( {stroke:'red', 'stroke-width': '10'});

                     //svg.text( x, y, "EGT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                     EGT3Box = svg.text( x-30, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                     this.EGT3Needle = svg.rect(x + BarSize - 5, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                     return function ( EGT3 ){
                       BarSize = 100;
                       MaxEGT3 = 1000;
                       RedHigh = 880;
                       YellowHigh = 800;
                       YellowLow = 600;
                       ZeroOffest = 300; //Needle will not move lower than this point

                         if ( EGT3 == null ) { return v.EGT3; }
                         EGT3Box.attr( {text: EGT3.toFixed(0) } );
                         if (EGT3 < MaxEGT3 && EGT3 > ZeroOffest) {
                           this.EGT3Needle.animate({ transform: 't-'+((EGT3-ZeroOffest)*BarSize/(MaxEGT3-ZeroOffest)) +',0'}, 100);
                         } else {
                           if (EGT3 > MaxEGT3) {
                             this.EGT3Needle.animate({ transform: 't-'+ BarSize +',0'}, 100);
                           } else {
                             this.EGT3Needle.animate({ transform: 't0,0'}, 100);
                           }
                         }
                         return v.EGT3 = EGT3;
                     };
                 },

                 EGT4: function(  ){
                      x = s.EGT4.x;
                      y = s.EGT4.y;
                      BarSize = 100;
                      MaxEGT4 = 1000;
                      RedHigh = 880;
                      YellowHigh = 800;
                      YellowLow = 600;
                      ZeroOffest = 400; //Needle will not move lower than this point

                      svg.line( x, y, x+((YellowLow-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                      svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)), y, x+((YellowHigh-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                      svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)), y, x+((RedHigh-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                      svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)), y, x+BarSize, y).attr( {stroke:'red', 'stroke-width': '10'});

                      //svg.text( x, y, "EGT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                      EGT4Box = svg.text( x + BarSize + 10, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                      this.EGT4Needle = svg.rect( x, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                      return function ( EGT4 ){
                        BarSize = 100;
                        MaxEGT4 = 1000;
                        RedHigh = 880;
                        YellowHigh = 800;
                        YellowLow = 600;
                        ZeroOffest = 300; //Needle will not move lower than this point

                          if ( EGT4 == null ) { return v.EGT4; }
                          EGT4Box.attr( {text: EGT4.toFixed(0) } );
                          if (EGT4 < MaxEGT4 && EGT4 > ZeroOffest) {
                            this.EGT4Needle.animate({ transform: 't'+((EGT4-ZeroOffest)*BarSize/(MaxEGT4-ZeroOffest)) +',0'}, 100);
                          } else {
                            if (EGT4 > MaxEGT4) {
                              this.EGT4Needle.animate({ transform: 't'+ BarSize +',0'}, 100);
                            } else {
                              this.EGT4Needle.animate({ transform: 't0,0'}, 100);
                            }
                          }
                          return v.EGT4 = EGT4;
                      };
                  },

                  CHT1: function(  ){
                       x = s.CHT1.x;
                       y = s.CHT1.y;
                       //Coolant/Cylinder Head Temperature for Rotax 912
                       //Normal in Cruise (green arc) 	65℃ - 110℃
                       //Caution Range (yellow arc) 	110℃ - 120℃
                       //Maximum (red line)		120℃
                       BarSize = 100;
                       MaxCHT1 = 150;
                       RedHigh = 120;
                       YellowHigh = 110;
                       YellowLow = 65;
                       ZeroOffest = 40; //Needle will not move lower than this point

                       svg.line( x + BarSize, y, x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                       svg.line( x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y, x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                       svg.line( x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y, x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                       svg.line( x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y, x, y).attr( {stroke:'red', 'stroke-width': '10'});

                       //svg.text( x, y, "CHT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                       CHT1Box = svg.text( x-30, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                       this.CHT1Needle = svg.rect(x + BarSize - 5, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                       return function ( CHT1 ){
                         BarSize = 100;
                         MaxCHT1 = 1000;
                         RedHigh = 880;
                         YellowHigh = 800;
                         YellowLow = 600;
                         ZeroOffest = 300; //Needle will not move lower than this point

                           if ( CHT1 == null ) { return v.CHT1; }
                           CHT1Box.attr( {text: CHT1.toFixed(0) } );
                           if (CHT1 < MaxCHT1 && CHT1 > ZeroOffest) {
                             this.CHT1Needle.animate({ transform: 't-'+((CHT1-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)) +',0'}, 100);
                           } else {
                             if (CHT1 > MaxCHT1) {
                               this.CHT1Needle.animate({ transform: 't-'+ BarSize + ',0'}, 100);
                             } else {
                               this.CHT1Needle.animate({ transform: 't0,0'}, 100);
                             }
                           }
                           return v.CHT1 = CHT1;
                       };
                   },
/*   // Standard Rotax 912 has only two CHT sensors so the CHT2 and CHT3 are temporary disabled to save space on the display

                   CHT2: function(  ){
                        x = s.CHT2.x;
                        y = s.CHT2.y;
                        BarSize = 100;
                        MaxCHT2 = 1000;
                        RedHigh = 880;
                        YellowHigh = 800;
                        YellowLow = 600;
                        ZeroOffest = 400; //Needle will not move lower than this point


                        svg.line( x, y, x+((YellowLow-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                        svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)), y, x+((YellowHigh-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                        svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)), y, x+((RedHigh-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                        svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)), y, x+BarSize, y).attr( {stroke:'red', 'stroke-width': '10'});

                        //svg.text( x, y, "CHT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                        CHT2Box = svg.text( x + BarSize + 10, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                        this.CHT2Needle = svg.rect( x, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                        return function ( CHT2 ){
                        BarSize = 100;
                        MaxCHT2 = 150;
                        RedHigh = 120;
                        YellowHigh = 110;
                        YellowLow = 65;
                        ZeroOffest = 40; //Needle will not move lower than this point

                            if ( CHT2 == null ) { return v.CHT2; }
                            CHT2Box.attr( {text: CHT2.toFixed(0) } );
                            if (CHT2 < MaxCHT2 && CHT2 > ZeroOffest) {
                              this.CHT2Needle.animate({ transform: 't'+((CHT2-ZeroOffest)*BarSize/(MaxCHT2-ZeroOffest)) +',0'}, 100);
                            } else {
                              if (CHT2 > MaxCHT2) {
                                this.CHT2Needle.animate({ transform: 't'+ BarSize +',0'}, 100);
                              } else {
                                this.CHT2Needle.animate({ transform: 't0,0'}, 100);
                              }
                            }
                            return v.CHT2 = CHT2;
                        };
                    },

                    CHT3: function(  ){
                         x = s.CHT3.x;
                         y = s.CHT3.y;
                         BarSize = 100;
                         MaxCHT3 = 150;
                         RedHigh = 120;
                         YellowHigh = 110;
                         YellowLow = 65;
                         ZeroOffest = 40; //Needle will not move lower than this point

                         svg.line( x + BarSize, y, x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                         svg.line( x + BarSize - ((YellowLow-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y, x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                         svg.line( x + BarSize - ((YellowHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y, x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                         svg.line( x + BarSize - ((RedHigh-ZeroOffest)*BarSize/(MaxCHT1-ZeroOffest)), y, x, y).attr( {stroke:'red', 'stroke-width': '10'});

                         //svg.text( x, y, "CHT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                         CHT3Box = svg.text( x-30, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                         this.CHT3Needle = svg.rect(x + BarSize - 5, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                         return function ( CHT3 ){
                           BarSize = 100;
                           MaxCHT3 = 1000;
                           RedHigh = 880;
                           YellowHigh = 800;
                           YellowLow = 600;
                           ZeroOffest = 300; //Needle will not move lower than this point

                             if ( CHT3 == null ) { return v.CHT3; }
                             CHT3Box.attr( {text: CHT3.toFixed(0) } );
                             if (CHT3 < MaxCHT3 && CHT3 > ZeroOffest) {
                               this.CHT3Needle.animate({ transform: 't-'+((CHT3-ZeroOffest)*BarSize/(MaxCHT3-ZeroOffest)) +',0'}, 100);
                             } else {
                               if (CHT3 > MaxCHT3) {
                                 this.CHT3Needle.animate({ transform: 't-'+ BarSize +',0'}, 100);
                               } else {
                                 this.CHT3Needle.animate({ transform: 't0,0'}, 100);
                               }
                             }
                             return v.CHT3 = CHT3;
                         };
                     },
*/
                     CHT4: function(  ){
                          x = s.CHT4.x;
                          y = s.CHT4.y;
                          BarSize = 100;
                          MaxCHT4 = 150;
                          RedHigh = 120;
                          YellowHigh = 110;
                          YellowLow = 65;
                          ZeroOffest = 40; //Needle will not move lower than this point

                          svg.line( x, y, x+((YellowLow-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                          svg.line( x+((YellowLow-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)), y, x+((YellowHigh-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)), y).attr( {stroke:'green', 'stroke-width': '10'});
                          svg.line( x+((YellowHigh-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)), y, x+((RedHigh-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)), y).attr( {stroke:'yellow', 'stroke-width': '10'});
                          svg.line( x+((RedHigh-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)), y, x+BarSize, y).attr( {stroke:'red', 'stroke-width': '10'});

                          //svg.text( x, y, "CHT").attr({fill: '#ffffff', stroke: 'none', 'font-size': '12' });

                          CHT4Box = svg.text( x + BarSize + 10, y+3 , 0).attr( {fill: '#ffffff', stroke: 'none', 'font-size': '12', align: 'right'});
                          this.CHT4Needle = svg.rect( x, y-10, 5, 20).attr( {stroke:'#555555', 'stroke-width': '1', fill: '#FFFFFF'});

                          return function ( CHT4 ){
                            BarSize = 100;
                            MaxCHT4 = 1000;
                            RedHigh = 880;
                            YellowHigh = 800;
                            YellowLow = 600;
                            ZeroOffest = 300; //Needle will not move lower than this point

                              if ( CHT4 == null ) { return v.CHT4; }
                              CHT4Box.attr( {text: CHT4.toFixed(0) } );
                              if (CHT4 < MaxCHT4 && CHT4 > ZeroOffest) {
                                this.CHT4Needle.animate({ transform: 't'+((CHT4-ZeroOffest)*BarSize/(MaxCHT4-ZeroOffest)) +',0'}, 100);
                              } else {
                                if (CHT4 > MaxCHT4) {
                                  this.CHT4Needle.animate({ transform: 't'+ BarSize +',0'}, 100);
                                } else {
                                  this.CHT4Needle.animate({ transform: 't0,0'}, 100);
                                }
                              }
                              return v.CHT4 = CHT4;
                          };
                      },



};

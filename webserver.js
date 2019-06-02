var http = require('http').createServer(handler); //require http server, and create server with function handle$
var fs = require('fs'); //require filesystem module
var path = require('path');
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
//io.set('transports',['websocket']);

io.set('heartbeat timeout', 4000); 
io.set('heartbeat interval', 2000);


const sqlite3 = require('sqlite3').verbose();
var QNH = 1013;

let db = new sqlite3.Database('/memdb/memdb.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.run("PRAGMA busy_timeout = 1000");
db.run("PRAGMA journal_mode = WAL");

http.listen(8088); //listen to port 80

function handler (request, response) { //create server
    console.log('Server starting...');
//	console.log('Session' + request.sessionID);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;

    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}

io.sockets.on('connection', function (socket) {// WebSocket Connection
//  var lightvalue = 0; //static variable for current status

 
  
//  socket.on('light', function(data) { //get light switch status from client
//    lightvalue = data;
//    if (lightvalue) {
//      console.log(lightvalue); //turn LED on or off, for now we will just show it in console.log
//    }
//  });


// Update at 20Hz
var increment = 0;

var myInterval = setInterval(function() {
var d = new Date();
var Airspeed = 0;
var Altitude = 0;
var VerticalSpeed = 0;
var QNH = 1013;
var Heading = 0;
var Roll = 0;
var Pitch = 0;
var TurnRate = 0;
var TachoRPM = 0;
var OilTemperature = 0;
var OilPressure = 0;





// get the data from the database
db.serialize(() => {
  db.each('SELECT * FROM messages', (err, row) => {
    if (err) {
      console.error(err.message);
    }
//    console.log(row.Param_Text + "\t" + row.Param_Value);
   switch (row.Param_Text) {
      case 'Airspeed':
//			if (Airspeed != row.Param_Value) {
				Airspeed = row.Param_Value;
				socket.emit('Airspeed', Airspeed );
//			}
            break;
      case 'Altitude':
//            Static_Pressure = row.Param_Value;
//            Altitude = 44330 * (1 - Math.pow((Static_Pressure*0.0001)/QNH, 1/5.255));
			if (Altitude != row.Param_Value) {
				Altitude = row.Param_Value;
				socket.emit('Altitude', Altitude );
//            console.log(Static_Pressure + "\t" + Altitude);
			}
            break;
      case 'VerticalSpeed':
//			if (VerticalSpeed != row.Param_Value) {
				VerticalSpeed = row.Param_Value;
				socket.emit('Vario', VerticalSpeed/1000);
//            console.log(row.Param_Text + "\t" + row.Param_Value);
//			}
            break;
      case 'QNH':
			if (QNH != row.Param_Value) {
				QNH = row.Param_Value;
				if (QNH == 0) {
					QNH = 1013;
				}
				socket.emit('QNH', QNH);
			}
            break;
      case 'Heading':
			if (Heading != row.Param_Value) {
				Heading = row.Param_Value;
				socket.emit('Heading', Heading );
			}
            break;
      case 'Roll':
			if (Roll != row.Param_Value) {
				Roll = -row.Param_Value;
				socket.emit('AH_Roll', Roll );
			}
            break;
      case 'Pitch':
			if (Pitch != -row.Param_Value) {
				Pitch = row.Param_Value;
				socket.emit('AH_Pitch', Pitch );
			}
            break;
      case 'TurnRate':
            if (TurnRate != row.Param_Value) {
				TurnRate = row.Param_Value;
				socket.emit('Turn', TurnRate );
			}
            break;
      case 'RPM':
			if (TachoRPM != row.Param_Value) {
				TachoRPM = row.Param_Value;
				socket.emit('TachoRPM', TachoRPM );
//            	console.log("RPM = " + row.Param_Value);
			}
            break;
      case 'OilTemperature':
			if (OilTemperature != row.Param_Value) {
				OilTemperature = row.Param_Value;
				socket.emit('OilTemperature', OilTemperature );
			}
            break;
      case 'OilPressure':
			if (OilPressure != row.Param_Value) {
				OilPressure = row.Param_Value;
				socket.emit('OilPressure', OilPressure );
			}
            break;
   }

  });
});


	socket.emit('TimeUTC', d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()  );

	increment++;
	//console.log('increment='+increment);
	//console.log('Session = ' + request.session);
	if (increment>1000000) {
		increment = 0;
		}
		


	}, 50);
	
	// if user is disconnected or went to another page break the loop (Interval) above
	socket.on('disconnect',function(){
          console.log('User disconnected. Msg count: '+increment);
			clearInterval(myInterval); });

});

//io.sockets.on('disconnect',function(){
//   console.log('user disconnected');  });

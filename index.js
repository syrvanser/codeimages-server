const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 1337;

server.listen(port, () => {
    console.log('Listening on 1337');
});

var openConnections = [];

function Connection(socketToUse, gameSeed)
{
	this.socket = socketToUse;
	this.seed = gameSeed;
}

io.on('connection', (socket) => {
    console.log('new connection!');
	
	socket.on('disconnect', function()
	{
		console.log('disconnect!');
		openConnections = openConnections.filter(function(element)
		{
			if(element.socket !== socket)
				return element;
		});
		console.log(openConnections.length);
	});
	
	socket.on('seed', (seed) => {
        console.log("new seed: " + seed);
		openConnections.push(new Connection(socket, seed));

		socket.on('click', (id) =>{
		   var connections = openConnections.filter(function(element)
           {
               if(element.seed == seed)
                   return element;
           });

		   connections.forEach((connectionToUse)=>{
		       connectionToUse.socket.emit('update', id);
           });

        });

    });

});
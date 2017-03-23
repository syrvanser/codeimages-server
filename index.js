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

var gameStates = [];

io.on('connection', (socket) => {
    console.log('new connection!');
	socket.on('seed', (seed) => {
        socket.on('disconnect', function()
        {
            console.log('disconnect!');
            openConnections = openConnections.filter(function(element)
            {
                if(element.socket !== socket)
                    return element;
            });
            if(openConnections.filter(function(element){
                    if(element.seed == seed)
                        return element;
                }).length == 0){
                console.log(openConnections);
                gameStates[seed] = [];
            }
            console.log(openConnections.length);
        });
        console.log("new seed: " + seed);
		openConnections.push(new Connection(socket, seed));
		console.log(gameStates[seed]);
		if(gameStates[seed] == undefined)
		    gameStates[seed] = [];
		socket.emit('init', gameStates[seed]);
		socket.on('click', (id) =>{
		    var tmp = gameStates[seed];
		    if(tmp == undefined)
		        tmp = [];
		    tmp.push(id);
            gameStates[seed] = tmp;
            console.log("len : " + gameStates[seed].length);
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
module.exports = (io) => {
    io.on('connection', s => {
        console.error('socket.io connection');
        for (var t = 0; t < 3; t++)
          setTimeout(() => s.emit('message', 'message from server'), 1000*t);
        
        s.on('newMessage', s => {
            console.log("New MEssage")
            console.log(s);
        });
    });
};
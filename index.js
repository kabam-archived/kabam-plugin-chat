exports.name = 'mwc_plugin_chat';

//you need to export mongoose model for chat
exports.model = {
   'ChatMessages': function (mongoose, config) {
     var ChatMessagesSchema = new mongoose.Schema({
       'nickname': String
     });
     return mongoose.model('ChatMessages', ChatMessagesSchema);
   },

   'Rooms': function (mongoose, config) {
     var RoomsSchema = new mongoose.Schema({
       'name': String
     });

     return mongoose.model('Rooms', RoomsSchema);
   }
};

// Server side code
exports.app = function (mwc) {
  var io =  mwc.mwc_sio.io;

  var name = userNames.getGuestName();
  console.log('STARTING plugin_chat');

  io.sockets.on('connection', function(socket) {

    // send the new user their name and a list of users
    socket.emit('init', {
      name: name,
      users: userNames.get()
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
      socket.broadcast.emit('send:message', {
        user: name,
        text: data.message
      });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
      if (userNames.claim(data.name)) {
        var oldName = name;
        userNames.free(oldName);
        name = data.name;
        socket.broadcast.emit('change:name', {
          oldName: oldName,
          newName: name
        });
        fn(true);
      } else {
        fn(false);
      }
    });
    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
      name: name
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
      socket.broadcast.emit('user:left', {
        name: name
      });
      userNames.free(name);
    });

  });


  // Rooms
  // Join room
  io.sockets.on('room', function(room) {
    sockets.join(room);
  });

  // Leaving room
  io.sockets.on('leave', function(room) {
    sockets.leave(room);
  });

};


exports.routes = function(mwc){
  // Get all Rooms
  mwc.app.get('/rooms',function(request,response) {
    mwc.model.Rooms.find({}, function(err, rooms) {
      if (err) {
        response.json({ status: 500, message: 'There was an error.' });
      } else {
        response.json({ status: 200, rooms: rooms });
      }
    });
  });

  // Create Room
  mwc.app.post('/rooms',function(request,response) {
    if (typeof request.body.name === 'undefined' || !request.body.name) {
      response.json({ status: 400, message: 'Room message is mandatory.' });
    } else {
      mwc.model.Rooms.create({ name: request.body.name }, function(err, room) {
        if (err) {
          response.json({ status: 400, message: 'There was an error creating Room.' });
        } else {
          response.json({ status: 200, room: room });
        }
      });
    }
  });
};

//you need to export listeners for custom events from mwcKernel - so they can be used by application that uses this plugin
exports.listeners = {
  'alert': function (panic) {
    console.log(panic);
  }
};
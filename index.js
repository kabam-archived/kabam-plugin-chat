exports.name = 'mwc_plugin_chat';

//you need to export mongoose model for chat
exports.model = {
   'ChatMessages': function (mongoose, config) {
     var ChatMessagesSchema = new mongoose.Schema({
       'nickname': String //create schema here
     });
     return mongoose.model('ChatMessages', ChatMessagesSchema);
   },

   'Rooms': function (mongoose, config) {
     var RoomsSchema = new mongoose.Schema({
       'nickname': String
     });

     return mongoose.model('Rooms', RoomsSchema);
   }
};

exports.app = function (mwc) {
  console.log('STARTING plugin_chat')
  console.log(mwc.mwc_sio.io);

  /*
  place io logic there
  make mwcKernel emit events - mwc.emit('eventName',eventObj) for chat events
   */

};

exports.routes = function(mwc){
  mwc.app.get('/',function(request,response){
    response.sendfile('./index.html');//some html+socket.io file for testing purpose
  });
};

//you need to export listeners for custom events from mwcKernel - so they can be used by application that uses this plugin

exports.listeners = {
  'alert': function (panic) {
    console.log(panic);
  }
};
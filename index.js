exports.name = 'mwc_plugin_chat';

exports.core = {
  'parameterOne': 1,
  'parameterTwo': [1, 2, 3, 4, 5],
  'parameterThree': {},
  'getSum': function (config) {
    return function (a, b) {
      return (a + b) * (config.multipyKoefficient);
    }
  }
};

/**
 * @ngdoc function
 * @name Plugin.model
 * @type {object}
 * @description
 * Object, that will be supplied as argument to mwc.extendModel function
 * @example
 *```javascript
 * exports.model = {
 *  'Cats': function (mongoose, config) {
 *   var CatsSchema = new mongoose.Schema({
 *     'nickname': String
 *   });
 *
 *  return mongoose.model('cats', CatsSchema);
 * },
 * 'Dogs': function (mongoose, config) {
 *   var DogsSchema = new mongoose.Schema({
 *     'nickname': String
 *   });
 *  return mongoose.model('Dogs', DogsSchema);
 * }
 *};
 *```
 */
// exports.model = {
//   'Cats': function (mongoose, config) {
//     var CatsSchema = new mongoose.Schema({
//       'nickname': String
//     });

//     CatsSchema.index({
//       nickname: 1
//     });
//     return mongoose.model('cats', CatsSchema);
//   },

//   'Dogs': function (mongoose, config) {
//     var DogsSchema = new mongoose.Schema({
//       'nickname': String
//     });

//     DogsSchema.index({
//       nickname: 1
//     });

//     return mongoose.model('Dogs', DogsSchema);
//   }
// };

/**
 * @ngdoc function
 * @name Plugin.app
 * @type {function}
 * @description
 * Function, that will be supplied as argument to mwc.extendApp function
 * @example
 * ```javascript
 * exports.app = function (mwc) {
 *   mwc.app.set('someValue',42);
 * };
 * ```
 */
exports.app = function (mwc) {
  console.log('STARTING plugin_chat')
  console.log(mwc.mwc_sio.io);
};

//the most hard to understand function
//because middleware conception is tricky and it do need the core object, for example,
// in this way or maybe in some other way. But it do need the core!!!
//for simplicity of code of plugin all middlewares are setted to all enviroments and are mounted to path /
exports.middleware = [
  function (mwc) {
    return function (request, response, next) {
      request.model.Cats.count({name: 'Grumpy'}, function (err, numberOfCats) {
        if (numberOfCats > core.parameterOne) {
          request.getSum = core.getSum; //DI of core methods or values
          next();
        } else {
          response.send(500, 'There is not enough cats called "Grumpy" to run this application!');
        }
      });
    };
  },
  function (mwc) {
    return function (request, response, next) {
      request.model.Dogs.count({name: 'Strelka'}, function (err, numberOfDogs) {
        if (numberOfDogs > core.parameterOne) {
          request.getSum = core.getSum; //DI of core methods or values
          next();
        } else {
          response.send(500, 'There is not enough Dogs called "Strelka" to run this application!');
        }
      });
    };
  }
];

exports.routes = function(mwc){
  mwc.app.get('/kittens',function(request,response){
    request.model.Cats.find({},function(err,cats){
      if(err) throw err;
      response.json(cats);
    });
  });

  mwc.app.get('/dogs',function(request,response){
    request.model.Dogs.find({},function(err,dogs){
      if(err) throw err;
      response.json(dogs);
    });
  });
};

/**
 * @ngdoc function
 * @name Plugin.listeners
 * @type {object}
 * @description
 * Object, that will be supplied as argument to mwc.extendListeners function
 * Field names are the vent types, values are function called against this events
 * @example
 * ```javascript
 *  exports.listeners = {
 *  'panic': function (panic) {
 *   console.log(alert);
 *  }
 * };
 * ```
 */
exports.listeners = {
  'alert': function (panic) {
    console.log(panic);
  }
};
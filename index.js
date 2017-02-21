var superagent = require('superagent');
var map = require('async/map');
var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs-extra');
var _ = require('lodash');

module.exports = function(dir, port){
  var app = express();
  app.use(cookieParser());

  fs.readdir( __dirname + '/' + dir, function(err, files){
    files.map(function(file){
      var config = fs.readJsonSync(__dirname + '/' + dir + '/' + file);
      app.all(config.uri, function(req, res, next){
        if (req.method.toLowerCase() !== config.method.toLowerCase() ){
          next();
          return;
        }
        map(Object.keys(config.req), function(api, callback){
          var data = {};
          Object.keys(config.req[api].req || {}).map(function(key){
            var val = config.req[api].req[key];
            var set = val.split('.');
            data[key] = req[set[0]][set[1]];
          });
          superagent(config.method, config.req[api].url.replace(/\:([^\/]+)/g, function(matched, key){
            var set = key.split('.');
            return req[set[0]][set[1]];
          }))
            .send(data)
            .end(function(err, json){
              var res = {
                name: api,
                res: json.body
              };
              callback(err, res);
            });
        }, function(err, apis){
          var jsons = {};
          apis.map(function(api){
            Object.keys(api.res).map(function(key){
              jsons[api.name + '.' + key] = api.res[key];
            });
          });
          var json = {};
          Object.keys(config.res).map(function(key){
            json[key] = jsons[config.res[key]] || '';
          });
          res.send(json);
        });
      });
    });
  });

  app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
  });
}

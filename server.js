var express = require("express");
var path = require("path");

var jade = require('jade');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/routes');

var app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res) {
  Router.run(routes, req.path, function(Handler) {
    var html = React.renderToString(React.createElement(Handler));
    var page = jade.renderFile('views/index.html', { html: html });
    res.send(page);
  });
})


app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

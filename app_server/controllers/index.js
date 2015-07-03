var renderAngularApp = function(req, res) {
  res.render('layout', {title: 'Ridefinder'});
};

// GET Angular app
module.exports.angularApp = function(req, res) {
  renderAngularApp(req, res);
};

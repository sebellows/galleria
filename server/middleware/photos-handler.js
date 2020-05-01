const filterPhotos = require('./photos-filter');
const PHOTOS = require('../data.json');

module.exports = function photosHandler(req, res) {
  return res.send(filterPhotos(PHOTOS, req.query));
}

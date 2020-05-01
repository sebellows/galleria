import express from 'express';

export default (app) => {
  const photosHandler = require(__dirname + '/middleware/photos-handler');

  // define photos api
  app.get('/api/photos', photosHandler);
};

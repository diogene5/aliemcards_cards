'use strict';

const cards = require('../dist/cards.json').cards;
const Fuse = require('fuse.js');

const fuse = new Fuse(cards, {
  caseSensitive: false,
  shouldSort: true,
  tokenize: true,
  threshold: 0.2,
  location: 0,
  distance: 0,
  maxPatternLength: 20,
  minMatchCharLength: 3,
  keys: [{ name: 'title', weight: 0.8 }, { name: 'body', weight: 0.2 }],
});

function runQuery(event) {
  if (event.pathParameters && event.pathParameters.query) {
    const query = event.pathParameters.query;
    const result = fuse.search(decodeURIComponent(query)).slice(0,8);
    return {
      statusCode: 200,
      body: {
        message: 'Search complete.',
        cards: result
      }
    };
  }
  return {
    statusCode: 200,
    body: {
      message: 'You must provide a search term',
    }
  };
}

module.exports.search = (event, context, callback) => {
  const response = runQuery(event);
  callback(null, response);
};

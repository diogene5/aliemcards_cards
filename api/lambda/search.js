'use strict';

const cards = require('../../dist/cards.json').cards;
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

function respond(obj) {
  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }
}

exports.handler = (event, context, callback) => {
  //callback(null, respond(event.queryStringParameters.query ));
  if (event.queryStringParameters.query) {
    const { query } = event.queryStringParameters;
    const result = fuse.search(decodeURIComponent(query)).slice(0,8);
    callback(null, respond({
      message: 'Search complete.',
      cards: result
    }));
  } else {
    callback(null, respond({ message: 'You must provide a search term' }));
  }
};

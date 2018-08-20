exports.handler = function(event, context, callback) {
  callback(null, {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  body: "Hello, World"
  });
}
'use strict';

import https = require('https');
import url = require('url');
import kuromoji = require('kuromoji');

const handler = (event, context, callback) => {

  let text = event.text;

  let builder = kuromoji.builder({ dicPath: '/opt/nodejs/node_modules/kuromoji/dict/' });

  builder.build(function (err, tokenizer) {
    if (err) { throw err; }
    var tokens = tokenizer.tokenize(text);
    console.dir(tokens);
  });

  postSlackBot(url.parse(event.response_url), text, (err, res) => {
    if (err) {
      context.fail(err);
    }
    else {
      context.succeed("succeed");
    }
  });
};

const postSlackBot = (url_obj, text, callback) => {
  let options = {
    hostname: url_obj.host,
    port: 443,
    path: url_obj.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let postData = JSON.stringify({
    "response_type": "in_channel",
    "text": text
  });
  let req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      callback(null);
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
    callback(e);
  });

  req.write(postData);
  req.end();
};

module.exports.handler = handler
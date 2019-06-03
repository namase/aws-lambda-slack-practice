'use strict';

const https = require('https');
const url = require('url');
const kuromoji = require('kuromoji');

exports.handler = (event, context) => {

  let user = event.user_name;
  let command = event.command;
  let channel = event.channel_name;
  let commandText = event.text;
  let recievedCommand = user + " invoked " + command + " in " + channel + " with the following text: " + commandText; var DIC_DIR = "dict/";

  // Load dictionaries from file, and prepare tokenizer
  kuromoji.builder({ dicPath: DIC_DIR }).build(function (error, tokenizer) {
    var path = tokenizer.tokenize("すもももももももものうち");
    console.log(path);
  });

  postSlackBot(url.parse(event.response_url), recievedCommand, (err, res) => {
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
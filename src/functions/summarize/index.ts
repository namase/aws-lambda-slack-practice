import https = require('https');
import url = require('url');
import kuromoji = require('kuromoji');

exports.handler = (event, context) => {

  var exec = require('child_process').exec;

  var cmd = "ls -lah"; //ここを変更する
  var child = exec(cmd, function (error, stdout, stderr) {
    if (!error) {
      console.log('standard out: ' + stdout);
      console.log('standard error: ' + stderr);
      context.done();
    }
  });

  const user = event.user_name;
  const command = event.command;
  const channel = event.channel_name;
  const text = event.text;
  const recievedCommand = user + " invoked " + command + " in " + channel + " with the following text: " + text;

  const summarizedWard = summarize(event.text);

  console.log('summarize finish');

  postSlackBot(url.parse(event.response_url), recievedCommand, summarizedWard,(err, res) => {
    if (err) {
      context.fail(err);
    } else {
      context.succeed("succeed");
    }
  });
};

const summarize = (text) => {
  let tokens = "default";
  const { NODE_PATH } = process.env
  console.log(NODE_PATH)
  const builder = kuromoji.builder({
    // 辞書があるパスを指定
    dicPath: './node_modules/kuromoji/dict'
  });
  builder.build(function (err, tokenizer) {
    if (err) {
      console.log(err);
      throw err; 
    }

    // tokenizer.tokenize に文字列を渡すと、その文を形態素解析してくれます。
    tokens = tokenizer.tokenize(text);
  });
  return tokens;
};

const postSlackBot = (url_obj, text, summarizedWard,callback) => {
  var options = {
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
    "text": summarizedWard
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
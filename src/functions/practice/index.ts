import { WebClient } from "@slack/client"
var AWS = require('aws-sdk');
var qs = require('querystring');
var url = require('url');
var https = require('https');

const handler = (event, context, callback) => {

    console.log(context);
    console.log('body');
    console.log(event.body)
    const params = qs.parse(event.body);
    console.log(params)

    // 環境変数からTOKENと投稿チャンネルを取得
    const { SLACK_TOKEN, SLACK_CHANEL } = process.env
    if (!SLACK_TOKEN || !SLACK_CHANEL) return callback(new Error('slack token or channel is undefined'))

    // なにか非同期処理
    (async () => {
        const delay = (time) => { return new Promise((res) => { return setTimeout(() => { return res() }, time) }) };
        await delay(15 * 1000);
    })();

    callback(null, {
        statusCode: '200',
    });

    console.log('huga')
}

module.exports.handler = handler
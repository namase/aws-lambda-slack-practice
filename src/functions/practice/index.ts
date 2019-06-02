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
    const { message, attachments } = event
    if (!message) return callback(new Error('Message is undefined.'))

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            challenge: 'ok',
        }),
    };

    callback(null, response);

    // WebClientをTokenからインスタンス生成
    // const web = new WebClient(SLACK_TOKEN)
    // var lambda = new AWS.Lambda();
    // var options = {
    //     FunctionName: event.invokedFunctionArn,
    //     InvocationType: 'Event',
    //     Payload: JSON.stringify(params)
    // };
    // lambda.invoke(options, (err, data) => {
    //     if (err) {
    //         console.log(err, err.stack);
    //         context.fail("Command failed.");
    //     } else {
    //         context.succeed("Command accepted.");
    //     }
    // });  
    // const param = {
    //     statusCode: 200,
    //     channel: SLACK_CHANEL,
    //     text: 'Hello',
    // }
    // web.chat.postMessage(param)
    //     .then((res) => {
    //         return callback(null, {
    //             event,
    //             result: res.ts
    //         })
    //     })
    //     .catch(error => {
    //         console.log(error)
    //         return callback(error)
    //     })
}

module.exports.handler = handler
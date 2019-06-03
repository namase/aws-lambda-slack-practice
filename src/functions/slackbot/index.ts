import { WebClient } from "@slack/client"
var AWS = require('aws-sdk');
var qs = require('querystring');
var url = require('url');
var https = require('https');

const handler = (event, context, callback) => {

    // 環境変数からTOKENと投稿チャンネルを取得
    const { SLACK_TOKEN, SLACK_CHANEL } = process.env
    if (!SLACK_TOKEN || !SLACK_CHANEL) return callback(new Error('slack token or channel is undefined'))

    const options = {
        FunctionName: 'arn:aws:lambda:ap-northeast-1:782623905234:function:slack-app-summarize-SUMMARIZE-BBTA4MFDAP7A', // 要約側のLambda
        InvocationType: 'Event',
        Payload: JSON.stringify(qs.parse(event.body))
    };

    const res = {
        statusCode: '200',
    }

    const lambda = new AWS.Lambda();
    lambda.invoke(options, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            context.fail("Command failed.");
        } else {
            context.succeed("Command Success");
        }
    });
    // とりあえず200だけ返す
    callback(null, {
        statusCode: '200',
    });
}

module.exports.handler = handler
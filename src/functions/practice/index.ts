const { WebClient } = require('@slack/client')

const handler = (event, context, callback) => {
    const { SLACK_TOKEN, SLACK_CHANEL } = process.env
    if (!SLACK_TOKEN || !SLACK_CHANEL) return callback(new Error('slack token or channel is undefined'))
    const { message, attachments } = event
    if (!message) return callback(new Error('Message is undefined.'))

    const web = new WebClient(SLACK_TOKEN)
    const param = {
        channel: SLACK_CHANEL,
        text: message,
        attachments: attachments!
    }
    if (attachments) param.attachments = attachments
    web.chat.postMessage(param)
        .then((res) => {
            return callback(null, {
                event,
                result: res.ts
            })
        })
        .catch(error => {
            console.log(error)
            return callback(error)
        })
}

module.exports.handler = handler
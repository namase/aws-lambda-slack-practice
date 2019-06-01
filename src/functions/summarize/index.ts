import { APIGatewayEvent, Context, Callback } from "aws-lambda";

const handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  const result = {
    status: 200,
    message: "OK!!!!!"
  };

  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(result)
  });
};

export { handler };

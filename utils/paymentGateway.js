const Safepay = require("safepay");

const config = {
  environment: "sandbox",
  sandbox: {
    baseUrl: "https://sandbox.api.getsafepay.com",
    apiKey: "sec_76e5935e-69bb-4968-b0f9-317cae13a56e",
    apiSecret:
      "7f9f3ec2cf90e9ac496d71bbf06a9725f8563acb0ac398009056df56f71bc427",
  },
};
let sfpy = new Safepay(config);

function processPayment({ tracker, token, ref, sig, order_id }) {
  const valid = Safepay.validateWebhookSignature(
    tracker,
    sig,
    config.sandbox.apiSecret
  );
  if (!valid) {
    throw new Error("invalid payment signature. rejecting order...");
  }

  console.log("signature verified...");
  console.log("proceeding to mark order as paid");
}

module.exports = { sfpy, processPayment };

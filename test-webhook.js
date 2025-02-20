import crypto from 'crypto';

// Test payload
const payload = {
  action: "created",
  installation: {
    id: 12345,
    account: {
      login: "test-user"
    }
  }
};

// Convert payload to string
const payloadString = JSON.stringify(payload);

// Calculate signature using the webhook secret
const signature = crypto
  .createHmac('sha256', process.env.GITHUB_APP_WEBHOOK_SECRET)
  .update(payloadString)
  .digest('hex');

console.log('Payload (exact):', payloadString);
console.log('Raw payload length:', payloadString.length);
console.log('X-Hub-Signature-256:', `sha256=${signature}`);

// For verification
const verifySignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.GITHUB_APP_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return `sha256=${expectedSignature}` === signature;
};

// Test verification
const testSignature = `sha256=${signature}`;
console.log('Verification test:', verifySignature(payloadString, testSignature));
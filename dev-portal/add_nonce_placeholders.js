fs = require('fs');
const { v4: uuidv4 } = require('uuid')

// Create nonce value
const nonceInstance = new Buffer(uuidv4()).toString('base64')

// Update index.html tags to include nonce
const data = fs.readFileSync("build/index.html", "utf8");
const dataScriptNonce = data.replace(/<script/g, `<script nonce=\"${nonceInstance}\"`);
const dataStyleNonce = dataScriptNonce.replace(/<link/g, `<link nonce=\"${nonceInstance}\"`);
const finalNonce = dataStyleNonce.replace(/\{\{ csp_nonce\(\) \}\}/g, nonceInstance)
fs.writeFileSync("build/index.html", finalNonce);

// Update cloudfront-security lambda with nonce
const lambdaData = fs.readFileSync("../lambdas/cloudfront-security/index.js", "utf8");
const lambdaScriptNonce = lambdaData.replace(/NONCEPLACEHOLDER/g, nonceInstance);
fs.writeFileSync("../lambdas/cloudfront-security/index.js", lambdaScriptNonce);
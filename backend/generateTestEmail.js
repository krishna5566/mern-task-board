const nodemailer = require('nodemailer');

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
}

createTestAccount();

const cron = require("node-cron");

const { expireSessions} = require("./sessionExpiry.job");

// This runs every minute as checks for expiry of session
cron.schedule("* * * * *", async () => {

  await expireSessions();

});
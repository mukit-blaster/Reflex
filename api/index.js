// Vercel serverless entrypoint — exports the Express app.
// vercel.json rewrites /api/(.*) to this function.
module.exports = require('../lib/app');

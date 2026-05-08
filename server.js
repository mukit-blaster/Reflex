// Local dev server. On Vercel, api/index.js is the entrypoint.
require('dotenv').config();
const app = require('./lib/app');

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Reflex running at http://localhost:${port}`);
});

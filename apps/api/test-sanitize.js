const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
app.use(mongoSanitize());
app.get('/', (req, res) => res.send('ok'));
const server = app.listen(0, async () => {
  try {
    const res = await fetch(`http://localhost:${server.address().port}/`);
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  } finally {
    server.close();
  }
});

const { createApp } = require('./app');

const port = Number(process.env.API_PORT || 3001);
createApp().listen(port, () => {
  console.log(`Mcintosh Bank API disponível em http://localhost:${port}`);
});

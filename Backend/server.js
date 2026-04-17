const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port } = require('./src/config/env');
const validateEnv = require('./src/config/validateEnv');

const startServer = async () => {
  validateEnv();
  await connectDB();

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`VitalCode API running at http://localhost:${port}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Server shutdown complete.');
      process.exit(0);
    });
  });
};

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

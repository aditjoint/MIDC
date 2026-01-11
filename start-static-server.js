// This is a simple script to start the http-server
// We need this to work around Replit's workflow system
const { exec } = require('child_process');
const server = exec('npx http-server -p 5000 --cors');

server.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

server.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
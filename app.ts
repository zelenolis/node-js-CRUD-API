import http from 'http';
import cluster, { Worker } from 'cluster';
import os from 'os';
import { getHandling } from './src/handler.ts';

const PORT = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
const cpus = os.cpus().length;
const multiStart = process.argv.includes('--multi') ? true : false;

if (multiStart) {
  if (cluster.isPrimary) {

    console.log(`Master pid: ${process.pid}`);
    console.log(`Starting ${cpus - 1} forks`);

    const workers: Worker[] = [];

    let nextWorkerPort = +PORT + 1;

    for (let i = 0; i < cpus - 1; i++) {
      const workerNewPort = +PORT + i + 1;
      const worker = cluster.fork({PORT: workerNewPort});

      worker.on('message', (msg) => {
        workers.forEach((val) => val.send(msg));
      })

      worker.on('exit', (code) => {
        if (code !== 0) {
          console.log(`Worker ${worker.process.pid} died`);
          workers[i] = worker;
        }
      })
      workers.push(worker);
    }
    
    cluster.on('message', (worker, message) => {
      console.log(`Message from worker ${worker.id}:`, message);
    });

    const mainCluetsr = http.createServer((req, res) => {

      const options = {
        hostname: host,
        port: nextWorkerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
  
      const proxyReq = http.request(options, (proxyRes) => {
        proxyRes.pipe(res, { end: true });
      });
  
      proxyReq.on('error', (err) => {
        console.error(`Error connecting to worker on port ${options.port}: ${err.message}`);
        res.end('Internal server error');
      });
  
      req.pipe(proxyReq, { end: true });

      nextWorkerPort = (nextWorkerPort < +PORT + cpus - 1) ? nextWorkerPort + 1 : +PORT + 1;
    });

    mainCluetsr.listen(PORT);

  } else {
    const workerPort = process.env.PORT;
    const workerHandler = http.createServer(getHandling);
    workerHandler.listen(workerPort);

    console.log(`Worker ${process.pid} started and listening on port ${workerPort}`);
    
  }
  

} else {}
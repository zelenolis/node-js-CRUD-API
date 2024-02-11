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
      worker.on('exit', (code) => {
        if (code !== 0) {
          console.log(`Worker ${worker.process.pid} died`);
          workers[i] = worker;
        }
      })
      workers.push(worker);
    }
  

    const mainCluetsr = http.createServer((req, res) => {

      const options = {
        hostname: host,
        port: nextWorkerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
  
      console.log(`Redirecting request to port ${options.port}`);
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
    http.createServer(async (req, res) => {
      const response = await getHandling(req, res);
      res.end(response);
      res.end(`Worker on ${workerPort} processed your request.\n`);
    }).listen(workerPort);
    
    console.log(`Worker ${process.pid} started and listening on port ${workerPort}`);
    
  }
  

} else {}

// ---------------------------------------------------------------------------------------------------
/** friday last working code
// creating cluster
  if (cluster.isPrimary) {

    console.log(`Master pid: ${process.pid}`);
    console.log(`Starting ${cpus - 1} forks`);

    const workers: Worker[] = [];
    let nextWorkerIndex = 0;

    for (let i = 0; i < cpus - 1; i++) {
      const worker = cluster.fork({port: (+PORT + 1) + i});
      workers.push(worker);
    }

    function nextWorker() {
      const worker = workers[nextWorkerIndex];
      nextWorkerIndex = (nextWorkerIndex + 1) % (cpus - 1);
      return worker;
    }

    http.createServer((req, res) => {
      const worker = nextWorker();
      worker.send("hello");
      worker.on('message', (resp) => {
        res.end(`response from worker: ${resp}`);
      })
    }).listen(PORT);

    console.log(`Balancer is listening to the port: ${PORT}`);

  } else {

    const workerId = cluster.worker?.id || 0;
    const workerPORT = +PORT + workerId;

    process.on('message', (res) => {
      return 'safd'
    });

    http.createServer((req, res) => {

      console.log(req);
      res.end(`Hello from worker id: ${workerId}, pid: ${process.pid}\n`);
    }).listen(workerPORT);

    console.log(`Worker ${workerId} listening on port ${workerPORT}`);

  }
 * 
 */

// ---------------------------------------------------------------------------------------------------

/*
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  // Create a round-robin list of worker IDs
  const workerIds = Array.from({ length: numCPUs - 1 }, (_, i) => i + 1);
  let nextWorkerIndex = 0;

  // Load balancer logic
  function getNextWorker() {
    const workerId = workerIds[nextWorkerIndex];
    nextWorkerIndex = (nextWorkerIndex + 1) % workerIds.length;
    return cluster.workers?[workerId] : undefined;
  }

  // Load balancer server
  http.createServer((req, res) => {
    const worker = getNextWorker();
    if (worker) {
      cluster[worker].send({ type: 'request' }, res);
    }
    
  }).listen(PORT);

  console.log(`Load balancer listening on port ${PORT}`);
} else {
  // Worker process
  const workerId = cluster.worker?.id || 0;
  const workerPort = PORT + workerId;

  // Worker-specific server
  http.createServer((req, res) => {
    if (req.method === 'POST') {
      res.end(`POST. Worker ${workerId} listening on port ${workerPort}`);
    } else if (req.method === 'GET') {
      res.end(`GET. Worker ${workerId} listening on port ${workerPort}`);
    } else if (req.method === 'DELETE') {
      res.end(`DELETE. Worker ${workerId} listening on port ${workerPort}`);
    } else {
      res.writeHead(400);
      res.end('Bad request');
    }
  }).listen(workerPort);

  console.log(`Worker ${workerId} listening on port ${workerPort}`);
}
*/
/*
const server = http.createServer(async (req, res) => {
    try {
      // Your request handling logic here
      // ...
  
      // Simulate an error (for demonstration purposes)
      throw new Error('Something went wrong!');
  
      // Send a successful response
      res.end('Success');
    } catch (error) {
      // Handle the error
      console.error('Error:', error.message);
  
      // Send a 500 response
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  });
  
  const PORT = 4000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });*/
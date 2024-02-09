import http from 'http';

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
  });
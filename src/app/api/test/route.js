export default function handler(req, res) {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Example: Send a message every 5 seconds
    const intervalId = setInterval(() => {
      sendEvent({
        message: "Hello from the server",
        timestamp: new Date().toISOString(),
      });
    }, 5000);

    // Close the connection when the client disconnects
    req.on("close", () => {
      clearInterval(intervalId);
      res.end();
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

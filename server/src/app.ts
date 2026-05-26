import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/html-test", (req, res) => {
    res.send(`
        <html>
        <head>
            <script>
                console.log("Hello World");
            </script>
        </head>
        <body>
            <h1>Hello World</h1>
        </body>
        </html>
    `);
});

export default app;

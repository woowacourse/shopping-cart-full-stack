import express from "express";
import cors from 'cors';
import cartRouter from './routes/CartRouter';
import productRouter from './routes/ProductRouter';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/cart", cartRouter);
app.use("/products", productRouter);

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

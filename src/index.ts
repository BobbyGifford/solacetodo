import express from "express";
import { DataSource } from "typeorm";
import { Note } from "./entity/Note";
import { noteRoutes } from "./routes/notes";
import path from "path";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [Note],
  synchronize: true,
  logging: false,
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Use the noteRoutes
    noteRoutes(app, AppDataSource);

    // Serve the React app for any other requests
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });

    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

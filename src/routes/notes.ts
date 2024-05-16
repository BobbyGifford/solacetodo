import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { Note } from "../entity/Note";

export const noteRoutes = (app: any, AppDataSource: DataSource) => {
  // Create a new note
  app.post("/notes", async (req: Request, res: Response) => {
    const note = new Note();
    note.title = req.body.title;
    note.content = req.body.content;
    await AppDataSource.manager.save(note);
    res.json(note);
  });

  // Get all notes
  app.get("/notes", async (req: Request, res: Response) => {
    const notes = await AppDataSource.manager.find(Note);
    res.json(notes);
  });

  // Update a note
  app.put("/notes/:id", async (req: Request, res: Response) => {
    const note = await AppDataSource.manager.findOne(Note, {
      where: { id: parseInt(req.params.id) },
    });
    if (note) {
      note.title = req.body.title || note.title;
      note.content = req.body.content || note.content;
      note.completed =
        req.body.completed !== undefined ? req.body.completed : note.completed;
      await AppDataSource.manager.save(note);
      res.json(note);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  });

  // Delete a note
  app.delete("/notes/:id", async (req: Request, res: Response) => {
    const note = await AppDataSource.manager.findOne(Note, {
      where: { id: parseInt(req.params.id) },
    });
    if (note) {
      await AppDataSource.manager.remove(note);
      res.json({ message: "Note deleted" });
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  });
};

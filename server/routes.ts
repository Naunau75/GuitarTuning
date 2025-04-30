import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a basic endpoint to check if server is running
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Guitar Tuner API is running' });
  });

  // The guitar tuner is primarily a client-side application
  // using the Web Audio API, so we don't need much server-side logic

  const httpServer = createServer(app);

  return httpServer;
}

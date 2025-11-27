import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { generateAvoidingScamsPDF, generateForeclosureGuidePDF, generatePersonalizedTimelinePDF } from "../pdfGenerator";
import { generateNoticeOfDefaultPDF } from "../pdfGeneratorNoticeOfDefault";
import { generateContactingLenderPDF } from "../pdfGeneratorContactingLender";
import { handleGHLBookingWebhook } from "../webhooks/ghl-booking";
import shortlinksRouter from "../routes/shortlinks";
import { initializeScheduledJobs } from "../jobs/scheduler";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // PDF download routes
  app.get("/api/pdf/avoiding-scams-guide", (req, res) => {
    try {
      const doc = generateAvoidingScamsPDF();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Avoiding_Foreclosure_Scams_Guide.pdf"');
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
  
  app.get("/api/pdf/notice-of-default-checklist", (req, res) => {
    try {
      const doc = generateNoticeOfDefaultPDF();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Notice_of_Default_Checklist.pdf"');
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
  
  app.get("/api/pdf/contacting-lender-guide", (req, res) => {
    try {
      const doc = generateContactingLenderPDF();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Contacting_Your_Lender_Guide.pdf"');
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
  
  app.get("/api/pdf/foreclosure-survival-guide", (req, res) => {
    try {
      const doc = generateForeclosureGuidePDF();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Texas_Foreclosure_Survival_Guide.pdf"');
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
  
  // GHL Booking Webhook
  app.post("/api/webhooks/ghl-booking", handleGHLBookingWebhook);
  
  // Shortened link redirect handler
  app.use(shortlinksRouter);
  
  app.post("/api/pdf/personalized-timeline", async (req, res) => {
    try {
      const { noticeDate, milestones } = req.body;
      
      if (!noticeDate || !milestones || !Array.isArray(milestones)) {
        return res.status(400).json({ error: 'Invalid request: noticeDate and milestones are required' });
      }
      
      // Convert date strings back to Date objects
      const milestonesWithDates = milestones.map((m: any) => ({
        ...m,
        date: new Date(m.date)
      }));
      
      const pdfBuffer = await generatePersonalizedTimelinePDF(noticeDate, milestonesWithDates);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="My_Foreclosure_Timeline.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  })
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Initialize scheduled jobs after server starts
    initializeScheduledJobs();
  });
}

startServer().catch(console.error);

import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getSeoForPath } from "../../shared/siteSeo";
import { composeSsrHtml } from "./ssrHtml";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/entry-client.tsx"`,
        `src="/src/entry-client.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html, dehydratedState } = render(url);
      const meta = getSeoForPath(url);
      res.status(meta.notFound ? 404 : 200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(composeSsrHtml(page, html, meta, dehydratedState));
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use((req, res, next) => {
    if (req.path === "/index.html") return res.redirect(301, "/");
    if (req.path !== "/" && /\/+$/.test(req.path)) {
      const query = req.originalUrl.slice(req.path.length);
      return res.redirect(301, `${req.path.replace(/\/+$/, "") || "/"}${query}`);
    }
    next();
  });
  app.use(express.static(distPath, { index: false, redirect: false }));
  app.use("*", async (req, res) => {
    const templatePath = path.resolve(distPath, "index.html");
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const serverEntryPath = path.resolve(import.meta.dirname, "server-ssr", "entry-server.js");
      const { render } = await import(serverEntryPath);
      const { html, dehydratedState } = render(req.originalUrl);
      const meta = getSeoForPath(req.originalUrl);
      res.status(meta.notFound ? 404 : 200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(composeSsrHtml(template, html, meta, dehydratedState));
    } catch (error) {
      console.error("[SSR] render failed, serving client shell:", error);
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const meta = getSeoForPath("/");
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(composeSsrHtml(template, "", meta, {}));
    }
  });
}

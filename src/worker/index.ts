import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Handle favicon.ico redirect to bot.svg
app.get("/favicon.ico", async (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/bot.svg";
  const asset = await c.env.ASSETS.fetch(url.toString());
  
  if (asset.status === 404) {
    return c.notFound();
  }
  
  const svgContent = await asset.arrayBuffer();
  return c.body(svgContent, 200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=86400'
  });
});

// Handle llms.txt specifically to ensure correct encoding
app.get("/llms.txt", async (c) => {
	const url = new URL(c.req.url);
	const asset = await c.env.ASSETS.fetch(url.toString());

	if (asset.status === 404) {
		return c.notFound();
	}

	const text = await asset.text();
	return c.text(text, 200, {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "public, max-age=3600",
		"X-Served-By": "worker",
	});
});

// Handle other text files with proper UTF-8 encoding
app.get("*.txt", async (c) => {
  const url = new URL(c.req.url);
  const asset = await c.env.ASSETS.fetch(url.toString());
  
  if (asset.status === 404) {
    return c.notFound();
  }
  
  const text = await asset.text();
  return c.text(text, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600'
  });
});

// Handle markdown files with proper UTF-8 encoding
app.get("*.md", async (c) => {
  const url = new URL(c.req.url);
  const asset = await c.env.ASSETS.fetch(url.toString());
  
  if (asset.status === 404) {
    return c.notFound();
  }
  
  const text = await asset.text();
  return c.text(text, 200, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=3600'
  });
});

export default app;


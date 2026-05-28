import { writeFileSync } from "fs";
import { join } from "path";

const clientDir = "dist/client";

// Run the SSR server to get the properly rendered HTML shell.
// The client JS (hydrateRoot) needs real SSR HTML to hydrate against.
const { default: serverEntry } = await import(`../${join("dist/server/server.js")}`);

const request = new Request("http://localhost/", {
  method: "GET",
  headers: { host: "localhost" },
});

const response = await serverEntry.fetch(request, {}, {});
if (!response.ok) {
  console.error(`SSR request failed: ${response.status}`);
  process.exit(1);
}

let html = await response.text();

// Rewrite asset paths to be absolute so they work from any route under the SPA.
html = html.replace(/href="\/assets\//g, 'href="/assets/');
html = html.replace(/src="\/assets\//g, 'src="/assets/');

writeFileSync(join(clientDir, "index.html"), html);
console.log("Generated dist/client/index.html via SSR");

import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Dutch clinic homepage with correct metadata", async () => {
  const response = await render("/nl");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="nl"/i);
  assert.match(html, /Tandheelkundige zorg/i);
  assert.match(html, /marea-hero\.webp/i);
  assert.match(
    html,
    /rel="canonical"[^>]*href="https:\/\/marea-dental-batumi\.jytsma\.chatgpt\.site\/nl"/i,
  );
  assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape/i);
});

test("keeps deep-route canonicals and privacy information route-specific", async () => {
  const treatmentResponse = await render(
    "/de/treatments/dental-implants",
  );
  assert.equal(treatmentResponse.status, 200);
  const treatmentHtml = await treatmentResponse.text();
  assert.match(treatmentHtml, /<html[^>]*lang="de"/i);
  assert.match(
    treatmentHtml,
    /rel="canonical"[^>]*href="https:\/\/marea-dental-batumi\.jytsma\.chatgpt\.site\/de\/treatments\/dental-implants"/i,
  );

  const privacyResponse = await render("/fr/privacy");
  assert.equal(privacyResponse.status, 200);
  const privacyHtml = await privacyResponse.text();
  assert.match(privacyHtml, /Clair sur vos données/i);
  assert.match(privacyHtml, /Prototype privé/i);
});

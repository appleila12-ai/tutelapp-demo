#!/usr/bin/env node
// ============================================================================
// Anteprime dei link per Comune (WhatsApp, email, Facebook, Telegram...)
// ----------------------------------------------------------------------------
// Gira DOPO `expo export --platform web` (vedi "build" in package.json).
// WhatsApp & co. non eseguono l'app: leggono solo i tag <meta> della pagina.
// Questo script crea una pagina per ogni Comune (dist/erba/index.html, ...)
// con titolo, descrizione e immagine del Comune, così il link /erba mostra
// "TutelApp · Comune di Erba".
//
// Le immagini di anteprima sono in public/og/<slug>.png (1200×630).
// Se un Comune non ha la sua immagine, si usa public/og/tutelapp.png.
//
// Indirizzo pubblico del sito (serve un link completo per l'immagine):
//   SITE_URL=https://tutelapp.it  (oppure URL impostata da Netlify)
// ============================================================================

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const COMUNI_DIR = path.join(ROOT, "src", "config", "comuni");
const PUBLIC_OG = path.join(ROOT, "public", "og");

const SITE = (process.env.SITE_URL || process.env.EXPO_PUBLIC_SITE_URL || process.env.URL || "")
  .replace(/\/+$/, "");

const MOSTRA_DEMO = (process.env.EXPO_PUBLIC_COMUNI_DEMO || "").toLowerCase() !== "no";

function leggiComuni() {
  const cartelle = [COMUNI_DIR];
  if (MOSTRA_DEMO) cartelle.push(path.join(COMUNI_DIR, "demo"));
  return cartelle
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) =>
      fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".ts") && !["types.ts", "index.ts"].includes(f) && !f.startsWith("_"))
        .map((f) => path.join(dir, f)),
    )
    .map((file) => {
      const src = fs.readFileSync(file, "utf8");
      const campo = (nome) => {
        const m = src.match(new RegExp(`\\b${nome}:\\s*"([^"]*)"`));
        return m ? m[1] : "";
      };
      return {
        slug: campo("slug"),
        nome: campo("nome"),
        ente: campo("ente"),
        tipo: campo("tipo"),
        demo: /\bdimostrativo:\s*true/.test(src),
      };
    })
    .filter((c) => c.slug && c.nome);
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function tagMeta({ title, description, image, url }) {
  const img = SITE ? `${SITE}${image}` : image;
  const link = SITE ? `${SITE}${url}` : url;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="theme-color" content="#F7F3EA" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="it_IT" />`,
    `<meta property="og:site_name" content="TutelApp" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${esc(link)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
  ].join("\n    ");
}

function conMeta(html, meta) {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+(name|property)="(description|theme-color|og:[^"]+|twitter:[^"]+)"[^>]*>/gi, "")
    .replace(/<html([^>]*)\blang="[^"]*"/i, "<html$1lang=\"it\"");
  if (!/<html[^>]*\blang=/i.test(out)) out = out.replace(/<html/i, '<html lang="it"');
  return out.replace(/<\/head>/i, `    ${meta}\n  </head>`);
}

function main() {
  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("[anteprime-comuni] dist/index.html non trovato: esegui prima expo export.");
    process.exit(1);
  }
  const base = fs.readFileSync(indexPath, "utf8");

  // Le immagini di anteprima devono stare in dist/og
  const distOg = path.join(DIST, "og");
  fs.mkdirSync(distOg, { recursive: true });
  if (fs.existsSync(PUBLIC_OG)) {
    for (const f of fs.readdirSync(PUBLIC_OG)) {
      fs.copyFileSync(path.join(PUBLIC_OG, f), path.join(distOg, f));
    }
  }
  const haImmagine = (slug) => fs.existsSync(path.join(distOg, `${slug}.png`));

  // Pagina generica
  fs.writeFileSync(
    indexPath,
    conMeta(
      base,
      tagMeta({
        title: "TutelApp · Non devi orientarti da solo",
        description:
          "La tua guida semplice ai diritti, alla Legge 104 e alla Riforma della disabilità. Offerta dal tuo Comune.",
        image: "/og/tutelapp.png",
        url: "/",
      }),
    ),
  );

  // Una pagina per Comune
  const comuni = leggiComuni();
  for (const c of comuni) {
    const dir = path.join(DIST, c.slug);
    fs.mkdirSync(dir, { recursive: true });
    const title = c.demo ? `TutelApp · ${c.nome} (versione dimostrativa)` : `TutelApp · ${c.nome}`;
    const description = c.demo
      ? `Esempio di come TutelApp potrebbe funzionare per il ${c.nome}: diritti, Progetto di Vita, la pratica e i servizi del territorio. Il Comune non ha aderito.`
      : c.tipo === "unione"
        ? `Il servizio dei Comuni dell'${c.nome} per orientarsi dopo una diagnosi e nel percorso della disabilità: diritti, Progetto di Vita, la tua pratica e i servizi del territorio.`
        : `Il servizio del ${c.nome} per orientarsi dopo una diagnosi e nel percorso della disabilità: diritti, Progetto di Vita, la tua pratica e i servizi del territorio.`;
    fs.writeFileSync(
      path.join(dir, "index.html"),
      conMeta(
        base,
        tagMeta({
          title,
          description,
          image: haImmagine(c.slug) ? `/og/${c.slug}.png` : "/og/tutelapp.png",
          url: `/${c.slug}`,
        }),
      ),
    );
  }
  console.log(
    `[anteprime-comuni] anteprime create per: ${comuni.map((c) => c.slug).join(", ")}` +
      (SITE ? ` (sito: ${SITE})` : " — attenzione: SITE_URL non impostato, link relativi"),
  );
}

main();

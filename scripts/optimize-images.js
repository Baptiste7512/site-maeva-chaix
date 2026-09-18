import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Config ---
const SOURCE_DIR = path.join(__dirname, "../src/assets"); // dossier à traiter
const MAX_WIDTH = 2000; // largeur max en px (les images plus petites ne sont pas agrandies)
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".webp"];

// Si true : remplace les fichiers originaux (même nom, même extension)
// Si false : garde les originaux et crée des copies converties en .webp à côté
const OVERWRITE_ORIGINALS = true;

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.map((e) => e.toLowerCase()).includes(ext)) return;

  const sizeBefore = fs.statSync(filePath).size;

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image.resize({
    width: MAX_WIDTH,
    withoutEnlargement: true, // ne jamais agrandir une image plus petite que MAX_WIDTH
  });

  // On garde le même format que l'original (jpeg ou png)
  if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: JPEG_QUALITY });
  } else {
    // jpg / jpeg
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const buffer = await pipeline.toBuffer();

  if (OVERWRITE_ORIGINALS) {
    fs.writeFileSync(filePath, buffer);
  } else {
    const outPath = filePath.replace(ext, "-optimized" + ext);
    fs.writeFileSync(outPath, buffer);
  }

  const sizeAfter = buffer.length;
  totalBefore += sizeBefore;
  totalAfter += sizeAfter;
  count++;

  const kb = (n) => (n / 1024).toFixed(0);
  console.log(
    `✓ ${path.basename(filePath)} : ${kb(sizeBefore)} KB → ${kb(sizeAfter)} KB (${metadata.width}px → max ${MAX_WIDTH}px)`
  );
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const promises = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath); // récursif
    } else {
      promises.push(processFile(fullPath));
    }
  }
  return promises;
}

async function main() {
  console.log(`Optimisation des images dans ${SOURCE_DIR}...\n`);

  async function walkAsync(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkAsync(fullPath);
      } else {
        await processFile(fullPath);
      }
    }
  }

  await walkAsync(SOURCE_DIR);

  console.log(`\n${count} images traitées.`);
  console.log(
    `Poids total : ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `Gain : ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`
  );
}

main();
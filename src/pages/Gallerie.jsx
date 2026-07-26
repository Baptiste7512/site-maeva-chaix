import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "../styles/gallerie.css";

/**
 * Every image dropped in src/assets/photo/gallerie/ is picked up
 * automatically — add or remove files there and this component adapts,
 * no code changes needed. `import.meta.glob` is a Vite feature that
 * imports every matching file at build time.
 */
const modules = import.meta.glob("../assets/photo/gallerie/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

// Optional metadata per image, keyed by filename (the part after the last "/").
// Add an entry here whenever you want a title/technique to show up in the
// lightbox — images without an entry still display, just without a caption.
const ARTWORK_INFO = {
  "gallerie-1.jpg": { title: "Complicité", technique: "Huile sur toile, 40 × 50 cm, 2025" },
  // "gallerie-2.jpg": { title: "...", technique: "..., .. × .. cm, ...." },
};

const IMAGE_ENTRIES = Object.entries(modules).map(([path, src]) => {
  const filename = path.split("/").pop();
  return { src, filename, info: ARTWORK_INFO[filename] || null };
});

// TEMP DEBUG: prints every detected filename to the browser console, so you
// can copy the exact names into ARTWORK_INFO above. Remove this once done.
console.log(
  "Fichiers détectés dans gallerie/:",
  IMAGE_ENTRIES.map((e) => e.filename)
);

const GAP = 32;
const BUFFER_PX = 400;
const WORLD_HEIGHT = 4_000_000;

function getColumnsForWidth(width) {
  if (width < 600) return 1;
  if (width < 1000) return 2;
  return 3;
}

// Bin-pack items (now including their measured ratio) into columns,
// shortest-column-first, same masonry logic as before. If there are
// fewer photos than columns, the list is cycled so every column still
// gets at least one item — otherwise columns past the photo count would
// stay empty and leave a blank gap on the right.
//
// Columns also start at a staggered vertical offset (a fraction of the
// column width, increasing per column index) so the "cascading" look
// holds even when every column happens to have identical item heights
// (e.g. only one unique photo, duplicated). With varied real photos the
// organic height differences add on top of this base stagger.
function buildColumns(items, numColumns, colWidth) {
  if (items.length === 0) return [];

  const seedCount = Math.max(items.length, numColumns);
  const seededItems = Array.from({ length: seedCount }, (_, i) => items[i % items.length]);

  const STAGGER_UNIT = colWidth * 0.25;
  const heights = Array.from({ length: numColumns }, (_, i) => i * STAGGER_UNIT);
  const columns = Array.from({ length: numColumns }, () => []);

  seededItems.forEach((item, i) => {
    const shortest = heights.indexOf(Math.min(...heights));
    const itemHeight = colWidth * item.ratio;
    columns[shortest].push({ ...item, id: i, height: itemHeight, top: heights[shortest] });
    heights[shortest] += itemHeight + GAP;
  });

  return columns.map((colItems, i) => ({ items: colItems, loopHeight: heights[i] }));
}

export default function Gallerie() {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(900);
  const [selectedImage, setSelectedImage] = useState(null);

  // Close the lightbox on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Measure each image's real aspect ratio once it loads. Until then it
  // falls back to a square (ratio 1) so layout can still run immediately.
  const [ratios, setRatios] = useState({});

  useEffect(() => {
    IMAGE_ENTRIES.forEach(({ src }) => {
      const img = new Image();
      img.onload = () => {
        setRatios((prev) => ({ ...prev, [src]: img.naturalHeight / img.naturalWidth }));
      };
      img.src = src;
    });
  }, []);

  const items = useMemo(
    () =>
      IMAGE_ENTRIES.map((entry, i) => ({
        src: entry.src,
        alt: entry.info?.title || `Œuvre ${i + 1}`,
        title: entry.info?.title || null,
        technique: entry.info?.technique || null,
        ratio: ratios[entry.src] || 1,
      })),
    [ratios]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = WORLD_HEIGHT / 2;
    setScrollTop(WORLD_HEIGHT / 2);
    setViewportHeight(el.clientHeight);
    setContainerWidth(el.clientWidth);

    const onResize = () => {
      setViewportHeight(el.clientHeight);
      setContainerWidth(el.clientWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setScrollTop(el.scrollTop);
  }, []);

  const numColumns = getColumnsForWidth(containerWidth);
  const colWidth = (containerWidth - (numColumns - 1) * GAP) / numColumns;
  const columns = useMemo(
    () => buildColumns(items, numColumns, colWidth || 300),
    [items, numColumns, colWidth]
  );

  const rangeStart = scrollTop - BUFFER_PX;
  const rangeEnd = scrollTop + viewportHeight + BUFFER_PX;

  const renderedCards = [];
  columns.forEach((col, colIndex) => {
    const { items: colItems, loopHeight } = col;
    if (loopHeight <= 0) return;

    const firstRepeat = Math.floor(rangeStart / loopHeight) - 1;
    const lastRepeat = Math.floor(rangeEnd / loopHeight) + 1;

    for (let k = firstRepeat; k <= lastRepeat; k++) {
      const baseY = k * loopHeight;
      colItems.forEach((item) => {
        const top = baseY + item.top;
        if (top + item.height < rangeStart || top > rangeEnd) return;
        renderedCards.push(
          <div
            key={`${colIndex}-${item.id}-${k}`}
            className="gallerie-card"
            style={{
              left: colIndex * (colWidth + GAP),
              top,
              width: colWidth,
              height: item.height,
            }}
            onClick={() => setSelectedImage(item)}
          >
            <img src={item.src} alt={item.alt} className="gallerie-img" />
          </div>
        );
      });
    }
  });

  if (IMAGE_ENTRIES.length === 0) {
    return (
      <div className="gallerie-empty">
        Ajoute des photos dans src/assets/photo/gallerie/ pour remplir la galerie.
      </div>
    );
  }

  return (
    <div className="gallerie">
      <div ref={containerRef} onScroll={handleScroll} className="gallerie-scroll">
        <div className="gallerie-world" style={{ height: WORLD_HEIGHT }}>
          {renderedCards}
        </div>
      </div>

      {selectedImage && (
        <div className="gallerie-lightbox" onClick={() => setSelectedImage(null)}>
          <button
            className="gallerie-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Fermer"
          >
            ✕
          </button>
          <div className="gallerie-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="gallerie-lightbox-img"
            />
            {(selectedImage.title || selectedImage.technique) && (
              <div className="gallerie-lightbox-caption">
                {selectedImage.title && (
                  <p className="gallerie-lightbox-title">{selectedImage.title}</p>
                )}
                {selectedImage.technique && (
                  <p className="gallerie-lightbox-technique">{selectedImage.technique}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
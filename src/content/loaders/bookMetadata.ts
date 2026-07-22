export type BookMetadata = {
  coverUrl: string | null;
  amazonUrl: string;
  barnesAndNobleUrl: string;
  bookshopUrl: string;
};

function buildCoverUrl(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

async function coverExists(isbn: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
      { method: "HEAD" },
    );
    return response.ok;
  } catch (error) {
    console.warn(
      `[bookMetadata] Failed to check cover for ISBN ${isbn}:`,
      error,
    );
    return false;
  }
}

export async function fetchBookMetadata(
  isbn: string,
): Promise<BookMetadata | null> {
  if (!/^\d{9}[\dX]$/.test(isbn)) {
    console.warn(
      `[bookMetadata] '${isbn}' is not a valid ISBN-10 — skipping enrichment`,
    );
    return null;
  }

  const hasCover = await coverExists(isbn);

  return {
    coverUrl: hasCover ? buildCoverUrl(isbn) : null,
    amazonUrl: `https://www.amazon.com/dp/${isbn}`,
    barnesAndNobleUrl: `https://www.barnesandnoble.com/s/${isbn}`,
    bookshopUrl: `https://bookshop.org/books?keywords=${isbn}`,
  };
}

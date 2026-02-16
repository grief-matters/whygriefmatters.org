/** Pagefind browser-side search API types */

export interface PagefindSearchResult {
  id: string;
  data: () => Promise<PagefindFragment>;
}

export interface PagefindFragment {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    [key: string]: string | undefined;
  };
  sub_results?: PagefindSubResult[];
}

export interface PagefindSubResult {
  url: string;
  title: string;
  excerpt: string;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
}

export interface Pagefind {
  init: () => Promise<void>;
  search: (query: string) => Promise<PagefindSearchResponse | null>;
  debouncedSearch: (query: string) => Promise<PagefindSearchResponse | null>;
}

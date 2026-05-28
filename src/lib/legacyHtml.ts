export type LegacyFrontmatter = {
  layout?: string;
  home?: boolean;
  htmlclass?: string;
  type?: string;
  title?: string;
};

const PROFILE_SLUGS = [
  "gail-haggard",
  "lorraine-daroza",
  "gwen-wilder",
  "flora-daroza",
  "wes-costa",
  "julia-coster",
  "greg-costa",
] as const;

const slugPattern = PROFILE_SLUGS.join("|");

export function getBasePath() {
  const base = import.meta.env.BASE_URL || "/";
  return base === "/" ? "" : base.replace(/\/$/, "");
}

export function withBase(path: string) {
  const base = getBasePath();

  if (!path || path === "/") {
    return `${base}/`;
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("#")) {
    return path;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function profilePath(slug: string) {
  return `${withBase(`/${slug}`)}/`;
}

export function parseLegacyPage(raw: string) {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/);

  if (!match) {
    return {
      frontmatter: {} as LegacyFrontmatter,
      body: raw,
    };
  }

  const frontmatter = match[1]
    .split(/\r?\n/)
    .reduce<LegacyFrontmatter>((memo, line) => {
      const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!field) return memo;

      const key = field[1] as keyof LegacyFrontmatter;
      const rawValue = field[2].trim();
      const value =
        rawValue === "true"
          ? true
          : rawValue === "false"
            ? false
            : rawValue.replace(/^["']|["']$/g, "");

      return { ...memo, [key]: value };
    }, {});

  return {
    frontmatter,
    body: raw.slice(match[0].length),
  };
}

export function rewriteLegacyHtml(html: string) {
  let output = html;

  output = output.replace(
    new RegExp(`(href|data-url)=["']\\/(${slugPattern})(?:\\/)?["']`, "g"),
    (_match, attr: string, slug: string) => `${attr}="${profilePath(slug)}"`,
  );

  output = output.replace(/href=["']\/["']/g, `href="${withBase("/")}"`);

  output = output.replace(
    /(src|href)=["']\/(assets\/[^"']+)["']/g,
    (_match, attr: string, assetPath: string) => `${attr}="${withBase(`/${assetPath}`)}"`,
  );

  output = output.replace(
    /(src|data-bg-image)=["']assets\/([^"']+)["']/g,
    (_match, attr: string, assetPath: string) => `${attr}="${withBase(`/assets/${assetPath}`)}"`,
  );

  output = output.replace(
    /url\((['"]?)\/(assets\/[^)'"]+)\1\)/g,
    (_match, quote: string, assetPath: string) => `url(${quote}${withBase(`/${assetPath}`)}${quote})`,
  );

  output = output.replace(
    /url\((['"]?)assets\/([^)'"]+)\1\)/g,
    (_match, quote: string, assetPath: string) => `url(${quote}${withBase(`/assets/${assetPath}`)}${quote})`,
  );

  return output;
}

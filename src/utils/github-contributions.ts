export interface ContributionDay {
  date: string;
  level: number;
  label: string;
}

export interface ContributionCalendar {
  total: number;
  weeks: (ContributionDay | null)[][];
}

const cache = new Map<string, Promise<ContributionCalendar | null>>();

function attr(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function parseCalendar(html: string, weekCount: number): ContributionCalendar | null {
  const labels = new Map<string, string>();
  for (const [, id, label] of html.matchAll(
    /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
  )) {
    labels.set(id, label.trim());
  }

  const days: ContributionDay[] = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = attr(tag, 'data-date');
    const id = attr(tag, 'id');
    if (!date) continue;
    days.push({
      date,
      level: Number(attr(tag, 'data-level') ?? 0),
      label: (id && labels.get(id)) || date,
    });
  }
  if (!days.length) return null;

  days.sort((a, b) => a.date.localeCompare(b.date));

  const weeks: (ContributionDay | null)[][] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (!weeks.length || weekday === 0) weeks.push(Array(7).fill(null));
    weeks[weeks.length - 1][weekday] = day;
  }

  const totalText = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
  const total = totalText
    ? Number(totalText.replace(/,/g, ''))
    : days.reduce((sum, day) => sum + (Number(day.label.match(/^\d+/)?.[0]) || 0), 0);

  return { total, weeks: weeks.slice(-weekCount) };
}

/** Fetched once per build; returns null when GitHub is unreachable so the build never fails on it. */
export function getGithubContributions(username: string, weekCount = 53) {
  const key = `${username}:${weekCount}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`)
        .then((response) => (response.ok ? response.text() : ''))
        .then((html) => parseCalendar(html, weekCount))
        .catch(() => null),
    );
  }
  return cache.get(key)!;
}

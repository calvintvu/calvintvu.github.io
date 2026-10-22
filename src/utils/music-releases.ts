export type MusicRelease = {
  title: string;
  releaseDate: string;
  cover: string;
};

type DeezerAlbum = {
  title: string;
  release_date: string;
  record_type: string;
  cover_xl: string;
};

let cache: Promise<MusicRelease[]> | undefined;

/** Fetched once per build from Deezer's public API; returns [] when unreachable so the build never fails on it. */
export function getMusicReleases(deezerArtistId: number) {
  cache ??= fetch(`https://api.deezer.com/artist/${deezerArtistId}/albums?limit=100`)
    .then((response) => (response.ok ? response.json() : { data: [] }))
    .then(({ data }: { data?: DeezerAlbum[] }) =>
      (data ?? [])
        .filter((album) => album.record_type === 'single')
        .sort((a, b) => b.release_date.localeCompare(a.release_date))
        .map((album) => ({
          title: album.title,
          releaseDate: album.release_date,
          cover: album.cover_xl,
        })),
    )
    .catch(() => []);
  return cache;
}

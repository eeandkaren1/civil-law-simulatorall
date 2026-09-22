#!/usr/bin/env python3
"""Download every externally hosted application image and replace source URLs with local WebP paths."""

from __future__ import annotations

import hashlib
import io
import re
import shutil
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "client" / "public" / "images"
SOURCES = [
    *sorted((ROOT / "shared").glob("*.ts")),
    ROOT / "client" / "src" / "pages" / "Home.tsx",
]
URL_PATTERN = re.compile(r'https://(?:i\.imgur\.com|files\.catbox\.moe|d2xsxph8kpxj0f\.cloudfront\.net)/[^"\'` )]+')
TARGET_MIN = 100 * 1024
TARGET_MAX = 200 * 1024

# Three historical Imgur links now return non-image response bodies. Their
# corresponding Catbox originals remain available, so preserve the source URL
# mapping while using the accessible file for the one-time local conversion.
FALLBACK_SOURCES = {
    "https://i.imgur.com/hzzjoc.jpg": "https://files.catbox.moe/hzzjoc.jpg",
    "https://i.imgur.com/ly3znp.jpg": "https://files.catbox.moe/ly3znp.jpg",
    "https://i.imgur.com/urnbj5.jpg": "https://files.catbox.moe/urnbj5.jpg",
}


def output_name(url: str) -> str:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:12]
    stem = re.sub(r"[^a-zA-Z0-9]+", "-", Path(url.split("?")[0]).stem).strip("-").lower()
    return f"{stem[:42]}-{digest}.webp"


def fetch(url: str) -> bytes:
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; LawVibeImageLocalizer/1.0)"})
            with urlopen(request, timeout=45) as response:
                return response.read()
        except (HTTPError, URLError, TimeoutError) as error:
            last_error = error
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Unable to download {url}: {last_error}")


def convert(data: bytes, destination: Path) -> None:
    with Image.open(io.BytesIO(data)) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        # Preserve the 16:9 visual ratio while preventing oversized mobile downloads.
        image.thumbnail((1280, 720), Image.Resampling.LANCZOS)
        candidate: bytes | None = None
        for quality in (88, 84, 80, 76, 72, 68, 64, 60):
            buffer = io.BytesIO()
            image.save(buffer, format="WEBP", quality=quality, method=6)
            current = buffer.getvalue()
            candidate = current
            if len(current) <= TARGET_MAX:
                break
        if candidate is None:
            raise RuntimeError("Image conversion produced no data")
        destination.write_bytes(candidate)


def main() -> int:
    urls: set[str] = set()
    source_text: dict[Path, str] = {}
    for path in SOURCES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        source_text[path] = text
        urls.update(URL_PATTERN.findall(text))

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    mapping: dict[str, str] = {}
    failures: list[str] = []
    for index, url in enumerate(sorted(urls), start=1):
        filename = output_name(url)
        destination = ASSET_DIR / filename
        try:
            if not destination.exists():
                convert(fetch(FALLBACK_SOURCES.get(url, url)), destination)
            size = destination.stat().st_size
            if size > TARGET_MAX:
                raise RuntimeError(f"compressed output is {size} bytes, above {TARGET_MAX}")
            mapping[url] = f"images/{filename}"
            print(f"[{index}/{len(urls)}] {size:6d} bytes  {url} -> {mapping[url]}")
        except Exception as error:
            failures.append(f"{url}: {error}")
            print(f"FAILED {url}: {error}", file=sys.stderr)

    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1

    for path, original in source_text.items():
        updated = original
        for url, local_path in mapping.items():
            updated = updated.replace(url, local_path)
        if updated != original:
            path.write_text(updated, encoding="utf-8")

    manifest = ROOT / "references" / "local-image-manifest.txt"
    manifest.write_text(
        "# Generated local image manifest\n# Source URL -> local public path\n" + "\n".join(f"{url} -> /{local}" for url, local in sorted(mapping.items())) + "\n",
        encoding="utf-8",
    )
    print(f"Localized {len(mapping)} unique images into {ASSET_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

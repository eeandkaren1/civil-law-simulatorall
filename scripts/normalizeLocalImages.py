#!/usr/bin/env python3
"""Ensure generated local WebP images remain at or below 200,000 bytes."""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageOps

ASSET_DIR = Path(__file__).resolve().parents[1] / "client" / "public" / "images"
MAX_BYTES = 200_000


def normalize(path: Path) -> int:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        for quality in range(76, 39, -4):
            buffer = io.BytesIO()
            image.save(buffer, format="WEBP", quality=quality, method=6)
            result = buffer.getvalue()
            if len(result) <= MAX_BYTES:
                path.write_bytes(result)
                return len(result)
    raise RuntimeError(f"Unable to compress {path.name} below {MAX_BYTES} bytes")


def main() -> None:
    changed = []
    for path in sorted(ASSET_DIR.glob("*.webp")):
        if path.stat().st_size > MAX_BYTES:
            changed.append((path.name, normalize(path)))
    for name, size in changed:
        print(f"{name}: {size} bytes")
    print(f"Normalized {len(changed)} image(s).")


if __name__ == "__main__":
    main()

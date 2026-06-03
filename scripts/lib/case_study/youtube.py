from __future__ import annotations

import re
from urllib.parse import parse_qs, urlparse

YOUTUBE_PATTERNS = (
    re.compile(r"(?:youtube\.com/watch\?.*v=|youtu\.be/|youtube\.com/embed/)([A-Za-z0-9_-]{11})"),
    re.compile(r"^[A-Za-z0-9_-]{11}$"),
)


def parse_youtube_video_id(url_or_id: str) -> str | None:
    value = (url_or_id or "").strip()
    if not value:
        return None
    for pattern in YOUTUBE_PATTERNS:
        match = pattern.search(value)
        if match:
            return match.group(1)
    parsed = urlparse(value)
    if parsed.hostname and "youtube" in parsed.hostname:
        query = parse_qs(parsed.query)
        if query.get("v"):
            vid = query["v"][0]
            if len(vid) == 11:
                return vid
    return None


def embed_src(video_id: str, start_seconds: int = 0) -> str:
    base = f"https://www.youtube-nocookie.com/embed/{video_id}"
    if start_seconds > 0:
        return f"{base}?start={start_seconds}"
    return base


def watch_url(video_id: str, start_seconds: int = 0) -> str:
    url = f"https://www.youtube.com/watch?v={video_id}"
    if start_seconds > 0:
        return f"{url}&t={start_seconds}"
    return url


def poster_url(video_id: str) -> str:
    return f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

#!/usr/bin/env python3
"""Sally hi-fi — Stryker field logistics iPhone 15 Pro renders (iOS grouped UI)."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "case-studies" / "stryker-field-logistics" / "hifi-src"
SCREENS = OUT / "screens"
HERO_TICKER = ROOT / "assets" / "case-studies" / "stryker-field-logistics" / "hero-ticker"
BEATS = ROOT / "assets" / "case-studies" / "stryker-field-logistics" / "beats"

# Canvas & device
CW, CH = 1200, 960
FX, FY = 395, 36
BEZEL = 14
SW, SH = 390, 844
SX, SY = FX + BEZEL, FY + BEZEL
FW, FH = SW + BEZEL * 2, SH + BEZEL * 2

# In-screen layout (pt)
M = 16
STATUS = 54
NAV = 44
TITLE_BLOCK = 72
TAB = 83
HOME_IND = 20

CONTENT_X = SX + M
CONTENT_W = SW - M * 2
HEADER_BOTTOM = SY + STATUS + NAV + TITLE_BLOCK
TAB_TOP = SY + SH - TAB
SCROLL_BOTTOM = TAB_TOP - 8
BTN_H = 50

# Tokens — Sally spec
INK = "#1C1C1E"
LBL = "#8E8E93"
BG = "#F2F2F7"
CARD = "#FFFFFF"
SEP = "#C6C6C8"
YEL = "#FFCD00"
BLUE = "#007AFF"
GREEN = "#34C759"
ORANGE = "#FF9500"
RED = "#FF3B30"
BEZEL_C = "#1C1C1E"
FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"


def xml_esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )

ICONS: dict[str, str] = {
    "home": "M10.55 2.1a1.5 1.5 0 0 1 2.1.35l8 10A1.5 1.5 0 0 1 19.5 15H17v6.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 11 21.5V17H9v4.5A1.5 1.5 0 0 1 7.5 23h-3A1.5 1.5 0 0 1 3 21.5V15H.9a1.5 1.5 0 0 1-1.15-2.45l8-10a1.5 1.5 0 0 1 2.1-.35Z",
    "box": "M12 2.2a1.2 1.2 0 0 1 .5.1l8 3.5a1.2 1.2 0 0 1 .7 1.1v9.2a1.2 1.2 0 0 1-.7 1.1l-8 3.5a1.2 1.2 0 0 1-1 0l-8-3.5a1.2 1.2 0 0 1-.7-1.1V6.9a1.2 1.2 0 0 1 .7-1.1l8-3.5a1.2 1.2 0 0 1 .5-.1Zm0 2.3-6.8 3 6.8 3 6.8-3-6.8-3ZM5 10.2v5.1l6 2.6v-5.1l-6-2.6Zm14 0-6 2.6v5.1l6-2.6v-5.1Z",
    "cart": "M8 2.25A3.25 3.25 0 0 0 4.75 5.5v.26c0 .3.04.6.11.88L3 18.75A1.25 1.25 0 0 0 4.24 20.5h15.52a1.25 1.25 0 0 0 1.24-1.42l-1.86-12.11a3.25 3.25 0 0 0-3.21-2.77H8.9a3.25 3.25 0 0 0-3.2 2.77H4.75A1.25 1.25 0 0 1 8 4.75h8a1.25 1.25 0 0 1 0 2.5H8ZM7.5 21a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm9 0a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z",
    "person": "M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM5.5 20.5a6.5 6.5 0 0 1 13 0 .75.75 0 0 1-.75.75h-11.5a.75.75 0 0 1-.75-.75Z",
    "building": "M6.5 3A1.5 1.5 0 0 0 5 4.5V20a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-5h6v5a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V4.5A1.5 1.5 0 0 0 17.5 3h-11ZM9 8.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
    "location": "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z",
    "vehicle": "M18.33 8.5h-.42l-1.34-3.2A2.5 2.5 0 0 0 14.24 4H9.76a2.5 2.5 0 0 0-2.33 1.3L6.09 8.5h-.42A2.5 2.5 0 0 0 3 11v4.75A1.25 1.25 0 0 0 4.25 17h1.1a2.75 2.75 0 0 0 5.3 0h3.7a2.75 2.75 0 0 0 5.3 0h1.1A1.25 1.25 0 0 0 21 15.75V11a2.5 2.5 0 0 0-2.67-2.5ZM9 6.5h6l1.2 2.8H7.8L9 6.5ZM7.25 18a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm9.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z",
    "check": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 13.2-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8Z",
    "check_circle": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.97 13.03-3.5-3.5 1.41-1.42 2.09 2.08 4.59-4.59 1.41 1.42-6 6Z",
    "clock": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a.75.75 0 0 1 .75.75v4.69l3.72 2.23a.75.75 0 1 1-.74 1.3l-4-2.4A.75.75 0 0 1 11.25 12V7.75A.75.75 0 0 1 12 7Z",
    "add": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5a1 1 0 0 0-2 0v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4V7Z",
    "arrow_right": "M13.47 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L17.94 12H4.75a.75.75 0 0 1 0-1.5h13.19l-3.47-3.47a.75.75 0 0 1 0-1.06Z",
    "chevron": "M10.3 4.3a1 1 0 0 1 1.4 0l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4-1.4L16.58 12 10.3 5.7a1 1 0 0 1 0-1.4Z",
    "clipboard": "M9 3.5A1.5 1.5 0 0 0 7.5 2h9A1.5 1.5 0 0 0 15 3.5V4h2.5A1.5 1.5 0 0 1 19 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5v-15A1.5 1.5 0 0 1 6.5 4H9V3.5ZM8 6.5v13h8v-13H8Zm2-3h4v1H10v-1Z",
    "star": "M12 2.6l2.4 5.5 6 .5-4.5 4 1.4 5.9L12 15.8l-5.3 2.7 1.4-5.9-4.5-4 6-.5L12 2.6Z",
    "shield": "M12 2l7 3v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5l7-3Z",
    "arrow_sync": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 4.07V3.5a.5.5 0 0 1 .85-.35l2.15 2.15a.5.5 0 0 1-.35.85H13.5a8 8 0 1 1-7.78 10.07.75.75 0 1 1 .28-1.48A6.5 6.5 0 1 0 13 6.07Z",
    "mail": "M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-13ZM6.5 5A.5.5 0 0 0 6 5.5v.22l6 4.2 6-4.2V5.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5Zm12.38 2.38-5.88 4.12a1 1 0 0 1-1.15 0L5.62 7.38A.5.5 0 0 0 5 8v10.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.62-.12Z",
    "more": "M5.75 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.75 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.75 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z",
    "heart_pulse": "M12 4.5c-1.5-2.5-5-2-5.5 1.5C5.5 11 12 18 12 18s6.5-7 5.5-12c-.5-3.5-4-4-5.5-1.5Z",
    "print": "M7 4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V7h2.5A2.5 2.5 0 0 1 22 9.5V16a2.5 2.5 0 0 1-2.5 2.5H19v3.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V18.5H4.5A2.5 2.5 0 0 1 2 16V9.5A2.5 2.5 0 0 1 4.5 7H7V4.5ZM9 7h6V5H9v2Zm-2 11h10v-3H7v3Z",
}


def ic(name: str, x: float, y: float, sz: float = 18, fill: str = LBL, flip: bool = False) -> str:
    d = ICONS.get(name, ICONS["check"])
    s = sz / 24
    sx = -s if flip else s
    return f'<g transform="translate({x},{y}) scale({sx},{s})" fill="{fill}"><path d="{d}"/></g>'


@dataclass
class Cell:
    title: str
    sub: str | None = None
    icon: str | None = None
    icon_color: str = BLUE
    pill: str | None = None
    pill_bg: str = "#E8F4FD"
    pill_fg: str = BLUE
    chevron: bool = False


@dataclass
class Screen:
    parts: list[str] = field(default_factory=list)
    y: float = 0.0
    nav_active: int = 0
    beat_caption: str = ""

    def add(self, s: str) -> None:
        self.parts.append(s)

    def gap(self, n: int = 20) -> None:
        self.y += n

    def section(self, label: str) -> None:
        self.add(
            f'<text x="{CONTENT_X}" y="{self.y + 12}" font-family="{FONT}" font-size="11" '
            f'font-weight="600" fill="{LBL}" letter-spacing="0.06em">{xml_esc(label.upper())}</text>'
        )
        self.y += 28

    def group(self, cells: list[Cell], hero: bool = False) -> None:
        ch = 52 if not hero else 0
        for c in cells:
            ch += 58 if c.sub else 52
        if hero:
            ch = 108
        y0 = self.y
        self.add(
            f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="{ch}" rx="12" fill="{CARD}" '
            f'stroke="{SEP}" stroke-width="0.5"/>'
        )
        cy = y0 + (16 if hero else 0)
        for i, c in enumerate(cells):
            if hero and i == 0:
                self._hero_cell(y0, c)
                continue
            self._cell_inner(cy, c, i == len(cells) - 1)
            cy += 58 if c.sub else 52
        self.y = y0 + ch + 20

    def _hero_cell(self, y0: float, c: Cell) -> None:
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="108" rx="12" fill="{INK}"/>')
        self.add(ic(c.icon or "building", CONTENT_X + 16, y0 + 20, 28, YEL))
        self.add(
            f'<text x="{CONTENT_X + 52}" y="{y0 + 32}" font-family="{FONT}" font-size="11" font-weight="700" '
            f'fill="{YEL}" letter-spacing="0.08em">ACTIVE VISIT</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 62}" font-family="{FONT}" font-size="20" font-weight="700" '
            f'fill="#FFFFFF">{xml_esc(c.title)}</text>'
        )
        if c.sub:
            self.add(ic("location", CONTENT_X + 16, y0 + 72, 14, "#AEAEB2"))
            self.add(
                f'<text x="{CONTENT_X + 36}" y="{y0 + 86}" font-family="{FONT}" font-size="14" '
                f'fill="#AEAEB2">{xml_esc(c.sub)}</text>'
            )

    def _cell_inner(self, cy: float, c: Cell, last: bool) -> None:
        tx = CONTENT_X + 16
        if c.icon:
            self.add(f'<rect x="{tx}" y="{cy + 8}" width="32" height="32" rx="8" fill="{c.icon_color}20"/>')
            self.add(ic(c.icon, tx + 7, cy + 15, 18, c.icon_color))
            tx += 44
        self.add(
            f'<text x="{tx}" y="{cy + 26}" font-family="{FONT}" font-size="17" fill="{INK}">'
            f'{xml_esc(c.title)}</text>'
        )
        if c.sub:
            self.add(
                f'<text x="{tx}" y="{cy + 44}" font-family="{FONT}" font-size="14" fill="{LBL}">'
                f'{xml_esc(c.sub)}</text>'
            )
        if c.pill:
            pw = len(c.pill) * 6.5 + 20
            px = CONTENT_X + CONTENT_W - pw - 16
            self.add(f'<rect x="{px}" y="{cy + 16}" width="{pw}" height="24" rx="12" fill="{c.pill_bg}"/>')
            self.add(
                f'<text x="{px + 10}" y="{cy + 32}" font-family="{FONT}" font-size="11" font-weight="600" '
                f'fill="{c.pill_fg}">{xml_esc(c.pill)}</text>'
            )
        if c.chevron:
            self.add(ic("chevron", CONTENT_X + CONTENT_W - 28, cy + 18, 14, "#C7C7CC"))
        if not last:
            sx = tx if c.icon else CONTENT_X + 16
            self.add(
                f'<line x1="{sx}" y1="{cy + 51}" x2="{CONTENT_X + CONTENT_W}" y2="{cy + 51}" '
                f'stroke="{SEP}" stroke-width="0.5"/>'
            )

    def banner(self, title: str, sub: str) -> None:
        y0 = self.y
        self.add(
            f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="72" rx="12" fill="#FFF9E0" '
            f'stroke="{YEL}" stroke-width="1"/>'
        )
        self.add(ic("star", CONTENT_X + 14, y0 + 16, 22, ORANGE))
        self.add(
            f'<text x="{CONTENT_X + 44}" y="{y0 + 28}" font-family="{FONT}" font-size="15" font-weight="600" '
            f'fill="{INK}">{xml_esc(title)}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 44}" y="{y0 + 48}" font-family="{FONT}" font-size="13" fill="{LBL}">'
            f'{xml_esc(sub)}</text>'
        )
        self.y = y0 + 72 + 20

    def timeline(self, steps: list[tuple[str, str]]) -> None:
        y0 = self.y
        h = len(steps) * 40 + 16
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="{h}" rx="12" fill="{CARD}"/>')
        cy = y0 + 16
        for i, (label, state) in enumerate(steps):
            col = GREEN if state == "done" else (ORANGE if state == "active" else "#C7C7CC")
            self.add(f'<circle cx="{CONTENT_X + 28}" cy="{cy + 8}" r="5" fill="{col}"/>')
            if i < len(steps) - 1:
                self.add(
                    f'<line x1="{CONTENT_X + 28}" y1="{cy + 14}" x2="{CONTENT_X + 28}" y2="{cy + 34}" '
                    f'stroke="{SEP}" stroke-width="2"/>'
                )
            fw = ' font-weight="600"' if state == "active" else ""
            fc = INK if state != "pending" else LBL
            self.add(
                f'<text x="{CONTENT_X + 44}" y="{cy + 12}" font-family="{FONT}" font-size="15" fill="{fc}"{fw}>'
                f'{xml_esc(label)}</text>'
            )
            cy += 40
        self.y = y0 + h + 20

    def toggle_row(self, label: str, on: bool = True) -> None:
        y0 = self.y
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="52" rx="12" fill="{CARD}"/>')
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 32}" font-family="{FONT}" font-size="17" fill="{INK}">'
            f'{xml_esc(label)}</text>'
        )
        if on:
            self.add(f'<rect x="{CONTENT_X + CONTENT_W - 59}" y="{y0 + 14}" width="51" height="31" rx="16" fill="{GREEN}"/>')
            self.add(f'<circle cx="{CONTENT_X + CONTENT_W - 24}" cy="{y0 + 29}" r="13" fill="white"/>')
        self.y = y0 + 52 + 20

    def primary_btn(self, label: str) -> None:
        by = TAB_TOP - BTN_H - 24
        self.add(
            f'<rect x="{CONTENT_X}" y="{by}" width="{CONTENT_W}" height="{BTN_H}" rx="12" fill="{YEL}"/>'
        )
        self.add(
            f'<text x="{SX + SW // 2}" y="{by + 31}" text-anchor="middle" font-family="{FONT}" '
            f'font-size="17" font-weight="600" fill="{INK}">{xml_esc(label)}</text>'
        )


def studio_bg() -> str:
    return f"""<defs>
  <filter id="devShadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="28" stdDeviation="24" flood-color="#000" flood-opacity="0.22"/>
  </filter>
  <linearGradient id="studio" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#E5E5EA"/><stop offset="100%" stop-color="#F2F2F7"/>
  </linearGradient>
</defs>
<rect width="{CW}" height="{CH}" fill="url(#studio)"/>
<text x="80" y="80" font-family="{FONT}" font-size="11" font-weight="600" fill="{LBL}" letter-spacing="0.1em">STRYKER · FIELD LOGISTICS</text>
<text x="80" y="108" font-family="{FONT}" font-size="28" font-weight="700" fill="{INK}">Rep workflow</text>"""


def iphone_chrome(s: Screen, large_title: str, subtitle: str | None, trailing: str | None) -> str:
    o = []
    o.append(studio_bg())
    o.append(f'<rect x="{FX}" y="{FY}" width="{FW}" height="{FH}" rx="54" fill="{BEZEL_C}" filter="url(#devShadow)"/>')
    o.append(f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="44" fill="{BG}"/>')
    # Dynamic Island
    o.append(f'<rect x="{SX + SW // 2 - 63}" y="{SY + 10}" width="126" height="37" rx="19" fill="#000"/>')
    # Status
    o.append(
        f'<text x="{SX + 28}" y="{SY + 38}" font-family="{FONT}" font-size="15" font-weight="600" fill="{INK}">9:41</text>'
    )
    o.append(f'<rect x="{SX + SW - 76}" y="{SY + 26}" width="22" height="11" rx="3" stroke="{INK}" fill="none"/>')
    o.append(f'<rect x="{SX + SW - 50}" y="{SY + 28}" width="16" height="8" rx="2" fill="{INK}"/>')
    # Nav
    ny = SY + STATUS
    o.append(f'<rect x="{SX}" y="{ny}" width="{SW}" height="{NAV}" fill="{BG}"/>')
    o.append(ic("chevron", SX + 12, ny + 12, 18, BLUE, flip=True))
    o.append(
        f'<text x="{SX + SW // 2}" y="{ny + 28}" text-anchor="middle" font-family="{FONT}" '
        f'font-size="15" font-weight="700" fill="{INK}" letter-spacing="0.04em">stryker</text>'
    )
    if trailing:
        o.append(ic(trailing, SX + SW - 36, ny + 10, 22, BLUE))
    # Large title
    ty = ny + NAV + 4
    o.append(
        f'<text x="{CONTENT_X}" y="{ty + 30}" font-family="{FONT}" font-size="34" font-weight="700" fill="{INK}">'
        f'{xml_esc(large_title)}</text>'
    )
    if subtitle:
        o.append(
            f'<text x="{CONTENT_X}" y="{ty + 54}" font-family="{FONT}" font-size="15" fill="{LBL}">'
            f'{xml_esc(subtitle)}</text>'
        )
    # Tab bar
    tb = TAB_TOP
    o.append(f'<rect x="{SX}" y="{tb}" width="{SW}" height="{TAB}" fill="rgba(255,255,255,0.94)"/>')
    o.append(f'<line x1="{SX}" y1="{tb}" x2="{SX + SW}" y2="{tb}" stroke="{SEP}"/>')
    tabs = [("home", "Home"), ("cart", "Orders"), ("box", "Parts"), ("more", "More")]
    for i, (icn, lb) in enumerate(tabs):
        cx = SX + 48 + i * 98
        col = BLUE if i == s.nav_active else LBL
        o.append(ic(icn, cx - 9, tb + 10, 22, col))
        o.append(
            f'<text x="{cx}" y="{tb + 48}" text-anchor="middle" font-family="{FONT}" font-size="10" '
            f'font-weight="{"600" if i == s.nav_active else "400"}" fill="{col}">{lb}</text>'
        )
    # Home indicator
    o.append(
        f'<rect x="{SX + SW // 2 - 67}" y="{SY + SH - 14}" width="134" height="5" rx="3" fill="#000" opacity="0.35"/>'
    )
    o.append(
        f'<text x="{SX + SW // 2}" y="{FY + FH + 36}" text-anchor="middle" font-family="{FONT}" '
        f'font-size="13" fill="{LBL}" letter-spacing="0.04em">{xml_esc(s.beat_caption)}</text>'
    )
    s.y = HEADER_BOTTOM
    return "\n".join(o)


def iphone_screen_chrome(s: Screen, large_title: str, subtitle: str | None, trailing: str | None) -> str:
    """Screen-only chrome for Magic UI iPhone frame — no studio, bezel, or Dynamic Island."""
    o = [f'<rect width="{SW}" height="{SH}" fill="{BG}"/>']
    o.append(f'<rect x="0" y="0" width="{SW}" height="{STATUS}" fill="{BG}"/>')
    ny = STATUS
    o.append(f'<rect x="0" y="{ny}" width="{SW}" height="{NAV}" fill="{BG}"/>')
    o.append(ic("chevron", 12, ny + 12, 18, BLUE, flip=True))
    o.append(
        f'<text x="{SW // 2}" y="{ny + 28}" text-anchor="middle" font-family="{FONT}" '
        f'font-size="15" font-weight="700" fill="{INK}" letter-spacing="0.04em">stryker</text>'
    )
    if trailing:
        o.append(ic(trailing, SW - 36, ny + 10, 22, BLUE))
    ty = ny + NAV + 4
    o.append(
        f'<text x="{M}" y="{ty + 30}" font-family="{FONT}" font-size="34" font-weight="700" fill="{INK}">'
        f'{xml_esc(large_title)}</text>'
    )
    if subtitle:
        o.append(
            f'<text x="{M}" y="{ty + 54}" font-family="{FONT}" font-size="15" fill="{LBL}">'
            f'{xml_esc(subtitle)}</text>'
        )
    tb = SH - TAB
    o.append(f'<rect x="0" y="{tb}" width="{SW}" height="{TAB}" fill="rgba(255,255,255,0.94)"/>')
    o.append(f'<line x1="0" y1="{tb}" x2="{SW}" y2="{tb}" stroke="{SEP}"/>')
    tabs = [("home", "Home"), ("cart", "Orders"), ("box", "Parts"), ("more", "More")]
    for i, (icn, lb) in enumerate(tabs):
        cx = 48 + i * 98
        col = BLUE if i == s.nav_active else LBL
        o.append(ic(icn, cx - 9, tb + 10, 22, col))
        o.append(
            f'<text x="{cx}" y="{tb + 48}" text-anchor="middle" font-family="{FONT}" font-size="10" '
            f'font-weight="{"600" if i == s.nav_active else "400"}" fill="{col}">{lb}</text>'
        )
    o.append(
        f'<rect x="{SW // 2 - 67}" y="{SH - 14}" width="134" height="5" rx="3" fill="#000" opacity="0.35"/>'
    )
    s.y = STATUS + NAV + TITLE_BLOCK
    return "\n".join(o)


def _with_screen_layout(embed: bool):
    class _Ctx:
        def __enter__(self):
            global SX, SY, CONTENT_X, CONTENT_W, HEADER_BOTTOM, TAB_TOP, SCROLL_BOTTOM
            self._prev = (SX, SY, CONTENT_X, CONTENT_W, HEADER_BOTTOM, TAB_TOP, SCROLL_BOTTOM)
            if embed:
                SX, SY = 0, 0
                CONTENT_X, CONTENT_W = M, SW - M * 2
                HEADER_BOTTOM = STATUS + NAV + TITLE_BLOCK
                TAB_TOP = SH - TAB
                SCROLL_BOTTOM = TAB_TOP - 8
            return self

        def __exit__(self, *_args):
            global SX, SY, CONTENT_X, CONTENT_W, HEADER_BOTTOM, TAB_TOP, SCROLL_BOTTOM
            SX, SY, CONTENT_X, CONTENT_W, HEADER_BOTTOM, TAB_TOP, SCROLL_BOTTOM = self._prev

    return _Ctx()


def build_beat_01(s: Screen) -> None:
    s.group(
        [Cell("Northwest Medical Center", "OR 4 · Robotic spine", "building", YEL)],
        hero=True,
    )
    s.section("Visit details")
    s.group(
        [
            Cell("Dr. Elena Vasquez", "Surgeon", "heart_pulse", RED, chevron=True),
            Cell("Jordan Lee", "Territory West · Rep", "person", BLUE, chevron=True),
            Cell("CASE-28491", "Case reference", "clipboard", LBL, chevron=True),
        ]
    )
    s.banner("Review preferences before ordering", "≈2 min · no open returns")
    s.primary_btn("Start visit")


def build_beat_02(s: Screen) -> None:
    s.section("Saved for surgeon")
    s.group(
        [
            Cell("Primary tray preference", "Mako · Spine set A · Size M", "box", BLUE, pill="Preferred", pill_bg="#E8F8EC", pill_fg=GREEN),
            Cell("Backup & exceptions", "Set B · titanium screws", "shield", ORANGE),
        ]
    )
    s.toggle_row("Apply preferences to this order", True)
    s.primary_btn("Continue to order")


def build_beat_03(s: Screen) -> None:
    s.nav_active = 1
    s.section("Line items")
    s.group(
        [
            Cell("Spine set A", "Qty 1 · From preferences", "star", YEL),
            Cell("Titanium screw kit", "Qty 2 · SKU TRQ-4420", "box", BLUE),
        ]
    )
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="{CONTENT_W}" height="44" rx="10" fill="{CARD}" stroke="{SEP}"/>'
    )
    s.add(ic("add", CONTENT_X + 14, s.y + 12, 20, BLUE))
    s.add(
        f'<text x="{CONTENT_X + 42}" y="{s.y + 28}" font-family="{FONT}" font-size="17" fill="{BLUE}">'
        f'Add line item</text>'
    )
    s.y += 64
    s.toggle_row("Surgeon sign-off · confirmed in OR", True)
    s.primary_btn("Submit order")


def build_beat_04(s: Screen) -> None:
    s.nav_active = 1
    s.gap(8)
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="100" height="28" rx="14" fill="#E5E5EA"/>'
        f'<text x="{CONTENT_X + 14}" y="{s.y + 18}" font-family="{FONT}" font-size="13" font-weight="600" fill="{INK}">ORD-91827</text>'
        f'<rect x="{CONTENT_X + 112}" y="{s.y}" width="110" height="28" rx="14" fill="#FFF4E5"/>'
        f'<text x="{CONTENT_X + 126}" y="{s.y + 18}" font-family="{FONT}" font-size="13" font-weight="600" fill="{ORANGE}">In fulfillment</text>'
    )
    s.y += 40
    s.timeline(
        [
            ("Submitted", "done"),
            ("Confirmed by ops", "done"),
            ("Picking · ETA 2h", "active"),
            ("Shipped to hospital", "pending"),
            ("Received at site", "pending"),
        ]
    )
    s.group([Cell("Lisa M.", "Central supply · Owner", "person", BLUE)])
    s.primary_btn("View parts")


def build_beat_05(s: Screen) -> None:
    s.nav_active = 2
    s.section("Parts · ORD-91827")
    s.group(
        [
            Cell("Titanium screw kit", "SN TRQ-4420-88A", "box", GREEN, pill="At hospital", pill_bg="#E8F8EC", pill_fg=GREEN),
            Cell("Spine set A", "SN SPNE-A12-001", "box", ORANGE, pill="In transit", pill_bg="#FFF4E5", pill_fg=ORANGE),
            Cell("Spine set B", "SN SPNE-B12-002 · Backup", "box", BLUE, pill="Allocated", pill_bg="#E8F4FD", pill_fg=BLUE),
        ]
    )
    s.primary_btn("Open part detail")


def build_beat_06(s: Screen) -> None:
    s.nav_active = 2
    s.section("Order delivery")
    s.group([Cell("Bay Area Med Logistics", "Today 14:30–15:00 · Shipped", "vehicle", BLUE, pill="Shipped", pill_bg="#E8F8EC", pill_fg=GREEN)])
    s.section("OR shelf")
    s.group(
        [
            Cell("Spine set A", "Received · OR 4 · 13:02", "check_circle", GREEN),
            Cell("Titanium screw kit", "Still in transit", "clock", ORANGE),
        ]
    )
    s.primary_btn("Confirm receipt")


def build_beat_07(s: Screen) -> None:
    s.nav_active = 2
    s.section("Procedure · CASE-28491")
    s.group(
        [
            Cell("Spine set A", "SN SPNE-A12-001 · Used 11:42", "check_circle", GREEN, pill="Logged", pill_bg="#E8F8EC", pill_fg=GREEN),
            Cell("Titanium screw kit", "1 of 2 used", "box", INK, pill="Return 1", pill_bg="#FFEBEA", pill_fg=RED),
        ]
    )
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="{CONTENT_W}" height="40" rx="10" fill="#E5E5EA"/>'
        f'<text x="{CONTENT_X + 36}" y="{s.y + 24}" font-family="{FONT}" font-size="13" fill="{LBL}">'
        f'Audit trail saved to case record</text>'
    )
    s.add(ic("shield", CONTENT_X + 12, s.y + 10, 18, LBL))
    s.y += 56
    s.primary_btn("Save usage")


def build_beat_08(s: Screen) -> None:
    s.nav_active = 2
    s.section("Return")
    s.group(
        [
            Cell("Titanium screw kit", "1 unit · Not used", "box", ORANGE, pill="Pickup scheduled", pill_bg="#FFF4E5", pill_fg=ORANGE),
            Cell("RET-2201", "Courier pickup today 16:00", "mail", BLUE),
        ]
    )
    s.toggle_row("Surgeon notified", True)
    s.primary_btn("Print return label")


def build_beat_09(s: Screen) -> None:
    s.nav_active = 3
    s.gap(4)
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="130" height="28" rx="14" fill="#FFF4E5"/>'
        f'<text x="{CONTENT_X + 14}" y="{s.y + 18}" font-family="{FONT}" font-size="13" font-weight="600" fill="{ORANGE}">Needs approval</text>'
    )
    s.y += 40
    s.group([Cell("Flexible reamer · 9mm", "Requested item", "box", BLUE)])
    s.section("Justification")
    s.add(f'<rect x="{CONTENT_X}" y="{s.y}" width="{CONTENT_W}" height="72" rx="12" fill="{CARD}"/>')
    s.add(
        f'<text x="{CONTENT_X + 16}" y="{s.y + 28}" font-family="{FONT}" font-size="15" fill="{INK}">'
        f'Surgeon requested for revision</text>'
    )
    s.add(
        f'<text x="{CONTENT_X + 16}" y="{s.y + 48}" font-family="{FONT}" font-size="13" fill="{LBL}">'
        f'CASE-28491</text>'
    )
    s.y += 92
    s.group([Cell("Dr. Vasquez", "Linked surgeon", "person", LBL)])
    s.add(ic("clock", CONTENT_X, s.y, 16, ORANGE))
    s.add(
        f'<text x="{CONTENT_X + 22}" y="{s.y + 14}" font-family="{FONT}" font-size="13" fill="{LBL}">'
        f'Ops SLA 4h · notify on approve</text>'
    )
    s.y += 28
    s.primary_btn("Submit request")


def build_beat_10(s: Screen) -> None:
    s.section("Visit complete")
    s.group(
        [
            Cell("1 order submitted", None, "check_circle", GREEN),
            Cell("2 parts used · logged", None, "check_circle", GREEN),
            Cell("1 return · pickup 16:00", None, "clock", ORANGE),
            Cell("1 part request pending", None, "clock", ORANGE),
            Cell("Preferences updated", "Dr. Vasquez", "star", BLUE),
        ]
    )
    s.banner("Nothing ambiguous open", "Next visit pre-loaded")
    s.primary_btn("End visit")


def write(name: str, caption: str, title: str, subtitle: str | None, trailing: str | None, nav: int, builder) -> None:
    s = Screen(beat_caption=caption, nav_active=nav)
    with _with_screen_layout(embed=False):
        head = iphone_chrome(s, title, subtitle, trailing)
        builder(s)
    body = "\n".join(s.parts)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}" role="img">\n{head}\n{body}\n</svg>'
    (OUT / name).write_text(svg, encoding="utf-8")
    print(f"  {name}")


def write_screen(name: str, title: str, subtitle: str | None, trailing: str | None, nav: int, builder) -> Path:
    s = Screen(beat_caption="", nav_active=nav)
    with _with_screen_layout(embed=True):
        head = iphone_screen_chrome(s, title, subtitle, trailing)
        builder(s)
    body = "\n".join(s.parts)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{SW}" height="{SH}" '
        f'viewBox="0 0 {SW} {SH}" role="img" aria-label="{xml_esc(title)}">\n{head}\n{body}\n</svg>'
    )
    SCREENS.mkdir(parents=True, exist_ok=True)
    path = SCREENS / name
    path.write_text(svg, encoding="utf-8")
    print(f"  screens/{name}")
    return path


def rasterize(svg_path: Path, png_path: Path, width: int = 1200) -> bool:
    tmp = ROOT / ".cache" / "stryker-hifi-raster"
    tmp.mkdir(parents=True, exist_ok=True)
    for cmd in (
        ["rsvg-convert", "-w", str(width), "-o", str(png_path), str(svg_path)],
        ["magick", "-background", "none", str(svg_path), str(png_path)],
    ):
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            return True
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue
    try:
        subprocess.run(
            ["qlmanage", "-t", "-s", str(width), "-o", str(tmp), str(svg_path)],
            check=True,
            capture_output=True,
        )
        raster = tmp / f"{svg_path.name}.png"
        if raster.is_file():
            shutil.copy2(raster, png_path)
            return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass
    return False


def export_screen_png(svg_path: Path, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        subprocess.run(
            [
                "sips",
                "-s",
                "format",
                "png",
                "-z",
                str(SH),
                str(SW),
                str(svg_path),
                "--out",
                str(dest),
            ],
            check=True,
            capture_output=True,
        )
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        return False


def crop_screen_portrait(svg_path: Path, dest: Path) -> bool:
    screen = SCREENS / svg_path.name.replace(".svg", "-screen.svg")
    if screen.is_file():
        return export_screen_png(screen, dest)
    tmp = ROOT / ".cache" / "stryker-hifi-raster"
    tmp.mkdir(parents=True, exist_ok=True)
    full = tmp / f"{svg_path.stem}-full.png"
    if not rasterize(svg_path, full, 1200):
        return False
    try:
        out = subprocess.run(
            ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(full)],
            check=True,
            capture_output=True,
            text=True,
        )
        fw = fh = 0
        for line in out.stdout.splitlines():
            if "pixelWidth" in line:
                fw = int(line.split()[-1])
            if "pixelHeight" in line:
                fh = int(line.split()[-1])
    except (FileNotFoundError, subprocess.CalledProcessError, ValueError):
        return False
    scale = min(fw / CW, fh / CH)
    pad_x = (fw - CW * scale) / 2
    pad_y = (fh - CH * scale) / 2
    left = int(pad_x + SX * scale)
    top = int(pad_y + SY * scale)
    width = int(SW * scale)
    height = int(SH * scale)
    try:
        subprocess.run(
            [
                "sips",
                "-c",
                str(height),
                str(width),
                "--cropOffset",
                str(top),
                str(left),
                str(full),
                "--out",
                str(dest),
            ],
            check=True,
            capture_output=True,
        )
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Stryker field logistics hi-fi renders")
    parser.add_argument("--png", action="store_true", help="Export screen-crop PNGs for ticker and gallery")
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"Sally hi-fi iPhone renders → {OUT.relative_to(ROOT)}/")
    specs = [
        ("beat-01-arrive.svg", "01 · ARRIVE — Hospital visit", "Hospital visit", "Active visit · robotic spine", "building", 0, build_beat_01),
        ("beat-02-preferences.svg", "02 · PREFERENCES", "Preferences", "Dr. Vasquez · saved kits", "star", 0, build_beat_02),
        ("beat-03-order.svg", "03 · ORDER", "New order", "Dr. Vasquez · CASE-28491", "cart", 1, build_beat_03),
        ("beat-04-order-track.svg", "04 · ORDER TRACK", "Order status", "Placed today · 09:14", "arrow_sync", 1, build_beat_04),
        ("beat-05-part-track.svg", "05 · PART TRACK", "Part tracking", "3 parts · ORD-91827", "box", 2, build_beat_05),
        ("beat-06-deliver.svg", "06 · DELIVER", "Delivery", "Order & OR shelf", "vehicle", 2, build_beat_06),
        ("beat-07-use.svg", "07 · USE", "Surgical use", "CASE-28491 · in progress", "heart_pulse", 2, build_beat_07),
        ("beat-08-return.svg", "08 · RETURN", "Send back", "Unused · policy return", "arrow_sync", 2, build_beat_08),
        ("beat-09-request.svg", "09 · REQUEST", "New part request", "Catalog gap", "add", 3, build_beat_09),
        ("beat-10-close-loop.svg", "10 · CLOSE LOOP", "Visit summary", "Northwest Medical", "check_circle", 0, build_beat_10),
    ]
    for item in specs:
        write(*item)
        svg_name = item[0]
        screen_name = svg_name.replace(".svg", "-screen.svg")
        write_screen(screen_name, item[2], item[3], item[4], item[5], item[6])

    if args.png:
        HERO_TICKER.mkdir(parents=True, exist_ok=True)
        BEATS.mkdir(parents=True, exist_ok=True)
        ticker_files = {
            "beat-01-arrive.svg": "beat-01-arrive.png",
            "beat-02-preferences.svg": "beat-02-preferences.png",
            "beat-04-order-track.svg": "beat-04-order-track.png",
            "beat-07-use.svg": "beat-07-use.png",
        }
        for svg_name, png_name in ticker_files.items():
            svg = OUT / svg_name
            dest = HERO_TICKER / png_name
            if crop_screen_portrait(svg, dest):
                print(f"  hero-ticker → {dest.relative_to(ROOT)}")
            else:
                print(f"  hero-ticker FAILED: {png_name}", file=sys.stderr)

        for svg_name, *_ in specs:
            stem = svg_name.replace(".svg", ".png")
            svg = OUT / svg_name
            dest = BEATS / stem
            if crop_screen_portrait(svg, dest):
                print(f"  beats → {dest.relative_to(ROOT)}")
            else:
                print(f"  beats FAILED: {stem}", file=sys.stderr)

    print("Done: 10 hi-fi SVGs" + (" + screen-crop PNGs" if args.png else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

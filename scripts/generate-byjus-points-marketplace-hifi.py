#!/usr/bin/env python3
"""Sally hi-fi — Byju's FutureSchool Points Marketplace iPhone renders (Fluent UI, K-8)."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "case-studies" / "points-marketplace-foundational" / "hifi-src"
GALLERY = ROOT / "assets" / "case-studies" / "points-marketplace-foundational" / "progression" / "for-card"
TICKER = ROOT / "assets" / "case-studies" / "points-marketplace-foundational" / "hero-ticker"

CW, CH = 1200, 960
FX, FY = 395, 36
BEZEL = 14
SW, SH = 390, 844
SX, SY = FX + BEZEL, FY + BEZEL
FW, FH = SW + BEZEL * 2, SH + BEZEL * 2
M = 16
STATUS, NAV, TITLE_BLOCK, TAB = 54, 44, 88, 83
CONTENT_X, CONTENT_W = SX + M, SW - M * 2
HEADER_BOTTOM = SY + STATUS + NAV + TITLE_BLOCK
TAB_TOP = SY + SH - TAB

# Brand — Sally spec v1
INK = "#171A1F"
LBL = "#6B7280"
BG = "#F6F4FB"
CARD = "#FFFFFF"
SEP = "#E8E0F4"
PURPLE = "#5B3FA8"
PINK = "#F05B83"
GOLD = "#FFD54F"
GREEN = "#22C55E"
ORANGE = "#F59E0B"
BEZEL_C = "#1C1C1E"
FONT = "'Segoe UI Variable', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"

# Fluent-style icons (24 viewBox)
ICONS: dict[str, str] = {
    "home": "M10.55 2.1a1.5 1.5 0 0 1 2.1.35l8 10A1.5 1.5 0 0 1 19.5 15H17v6.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 11 21.5V17H9v4.5A1.5 1.5 0 0 1 7.5 23h-3A1.5 1.5 0 0 1 3 21.5V15H.9a1.5 1.5 0 0 1-1.15-2.45l8-10a1.5 1.5 0 0 1 2.1-.35Z",
    "gift": "M9.5 3.75A2.25 2.25 0 0 1 12 2.25a2.25 2.25 0 0 1 2.5 1.5 2.25 2.25 0 0 1 4.5 6v1.5H3V6A2.25 2.25 0 0 1 9.5 3.75ZM3 9v10.5A2.25 2.25 0 0 0 5.25 21.75h13.5A2.25 2.25 0 0 0 21 19.5V9H3Zm4.5 0v9h3v-9h-3Zm4.5 0v9h3v-9h-3Z",
    "star": "M12 2.6l2.4 5.5 6 .5-4.5 4 1.4 5.9L12 15.8l-5.3 2.7 1.4-5.9-4.5-4 6-.5L12 2.6Z",
    "play": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2.2 6.3a.75.75 0 0 1 1.15-.63l6.5 4a.75.75 0 0 1 0 1.26l-6.5 4a.75.75 0 0 1-1.15-.63V8.3Z",
    "person": "M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM5.5 20.5a6.5 6.5 0 0 1 13 0 .75.75 0 0 1-.75.75h-11.5a.75.75 0 0 1-.75-.75Z",
    "wallet": "M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Zm16.5 4.5h-3a1.5 1.5 0 1 0 0 3h3v-3Z",
    "sparkle": "M9.813 2.658a1.875 1.875 0 0 1 3.374 0l.928 1.88 2.078.302a1.875 1.875 0 0 1 1.04 3.198l-1.504 1.466.355 2.07a1.875 1.875 0 0 1-2.718 1.978L12 11.672l-1.856.976a1.875 1.875 0 0 1-2.718-1.978l.355-2.07L5.937 7.338a1.875 1.875 0 0 1 1.04-3.198l2.078-.302.928-1.88Z",
    "book": "M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72h.75a.75.75 0 0 1 .75.75v11.38a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-7.5h-9.5v7.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75V9.47a.75.75 0 0 1 .75-.75h.75A60.65 60.65 0 0 1 11.1 2.805a.75.75 0 0 1 .6 0ZM6 12.75v5.25h1.5v-5.25H6Zm13.5 0v5.25H21v-5.25h-1.5Z",
    "chevron": "M10.3 4.3a1 1 0 0 1 1.4 0l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4-1.4L16.58 12 10.3 5.7a1 1 0 0 1 0-1.4Z",
    "check": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 13.2-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8Z",
    "trophy": "M16.5 3.75a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v2.25H6a2.25 2.25 0 0 0-2.25 2.25v1.5c0 2.9 2.35 5.25 5.25 5.25h.75a6.75 6.75 0 0 0 6.75 6.75v2.25H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-.75v-2.25a6.75 6.75 0 0 0 6.75-6.75h.75c2.9 0 5.25-2.35 5.25-5.25v-1.5A2.25 2.25 0 0 0 18 6h-1.5V3.75Z",
}


def xml_esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def ic(name: str, x: float, y: float, sz: float = 18, fill: str = LBL, flip: bool = False) -> str:
    d = ICONS.get(name, ICONS["star"])
    s = sz / 24
    sx = -s if flip else s
    return f'<g transform="translate({x},{y}) scale({sx},{s})" fill="{fill}"><path d="{d}"/></g>'


@dataclass
class Screen:
    parts: list[str] = field(default_factory=list)
    y: float = 0.0
    tab_active: int = 1
    caption: str = ""

    def add(self, s: str) -> None:
        self.parts.append(s)

    def gap(self, n: int = 16) -> None:
        self.y += n

    def wallet_card(self, points: str = "240", sub: str = "+12 this week") -> None:
        y0 = self.y
        h = 118
        self.add(
            f'<defs><linearGradient id="walletGrad" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0%" stop-color="#6B4BB8"/><stop offset="100%" stop-color="{PURPLE}"/>'
            f"</linearGradient></defs>"
        )
        self.add(
            f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="{h}" rx="20" fill="url(#walletGrad)"/>'
        )
        self.add(ic("sparkle", CONTENT_X + 14, y0 + 14, 20, GOLD))
        self.add(
            f'<text x="{CONTENT_X + 40}" y="{y0 + 30}" font-family="{FONT}" font-size="13" '
            f'font-weight="600" fill="#E8E0F8">Spendable points</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 72}" font-family="{FONT}" font-size="40" '
            f'font-weight="700" fill="#FFFFFF">{xml_esc(points)}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 92}" font-family="{FONT}" font-size="12" '
            f'fill="#E8E0F8">{xml_esc(sub)}</text>'
        )
        bx = CONTENT_X + CONTENT_W - 108
        self.add(f'<rect x="{bx}" y="{y0 + 36}" width="92" height="44" rx="22" fill="#FFFFFF"/>')
        self.add(
            f'<text x="{bx + 46}" y="{y0 + 64}" text-anchor="middle" font-family="{FONT}" '
            f'font-size="15" font-weight="600" fill="{PURPLE}">Redeem now</text>'
        )
        self.y = y0 + h + 16

    def onboarding_row(self, title: str, sub: str) -> None:
        y0 = self.y
        self.add(
            f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="64" rx="14" fill="{CARD}" '
            f'stroke="{PURPLE}" stroke-width="2"/>'
        )
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="4" height="64" rx="2" fill="{PINK}"/>')
        self.add(ic("book", CONTENT_X + 16, y0 + 18, 22, PURPLE))
        self.add(
            f'<text x="{CONTENT_X + 48}" y="{y0 + 28}" font-family="{FONT}" font-size="15" '
            f'font-weight="600" fill="{INK}">{xml_esc(title)}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 48}" y="{y0 + 48}" font-family="{FONT}" font-size="13" '
            f'fill="{LBL}">{xml_esc(sub)}</text>'
        )
        self.add(ic("chevron", CONTENT_X + CONTENT_W - 28, y0 + 24, 16, PURPLE))
        self.y = y0 + 64 + 16

    def avatar_grid(self) -> None:
        y0 = self.y
        self.add(
            f'<text x="{CONTENT_X}" y="{y0 + 14}" font-family="{FONT}" font-size="13" '
            f'font-weight="600" fill="{LBL}">CHOOSE YOUR HERO</text>'
        )
        avatars = [
            ("Cyborg", "80", "#C9B8E8", False),
            ("Bolt", "120", "#5B3FA8", True),
            ("Taz", "60", "#A8D4F0", False),
            ("Nova", "100", "#F0C9A8", False),
        ]
        cols, rows = 2, 2
        tw, th, gap = 88, 96, 12
        for i, (name, cost, color, selected) in enumerate(avatars):
            col, row = i % cols, i // cols
            ax = CONTENT_X + col * (tw + gap)
            ay = y0 + 24 + row * (th + gap)
            stroke = f' stroke="{PURPLE}" stroke-width="3"' if selected else f' stroke="{SEP}" stroke-width="1"'
            self.add(f'<rect x="{ax}" y="{ay}" width="{tw}" height="{th}" rx="16" fill="{CARD}"{stroke}/>')
            self.add(f'<circle cx="{ax + tw // 2}" cy="{ay + 36}" r="22" fill="{color}"/>')
            if selected:
                self.add(ic("check", ax + tw - 26, ay + 8, 18, PURPLE))
            self.add(
                f'<text x="{ax + tw // 2}" y="{ay + 68}" text-anchor="middle" font-family="{FONT}" '
                f'font-size="13" font-weight="600" fill="{INK}">{xml_esc(name)}</text>'
            )
            self.add(
                f'<text x="{ax + tw // 2}" y="{ay + 86}" text-anchor="middle" font-family="{FONT}" '
                f'font-size="11" fill="{PURPLE}">{cost} pts</text>'
            )
        self.y = y0 + 24 + 2 * (th + gap) + 8

    def stat_card(self, label: str, value: str, trend: str, trend_color: str) -> None:
        y0 = self.y
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="72" rx="14" fill="{CARD}"/>')
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 28}" font-family="{FONT}" font-size="15" '
            f'fill="{INK}">{xml_esc(label)}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 54}" font-family="{FONT}" font-size="13" '
            f'fill="{trend_color}">{xml_esc(trend)}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + CONTENT_W - 16}" y="{y0 + 48}" text-anchor="end" '
            f'font-family="{FONT}" font-size="28" font-weight="700" fill="{INK}">{xml_esc(value)}</text>'
        )
        self.y = y0 + 72 + 12

    def quote_bubble(self, quote: str) -> None:
        y0 = self.y
        h = 72
        self.add(
            f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="{h}" rx="14" fill="#FFF9E0"/>'
        )
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="4" height="{h}" rx="2" fill="{GOLD}"/>')
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 28}" font-family="{FONT}" font-size="14" '
            f'font-style="italic" fill="{INK}">"{xml_esc(quote)}"</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 16}" y="{y0 + 50}" font-family="{FONT}" font-size="11" '
            f'fill="{LBL}">Grade 6 · moderated IDI</text>'
        )
        self.y = y0 + h + 16

    def step_row(self, n: int, title: str, sub: str, done: bool = False) -> None:
        y0 = self.y
        self.add(f'<rect x="{CONTENT_X}" y="{y0}" width="{CONTENT_W}" height="56" rx="12" fill="{CARD}"/>')
        col = GREEN if done else PURPLE
        self.add(f'<circle cx="{CONTENT_X + 28}" cy="{y0 + 28}" r="14" fill="{col}20"/>')
        self.add(
            f'<text x="{CONTENT_X + 28}" y="{y0 + 33}" text-anchor="middle" font-family="{FONT}" '
            f'font-size="13" font-weight="700" fill="{col}">{n}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 52}" y="{y0 + 26}" font-family="{FONT}" font-size="15" '
            f'font-weight="600" fill="{INK}">{xml_esc(title)}</text>'
        )
        self.add(
            f'<text x="{CONTENT_X + 52}" y="{y0 + 44}" font-family="{FONT}" font-size="13" '
            f'fill="{LBL}">{xml_esc(sub)}</text>'
        )
        self.y = y0 + 56 + 10

    def primary_btn(self, label: str, color: str = PINK) -> None:
        by = TAB_TOP - 58
        self.add(
            f'<rect x="{CONTENT_X}" y="{by}" width="{CONTENT_W}" height="52" rx="16" fill="{color}" '
            f'filter="url(#btnShadow)"/>'
        )
        self.add(
            f'<text x="{SX + SW // 2}" y="{by + 32}" text-anchor="middle" font-family="{FONT}" '
            f'font-size="17" font-weight="600" fill="#FFFFFF">{xml_esc(label)}</text>'
        )


def studio_bg(title: str, subtitle: str) -> str:
    return f"""<defs>
  <filter id="btnShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="{PINK}" flood-opacity="0.35"/>
  </filter>
  <filter id="devShadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="28" stdDeviation="24" flood-color="{PURPLE}" flood-opacity="0.22"/>
  </filter>
  <radialGradient id="studio" cx="50%" cy="30%" r="70%">
    <stop offset="0%" stop-color="#F0EDF6"/><stop offset="100%" stop-color="#F6F5F2"/>
  </radialGradient>
</defs>
<rect width="{CW}" height="{CH}" fill="url(#studio)"/>
<text x="80" y="76" font-family="{FONT}" font-size="11" font-weight="600" fill="{PURPLE}" letter-spacing="0.12em">BYJU&apos;S FUTURESCHOOL · K-8</text>
<text x="80" y="108" font-family="{FONT}" font-size="28" font-weight="700" fill="{INK}">{xml_esc(title)}</text>
<text x="80" y="136" font-family="{FONT}" font-size="15" fill="{LBL}">{xml_esc(subtitle)}</text>"""


def iphone_chrome(s: Screen, large_title: str, subtitle: str | None = None) -> str:
    o = [studio_bg("Points Marketplace", "Sally hi-fi · Fluent UI · iPhone 15")]
    o.append(f'<rect x="{FX}" y="{FY}" width="{FW}" height="{FH}" rx="54" fill="{BEZEL_C}" filter="url(#devShadow)"/>')
    o.append(f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="44" fill="{BG}"/>')
    o.append(f'<rect x="{SX + SW // 2 - 63}" y="{SY + 10}" width="126" height="37" rx="19" fill="#000"/>')
    o.append(
        f'<text x="{SX + 28}" y="{SY + 38}" font-family="{FONT}" font-size="15" font-weight="600" fill="{INK}">9:41</text>'
    )
    ny = SY + STATUS
    o.append(f'<rect x="{SX}" y="{ny}" width="{SW}" height="{NAV}" fill="{BG}"/>')
    o.append(
        f'<text x="{SX + SW // 2}" y="{ny + 28}" text-anchor="middle" font-family="{FONT}" '
        f'font-size="17" font-weight="700" fill="{PURPLE}">Rewards</text>'
    )
    ty = ny + NAV + 8
    o.append(
        f'<text x="{CONTENT_X}" y="{ty + 32}" font-family="{FONT}" font-size="34" font-weight="700" fill="{INK}">'
        f'{xml_esc(large_title)}</text>'
    )
    if subtitle:
        o.append(
            f'<text x="{CONTENT_X}" y="{ty + 56}" font-family="{FONT}" font-size="15" fill="{LBL}">'
            f'{xml_esc(subtitle)}</text>'
        )
    tb = TAB_TOP
    o.append(f'<rect x="{SX}" y="{tb}" width="{SW}" height="{TAB}" fill="rgba(255,255,255,0.96)"/>')
    o.append(f'<line x1="{SX}" y1="{tb}" x2="{SX + SW}" y2="{tb}" stroke="{SEP}"/>')
    tabs = [("home", "Home"), ("gift", "Rewards"), ("play", "Play"), ("person", "You")]
    for i, (icn, lb) in enumerate(tabs):
        cx = SX + 48 + i * 98
        col = PURPLE if i == s.tab_active else LBL
        fw = "600" if i == s.tab_active else "400"
        o.append(ic(icn, cx - 9, tb + 10, 22, col))
        o.append(
            f'<text x="{cx}" y="{tb + 48}" text-anchor="middle" font-family="{FONT}" font-size="10" '
            f'font-weight="{fw}" fill="{col}">{lb}</text>'
        )
    o.append(
        f'<rect x="{SX + SW // 2 - 67}" y="{SY + SH - 14}" width="134" height="5" rx="3" fill="#000" opacity="0.35"/>'
    )
    o.append(
        f'<text x="{SX + SW // 2}" y="{FY + FH + 36}" text-anchor="middle" font-family="{FONT}" '
        f'font-size="13" fill="{LBL}" letter-spacing="0.04em">{xml_esc(s.caption)}</text>'
    )
    s.y = HEADER_BOTTOM
    return "\n".join(o)


def build_objective(s: Screen) -> None:
    s.wallet_card()
    s.onboarding_row("How to earn & spend", "Quick guide before you shop")
    s.avatar_grid()
    s.gap(8)
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="{CONTENT_W}" height="48" rx="12" fill="{CARD}" stroke="{SEP}"/>'
    )
    s.add(
        f'<text x="{CONTENT_X + 16}" y="{s.y + 30}" font-family="{FONT}" font-size="13" fill="{LBL}">'
        f"Spent history · last 7 days</text>"
    )
    s.y += 56


def build_problem(s: Screen) -> None:
    s.tab_active = 0
    s.stat_card("Time on platform", "↓ 18%", "vs. last month · class 8+", ORANGE)
    s.stat_card("Unused points", "1,240", "piled up · no redeem path", ORANGE)
    s.stat_card("Class attendance", "↓ 12%", "needs a clearer earn loop", ORANGE)
    s.gap(8)
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="{CONTENT_W}" height="56" rx="14" fill="#FEF2F2" stroke="#FECACA"/>'
    )
    s.add(
        f'<text x="{CONTENT_X + 16}" y="{s.y + 34}" font-family="{FONT}" font-size="14" '
        f'font-weight="600" fill="#B91C1C">Loyalty not visible in the journey</text>'
    )


def build_role(s: Screen) -> None:
    s.add(
        f'<text x="{CONTENT_X}" y="{s.y + 12}" font-family="{FONT}" font-size="11" font-weight="600" '
        f'fill="{LBL}" letter-spacing="0.06em">DESIGN SYSTEM · STIMULUS</text>'
    )
    s.y += 24
    s.wallet_card("240", "Figma component set")
    s.gap(4)
    s.avatar_grid()
    s.gap(8)
    s.add(
        f'<rect x="{CONTENT_X}" y="{s.y}" width="{CONTENT_W}" height="52" rx="14" fill="{PURPLE}10" stroke="{PURPLE}"/>'
    )
    s.add(ic("check", CONTENT_X + 14, s.y + 16, 20, GREEN))
    s.add(
        f'<text x="{CONTENT_X + 42}" y="{s.y + 34}" font-family="{FONT}" font-size="14" '
        f'font-weight="600" fill="{PURPLE}">Shippable in 15 IDIs</text>'
    )
    s.y += 60


def build_insights(s: Screen) -> None:
    s.wallet_card("240", "Same surface as testing")
    s.quote_bubble("I think 1 coin = 2 points because coins feel more precious")
    s.avatar_grid()


def build_recommendations(s: Screen) -> None:
    s.step_row(1, "Earn points", "Class + practice streaks", done=True)
    s.step_row(2, "Understand balance", "One spendable number", done=True)
    s.step_row(3, "Browse & redeem", "Avatars after onboarding", done=False)
    s.primary_btn("Start earn & spend guide")


def write_svg(name: str, caption: str, title: str, subtitle: str | None, tab: int, builder) -> Path:
    s = Screen(caption=caption, tab_active=tab)
    head = iphone_chrome(s, title, subtitle)
    builder(s)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" '
        f'viewBox="0 0 {CW} {CH}" role="img" aria-label="{xml_esc(caption)}">\n'
        f"{head}\n{chr(10).join(s.parts)}\n</svg>"
    )
    path = SRC / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg, encoding="utf-8")
    return path


def export_png(svg_path: Path, png_path: Path, width: int = 1200) -> bool:
    for cmd in (
        ["rsvg-convert", "-w", str(width), "-o", str(png_path), str(svg_path)],
        ["magick", "-background", "none", str(svg_path), str(png_path)],
    ):
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            return True
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue
    return False


def export_ticker_portraits(stems: list[str]) -> None:
    """Portrait iPhone crops for hero ticker (390×844)."""
    TICKER.mkdir(parents=True, exist_ok=True)
    left, top, width, height = SX, SY, SW, SH
    tmp = ROOT / ".cache" / "byju-ticker-raster"
    tmp.mkdir(parents=True, exist_ok=True)
    for stem in stems:
        svg = SRC / f"{stem}.svg"
        if not svg.is_file():
            print(f"  skip ticker (missing): {stem}.svg")
            continue
        full = tmp / f"{stem}-full.png"
        try:
            subprocess.run(
                ["qlmanage", "-t", "-s", "1200", "-o", str(tmp), str(svg)],
                check=True,
                capture_output=True,
            )
        except subprocess.CalledProcessError as exc:
            print(f"  ticker raster failed: {stem} ({exc})")
            continue
        raster = tmp / f"{stem}.svg.png"
        if not raster.is_file():
            print(f"  ticker raster missing: {raster.name}")
            continue
        dest = TICKER / f"ticker-{stem}.png"
        subprocess.run(
            [
                "sips",
                "-c",
                str(height),
                str(width),
                "--cropOffset",
                str(top),
                str(left),
                str(raster),
                "--out",
                str(dest),
            ],
            check=True,
            capture_output=True,
        )
        print(f"  ticker → {dest.relative_to(ROOT)}")


def sync_gallery(stem: str, ext: str) -> None:
    GALLERY.mkdir(parents=True, exist_ok=True)
    src = SRC / f"{stem}.{ext}"
    dest = GALLERY / f"{stem}.{ext}"
    if src.is_file():
        shutil.copy2(src, dest)
        print(f"  gallery ← {dest.relative_to(ROOT)}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--png", action="store_true", help="Export PNG when rsvg/magick available")
    args = parser.parse_args()

    specs = [
        ("beat-objective", "01 · OBJECTIVE — Rewards home", "My rewards", "Earn & spend in one place", 1, build_objective),
        ("beat-problem", "02 · PROBLEM — Progress gap", "Your progress", "Points pile up when the path is unclear", 0, build_problem),
        ("beat-role", "03 · METHOD — Design system", "Stimulus kit", "Wallet · avatars · redeem", 1, build_role),
        ("beat-insights", "04 · TESTING — IDI stimulus", "Try it out", "Quotes mapped to this screen", 1, build_insights),
        ("beat-recommendations", "05 · SHIP — Onboarding", "Earn & spend", "Before marketplace browse", 1, build_recommendations),
    ]

    print(f"Sally BYJU's hi-fi → {SRC.relative_to(ROOT)}/")
    for stem, caption, title, subtitle, tab, builder in specs:
        svg_path = write_svg(f"{stem}.svg", caption, title, subtitle, tab, builder)
        print(f"  {svg_path.name}")
        sync_gallery(stem, "svg")
        if args.png:
            png_path = SRC / f"{stem}.png"
            if export_png(svg_path, png_path):
                sync_gallery(stem, "png")
                print(f"    png → {png_path.name}")

    export_ticker_portraits([stem for stem, *_ in specs])
    print("Done: 5 hi-fi screens (gallery + hero ticker portraits)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

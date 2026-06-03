#!/usr/bin/env python3
"""Stryker field-logistics wireframes — Fluent UI + layout grid (margins/gutters)."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "case-studies" / "stryker-field-logistics" / "wireframes-src"

W, H = 1200, 960
PX, PY, PW, PH = 405, 88, 390, 784
RX_PHONE = 40

# Layout tokens (8px grid)
M = 20          # screen horizontal margin
PAD = 16        # card inner padding
G8, G12, G16, G20, G24 = 8, 12, 16, 20, 24
NAV_H = 64
CTA_H = 48
CTA_BOTTOM_PAD = 20

CX = PX + M
CW = PW - 2 * M

Y = "#FFCD00"
BLK = "#1A1A1A"
WHT = "#FFFFFF"
N_BG1, N_BG2, N_BG3 = "#FFFFFF", "#FAFAFA", "#F5F5F5"
N_STROKE1, N_STROKE2 = "#D1D1D1", "#E0E0E0"
N_FG1, N_FG2, N_FG3 = "#242424", "#424242", "#616161"
BRAND, BRAND_BG = "#0078D4", "#EBF3FC"
GRN, GRN_BG = "#107C10", "#DFF6DD"
ORG, ORG_BG = "#CA5010", "#FFF4CE"
RED, RED_BG = "#C50F1F", "#FDE7E9"

FONT = "Segoe UI, system-ui, -apple-system, sans-serif"
R_SM, R_MD, R_LG = 4, 8, 12
ICON_CELL = 40

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
    "clipboard": "M9 3.5A1.5 1.5 0 0 0 7.5 2h9A1.5 1.5 0 0 0 15 3.5V4h2.5A1.5 1.5 0 0 1 19 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5v-15A1.5 1.5 0 0 1 6.5 4H9V3.5ZM8 6.5v13h8v-13H8Zm2-3h4v1H10v-1Z",
    "star": "M12 2.6l2.4 5.5 6 .5-4.5 4 1.4 5.9L12 15.8l-5.3 2.7 1.4-5.9-4.5-4 6-.5L12 2.6Z",
    "shield": "M12 2l7 3v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5l7-3Z",
    "arrow_sync": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 4.07V3.5a.5.5 0 0 1 .85-.35l2.15 2.15a.5.5 0 0 1-.35.85H13.5a8 8 0 1 1-7.78 10.07.75.75 0 1 1 .28-1.48A6.5 6.5 0 1 0 13 6.07Z",
    "mail": "M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-13ZM6.5 5A.5.5 0 0 0 6 5.5v.22l6 4.2 6-4.2V5.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5Zm12.38 2.38-5.88 4.12a1 1 0 0 1-1.15 0L5.62 7.38A.5.5 0 0 0 5 8v10.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.62-.12Z",
    "more": "M5.75 12a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.75 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Zm8.75 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z",
    "warning": "M12 2.5a1 1 0 0 1 .9.55l9 18A1 1 0 0 1 21 22.5H3a1 1 0 0 1-.9-1.45l9-18a1 1 0 0 1 .9-.55Zm0 5.75a.75.75 0 0 0-.75.75v6.5a.75.75 0 0 0 1.5 0v-6.5a.75.75 0 0 0-.75-.75Zm0 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    "heart_pulse": "M12 4.5c-1.5-2.5-5-2-5.5 1.5C5.5 11 12 18 12 18s6.5-7 5.5-12c-.5-3.5-4-4-5.5-1.5Z",
    "print": "M7 4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V7h2.5A2.5 2.5 0 0 1 22 9.5V16a2.5 2.5 0 0 1-2.5 2.5H19v3.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V18.5H4.5A2.5 2.5 0 0 1 2 16V9.5A2.5 2.5 0 0 1 4.5 7H7V4.5ZM9 7h6V5H9v2Zm-2 11h10v-3H7v3Z",
}


def icon(name: str, x: float, y: float, size: float = 20, fill: str = N_FG2, flip_x: bool = False) -> str:
    d = ICONS.get(name, ICONS["check"])
    s = size / 24
    sx = -s if flip_x else s
    ox = 24 if flip_x else 0
    return f'  <g transform="translate({x},{y}) scale({sx},{s})" fill="{fill}"><path d="{d}"/></g>'


def defs_block() -> str:
    return f"""  <defs>
    <filter id="shadow2"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/></filter>
    <filter id="shadow4"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/></filter>
    <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{BLK}"/><stop offset="100%" stop-color="#2d2d2d"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF9E0"/><stop offset="100%" stop-color="#FFFDF5"/>
    </linearGradient>
  </defs>"""


@dataclass
class Screen:
    parts: list[str] = field(default_factory=list)
    y: float = 0.0
    nav_active: int = 0

    @property
    def cta_y(self) -> float:
        return PY + PH - NAV_H - CTA_BOTTOM_PAD - CTA_H

    @property
    def content_top(self) -> float:
        return PY + 128

    def add(self, s: str) -> None:
        self.parts.append(s)

    def gap(self, n: int = G16) -> None:
        self.y += n

    def subtitle(self, text: str) -> None:
        self.add(
            f'  <text x="{CX}" y="{self.y + 14}" font-family="{FONT}" font-size="13" fill="{N_FG3}">{text}</text>'
        )
        self.y += 28

    def section_label(self, text: str) -> None:
        self.add(
            f'  <text x="{CX}" y="{self.y + 12}" font-family="{FONT}" font-size="12" font-weight="600" fill="{N_FG1}">{text}</text>'
        )
        self.y += 24

    def divider(self) -> None:
        self.add(
            f'  <line x1="{CX}" y1="{self.y}" x2="{CX + CW}" y2="{self.y}" stroke="{N_STROKE2}" stroke-width="1"/>'
        )
        self.y += G16

    def card_box(self, height: int, fill: str = N_BG1, stroke: str = N_STROKE1, accent: bool = False) -> tuple[float, float]:
        y0 = self.y
        if accent:
            stroke = Y
            fill = "url(#accentGrad)"
        self.add(
            f'  <rect x="{CX}" y="{y0}" width="{CW}" height="{height}" rx="{R_LG}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="1" filter="url(#shadow2)"/>'
        )
        return y0, y0 + height

    def end_card(self, height: int, gap: int = G12) -> None:
        self.y += height + gap

    def badge(self, x: float, y: float, text: str, bg: str, fg: str = N_FG1) -> None:
        w = len(text) * 6.5 + 28
        self.add(
            f'  <rect x="{x}" y="{y}" width="{w}" height="24" rx="12" fill="{bg}"/>'
            f'\n  <text x="{x + 12}" y="{y + 16}" font-family="{FONT}" font-size="11" font-weight="600" fill="{fg}">{text}</text>'
        )

    def icon_cell(self, x: float, y: float, name: str, bg: str, fg: str) -> None:
        self.add(f'  <rect x="{x}" y="{y}" width="{ICON_CELL}" height="{ICON_CELL}" rx="{R_MD}" fill="{bg}"/>')
        self.add(icon(name, x + 10, y + 10, 20, fg))

    def list_row(self, label: str, value: str, icon_name: str, icon_bg: str, icon_fg: str) -> None:
        row_h = 56
        y0 = self.y
        cy = y0 + (row_h - ICON_CELL) / 2
        self.icon_cell(CX, cy, icon_name, icon_bg, icon_fg)
        self.add(
            f'  <text x="{CX + ICON_CELL + G12}" y="{y0 + 20}" font-family="{FONT}" font-size="10" '
            f'font-weight="600" fill="{N_FG3}" letter-spacing="0.05em">{label.upper()}</text>'
        )
        self.add(
            f'  <text x="{CX + ICON_CELL + G12}" y="{y0 + 40}" font-family="{FONT}" font-size="14" '
            f'font-weight="600" fill="{N_FG1}">{value}</text>'
        )
        self.y += row_h
        self.add(
            f'  <line x1="{CX}" y1="{self.y}" x2="{CX + CW}" y2="{self.y}" stroke="{N_STROKE2}" stroke-width="1"/>'
        )
        self.y += 1

    def checkbox(self, label: str, checked: bool = True) -> None:
        y0 = self.y
        if checked:
            self.add(f'  <rect x="{CX}" y="{y0}" width="22" height="22" rx="{R_SM}" fill="{BRAND}"/>')
            self.add(icon("check", CX + 3, y0 + 3, 16, WHT))
        else:
            self.add(
                f'  <rect x="{CX}" y="{y0}" width="22" height="22" rx="{R_SM}" fill="{N_BG1}" stroke="{N_STROKE1}"/>'
            )
        self.add(
            f'  <text x="{CX + 30}" y="{y0 + 16}" font-family="{FONT}" font-size="13" fill="{N_FG1}">{label}</text>'
        )
        self.y += 34

    def timeline(self, label: str, state: str) -> None:
        colors = {"done": (GRN, GRN_BG), "active": (ORG, ORG_BG), "pending": (N_FG3, N_BG3)}
        dot, bg = colors.get(state, colors["pending"])
        ic = "check_circle" if state == "done" else "clock"
        y0 = self.y
        self.add(f'  <rect x="{CX}" y="{y0 + 2}" width="32" height="32" rx="16" fill="{bg}"/>')
        self.add(icon(ic, CX + 6, y0 + 8, 20, dot))
        if state != "pending":
            self.add(
                f'  <line x1="{CX + 16}" y1="{y0 + 36}" x2="{CX + 16}" y2="{y0 + 44}" stroke="{N_STROKE2}" stroke-width="1"/>'
            )
        fw = ' font-weight="600"' if state == "active" else ""
        col = N_FG1 if state != "pending" else N_FG3
        self.add(
            f'  <text x="{CX + 44}" y="{y0 + 22}" font-family="{FONT}" font-size="13" fill="{col}"{fw}>{label}</text>'
        )
        self.y += 44

    def cta(self, label: str, icon_name: str = "arrow_right") -> None:
        cy = self.cta_y
        self.add(
            f'  <rect x="{CX}" y="{cy}" width="{CW}" height="{CTA_H}" rx="{R_LG}" fill="{Y}" '
            f'stroke="{BLK}" stroke-width="1.5" filter="url(#shadow2)"/>'
        )
        self.add(
            f'  <text x="{CX + CW // 2 - 10}" y="{cy + 30}" text-anchor="middle" font-family="{FONT}" '
            f'font-size="14" font-weight="600" fill="{BLK}">{label}</text>'
        )
        self.add(icon(icon_name, CX + CW - 40, cy + 14, 20, BLK))

    def bottom_nav(self) -> None:
        ny = PY + PH - NAV_H
        self.add(
            f'  <rect x="{PX}" y="{ny}" width="{PW}" height="{NAV_H}" fill="{N_BG1}" stroke="{N_STROKE2}"/>'
        )
        items = [("home", "Home"), ("cart", "Orders"), ("box", "Parts"), ("more", "More")]
        for i, (ic, lb) in enumerate(items):
            cx = PX + 52 + i * 86
            col = BRAND if i == self.nav_active else N_FG3
            if i == self.nav_active:
                self.add(
                    f'  <rect x="{cx - 24}" y="{ny + 8}" width="48" height="40" rx="{R_MD}" fill="{BRAND_BG}"/>'
                )
            self.add(icon(ic, cx - 10, ny + 14, 20, col))
            self.add(
                f'  <text x="{cx}" y="{ny + 48}" text-anchor="middle" font-family="{FONT}" font-size="10" '
                f'font-weight="{"600" if i == self.nav_active else "400"}" fill="{col}">{lb}</text>'
            )


def phone_frame(beat: str, title: str, header_icon: str) -> str:
    app_h = 48
    return f"""{defs_block()}
  <rect width="{W}" height="{H}" fill="{Y}"/>
  <circle cx="160" cy="180" r="100" fill="{WHT}" opacity="0.1"/>
  <text x="600" y="46" text-anchor="middle" font-family="{FONT}" font-size="11" font-weight="600" fill="{BLK}" letter-spacing="0.1em">STRYKER · FIELD LOGISTICS</text>
  <text x="600" y="74" text-anchor="middle" font-family="{FONT}" font-size="20" font-weight="600" fill="{BLK}">{beat}</text>
  <rect x="{PX}" y="{PY}" width="{PW}" height="{PH}" rx="{RX_PHONE}" fill="{N_BG1}" stroke="{N_STROKE1}" filter="url(#shadow4)"/>
  <rect x="{PX + PW//2 - 40}" y="{PY + 8}" width="80" height="24" rx="12" fill="{N_BG3}"/>
  <text x="{PX + PW//2}" y="{PY + 24}" text-anchor="middle" font-family="{FONT}" font-size="11" fill="{N_FG3}">9:41</text>
  <rect x="{PX}" y="{PY + 36}" width="{PW}" height="{app_h}" fill="{N_BG2}" stroke="{N_STROKE2}"/>
  {icon("arrow_right", PX + M, PY + 48, 18, N_FG2, flip_x=True)}
  <text x="{PX + M + 26}" y="{PY + 62}" font-family="{FONT}" font-size="12" font-weight="600" fill="{N_FG2}">STRYKER</text>
  {icon(header_icon, PX + PW - M - 22, PY + 46, 22, BRAND)}
  <line x1="{PX}" y1="{PY + 36 + app_h}" x2="{PX + PW}" y2="{PY + 36 + app_h}" stroke="{N_STROKE2}"/>
  <text x="{CX}" y="{PY + 108}" font-family="{FONT}" font-size="22" font-weight="600" fill="{N_FG1}">{title}</text>"""


def beat_01(s: Screen) -> str:
    s.subtitle("Active visit · robotic spine case")
    y0, _ = s.card_box(108, fill="url(#heroGrad)", stroke=BLK)
    iy = y0 + PAD
    s.add(icon("building", CX + PAD, iy, 26, Y))
    s.badge(CX + PAD + 36, iy, "ACTIVE VISIT", Y, BLK)
    s.add(
        f'  <text x="{CX + PAD}" y="{iy + 52}" font-family="{FONT}" font-size="17" font-weight="600" fill="{WHT}">Northwest Medical Center</text>'
    )
    s.add(icon("location", CX + PAD, iy + 58, 14, "#B0B0B0"))
    s.add(
        f'  <text x="{CX + PAD + 20}" y="{iy + 70}" font-family="{FONT}" font-size="12" fill="#C8C8C8">OR 4 · Robotic spine</text>'
    )
    s.end_card(108)
    s.list_row("Surgeon", "Dr. Elena Vasquez", "heart_pulse", RED_BG, RED)
    s.list_row("Rep", "Jordan Lee · Territory West", "person", BRAND_BG, BRAND)
    s.list_row("Case ID", "CASE-28491", "clipboard", N_BG3, N_FG2)
    s.gap(G12)
    y0, _ = s.card_box(76, accent=True)
    s.add(icon("star", CX + PAD, y0 + PAD, 22, ORG))
    s.add(
        f'  <text x="{CX + PAD + 32}" y="{y0 + PAD + 18}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Review preferences before ordering</text>'
    )
    s.add(
        f'  <text x="{CX + PAD + 32}" y="{y0 + PAD + 36}" font-family="{FONT}" font-size="11" fill="{N_FG3}">≈2 min · no open returns</text>'
    )
    s.end_card(76)
    s.cta("Start visit", "arrow_right")
    return "\n".join(s.parts)


def beat_02(s: Screen) -> str:
    s.subtitle("Dr. Vasquez · saved kits")
    y0, y1 = s.card_box(112)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy, "box", BRAND_BG, BRAND)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 18}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">Primary tray preference</text>')
    s.add(f'  <text x="{tx}" y="{iy + 36}" font-family="{FONT}" font-size="12" fill="{N_FG3}">Mako · Spine set A · Size M</text>')
    s.add(f'  <text x="{tx}" y="{iy + 52}" font-family="{FONT}" font-size="11" fill="{N_FG3}">Last used · 12d · CASE-27802</text>')
    s.badge(tx, iy + 60, "Preferred", GRN_BG, GRN)
    s.end_card(112)
    y0, _ = s.card_box(96)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy, "shield", ORG_BG, ORG)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 20}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">Backup &amp; exceptions</text>')
    s.add(f'  <text x="{tx}" y="{iy + 40}" font-family="{FONT}" font-size="12" fill="{N_FG3}">Alternate Set B · titanium screws</text>')
    s.end_card(96)
    s.gap(G8)
    s.checkbox("Apply preferences to this order", True)
    s.cta("Continue to order", "cart")
    return "\n".join(s.parts)


def beat_03(s: Screen) -> str:
    s.nav_active = 1
    s.subtitle("Dr. Vasquez · CASE-28491")
    for title, sub, ic, ic_bg, ic_fg in [
        ("Spine set A · Qty 1", "From preferences", "star", "#FFF8E1", ORG),
        ("Titanium screw kit · Qty 2", "SKU TRQ-4420", "box", BRAND_BG, BRAND),
    ]:
        y0, _ = s.card_box(72)
        iy = y0 + PAD
        s.icon_cell(CX + PAD, iy + 4, ic, ic_bg, ic_fg)
        tx = CX + PAD + ICON_CELL + G12
        if sub:
            s.add(f'  <text x="{tx}" y="{iy + 14}" font-family="{FONT}" font-size="11" fill="{N_FG3}">{sub}</text>')
        s.add(f'  <text x="{tx}" y="{iy + 34}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">{title}</text>')
        s.end_card(72, G12)
    s.add(
        f'  <rect x="{CX}" y="{s.y}" width="148" height="36" rx="{R_MD}" fill="{BRAND_BG}" stroke="{BRAND}" stroke-width="1"/>'
    )
    s.add(icon("add", CX + 10, s.y + 8, 20, BRAND))
    s.add(
        f'  <text x="{CX + 36}" y="{s.y + 23}" font-family="{FONT}" font-size="12" font-weight="600" fill="{BRAND}">Add line item</text>'
    )
    s.y += 36 + G16
    s.divider()
    s.section_label("Surgeon sign-off")
    s.checkbox("Confirmed verbally in OR briefing", True)
    s.cta("Submit order", "check")
    return "\n".join(s.parts)


def beat_04(s: Screen) -> str:
    s.nav_active = 1
    s.subtitle("Placed today · 09:14 · Dr. Vasquez")
    s.badge(CX, s.y, "ORD-91827", N_BG3, N_FG1)
    s.badge(CX + 118, s.y, "In fulfillment", ORG_BG, ORG)
    s.y += 32
    for label, state in [
        ("Submitted", "done"),
        ("Confirmed by ops", "done"),
        ("Picking · ETA 2h", "active"),
        ("Shipped to hospital", "pending"),
        ("Received at site", "pending"),
    ]:
        s.timeline(label, state)
    s.gap(G8)
    y0, _ = s.card_box(64)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy, "person", BRAND_BG, BRAND)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 14}" font-family="{FONT}" font-size="10" fill="{N_FG3}">OWNER</text>')
    s.add(f'  <text x="{tx}" y="{iy + 34}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Central supply · Lisa M.</text>')
    s.end_card(64)
    s.cta("View parts", "box")
    return "\n".join(s.parts)


def beat_05(s: Screen) -> str:
    s.nav_active = 2
    s.subtitle("Order ORD-91827 · 3 parts")
    for sn, title, status, bg, fg in [
        ("SN TRQ-4420-88A", "Titanium screw kit", "At hospital", GRN_BG, GRN),
        ("SN SPNE-A12-001", "Spine set A", "In transit", ORG_BG, ORG),
        ("SN SPNE-B12-002", "Spine set B (backup)", "Allocated", BRAND_BG, BRAND),
    ]:
        y0, _ = s.card_box(96)
        iy = y0 + PAD
        s.icon_cell(CX + PAD, iy, "box", bg, fg)
        tx = CX + PAD + ICON_CELL + G12
        s.add(f'  <text x="{tx}" y="{iy + 14}" font-family="{FONT}" font-size="10" fill="{N_FG3}">{sn}</text>')
        s.add(f'  <text x="{tx}" y="{iy + 34}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">{title}</text>')
        s.badge(tx, iy + 44, status, bg, fg)
        s.end_card(96, G12)
    s.cta("Open part detail", "arrow_right")
    return "\n".join(s.parts)


def beat_06(s: Screen) -> str:
    s.nav_active = 2
    s.section_label("Order delivery")
    s.badge(CX, s.y, "Shipped", GRN_BG, GRN)
    s.y += 32
    iy = s.y
    s.icon_cell(CX, iy, "vehicle", BRAND_BG, BRAND)
    s.add(f'  <text x="{CX + ICON_CELL + G12}" y="{iy + 16}" font-family="{FONT}" font-size="12" fill="{N_FG3}">Bay Area Med Logistics</text>')
    s.add(
        f'  <text x="{CX + ICON_CELL + G12}" y="{iy + 36}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Today · 14:30–15:00</text>'
    )
    s.y += ICON_CELL + G16
    s.divider()
    s.section_label("Part delivery · OR shelf")
    s.badge(CX, s.y, "2 of 3 received", ORG_BG, ORG)
    s.y += 32
    y0, _ = s.card_box(108)
    iy = y0 + PAD
    s.add(icon("check_circle", CX + PAD, iy, 20, GRN))
    s.add(f'  <text x="{CX + PAD + 28}" y="{iy + 16}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Spine set A</text>')
    s.add(f'  <text x="{CX + PAD + 28}" y="{iy + 34}" font-family="{FONT}" font-size="12" fill="{GRN}">Received · OR 4 · 13:02</text>')
    s.add(icon("clock", CX + PAD, iy + 48, 20, ORG))
    s.add(f'  <text x="{CX + PAD + 28}" y="{iy + 64}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Titanium screw kit</text>')
    s.add(f'  <text x="{CX + PAD + 28}" y="{iy + 82}" font-family="{FONT}" font-size="12" fill="{ORG}">In transit</text>')
    s.end_card(108)
    s.cta("Confirm receipt", "check")
    return "\n".join(s.parts)


def beat_07(s: Screen) -> str:
    s.nav_active = 2
    s.subtitle("CASE-28491 · procedure in progress")
    y0, _ = s.card_box(120)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy, "box", BRAND_BG, BRAND)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 18}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">Spine set A · SN SPNE-A12-001</text>')
    s.add(f'  <rect x="{tx}" y="{iy + 28}" width="22" height="22" rx="{R_SM}" fill="{BRAND}"/>')
    s.add(icon("check", tx + 3, iy + 31, 16, WHT))
    s.add(f'  <text x="{tx + 30}" y="{iy + 44}" font-family="{FONT}" font-size="12" fill="{N_FG1}">Used in procedure</text>')
    s.add(icon("clock", tx, iy + 54, 16, N_FG3))
    s.add(f'  <text x="{tx + 22}" y="{iy + 66}" font-family="{FONT}" font-size="11" fill="{N_FG3}">11:42 · OR 4</text>')
    s.end_card(120, G12)
    y0, _ = s.card_box(88)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy + 4, "box", N_BG3, N_FG2)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 20}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">Titanium screw kit</text>')
    s.add(f'  <text x="{tx}" y="{iy + 38}" font-family="{FONT}" font-size="12" fill="{N_FG3}">Qty used · 1 of 2</text>')
    s.add(icon("arrow_sync", tx, iy + 48, 16, RED))
    s.add(f'  <text x="{tx + 22}" y="{iy + 60}" font-family="{FONT}" font-size="12" fill="{RED}">Mark 1 unit for return</text>')
    s.end_card(88)
    s.gap(G8)
    s.add(
        f'  <rect x="{CX}" y="{s.y}" width="{CW}" height="36" rx="{R_MD}" fill="{N_BG3}" stroke="{N_STROKE2}"/>'
    )
    s.add(icon("shield", CX + 10, s.y + 8, 18, N_FG2))
    s.add(
        f'  <text x="{CX + 36}" y="{s.y + 22}" font-family="{FONT}" font-size="11" fill="{N_FG3}">Audit trail saved to case record</text>'
    )
    s.y += 36
    s.cta("Save usage", "check")
    return "\n".join(s.parts)


def beat_08(s: Screen) -> str:
    s.nav_active = 2
    s.subtitle("Unused · explant · policy return")
    y0, _ = s.card_box(108)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy, "box", ORG_BG, ORG)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 18}" font-family="{FONT}" font-size="14" font-weight="600" fill="{N_FG1}">Titanium screw kit · 1 unit</text>')
    s.add(f'  <text x="{tx}" y="{iy + 38}" font-family="{FONT}" font-size="12" fill="{N_FG3}">Not used in case</text>')
    s.badge(tx, iy + 48, "Pickup scheduled", ORG_BG, ORG)
    s.end_card(108, G12)
    y0, _ = s.card_box(80)
    iy = y0 + PAD
    s.icon_cell(CX + PAD, iy + 4, "mail", BRAND_BG, BRAND)
    tx = CX + PAD + ICON_CELL + G12
    s.add(f'  <text x="{tx}" y="{iy + 18}" font-family="{FONT}" font-size="12" fill="{N_FG3}">Return label RET-2201</text>')
    s.add(f'  <text x="{tx}" y="{iy + 38}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Pickup today · 16:00</text>')
    s.end_card(80)
    s.gap(G8)
    s.checkbox("Surgeon notified · return logged", True)
    s.cta("Print return label", "print")
    return "\n".join(s.parts)


def beat_09(s: Screen) -> str:
    s.nav_active = 3
    s.badge(CX, s.y, "Needs approval", ORG_BG, ORG)
    s.y += 32
    s.list_row("Requested item", "Flexible reamer · 9mm", "box", BRAND_BG, BRAND)
    s.section_label("Justification")
    y0, _ = s.card_box(80)
    s.add(
        f'  <text x="{CX + PAD}" y="{y0 + PAD + 20}" font-family="{FONT}" font-size="12" fill="{N_FG1}">Surgeon requested for revision</text>'
    )
    s.add(
        f'  <text x="{CX + PAD}" y="{y0 + PAD + 40}" font-family="{FONT}" font-size="11" fill="{N_FG3}">CASE-28491</text>'
    )
    s.end_card(80)
    s.list_row("Linked surgeon", "Dr. Vasquez", "person", N_BG3, N_FG2)
    s.gap(G8)
    s.add(icon("clock", CX, s.y, 18, ORG))
    s.add(
        f'  <text x="{CX + 26}" y="{s.y + 14}" font-family="{FONT}" font-size="11" fill="{N_FG3}">Ops SLA · 4h · notification on approve</text>'
    )
    s.y += 24
    s.cta("Submit request", "check")
    return "\n".join(s.parts)


def beat_10(s: Screen) -> str:
    s.subtitle("Northwest Medical · visit complete")
    y0, _ = s.card_box(100)
    iy = y0 + PAD
    rows = [
        ("check_circle", GRN, "1 order submitted"),
        ("check_circle", GRN, "2 parts used · logged"),
        ("clock", ORG, "1 return · pickup 16:00"),
    ]
    for i, (ic, col, txt) in enumerate(rows):
        ry = iy + i * 28
        s.add(icon(ic, CX + PAD, ry, 18, col))
        s.add(f'  <text x="{CX + PAD + 26}" y="{ry + 14}" font-family="{FONT}" font-size="12" fill="{col}">{txt}</text>')
    s.end_card(100, G12)
    y0, _ = s.card_box(72)
    iy = y0 + PAD
    s.add(icon("clock", CX + PAD, iy, 18, ORG))
    s.add(f'  <text x="{CX + PAD + 26}" y="{iy + 14}" font-family="{FONT}" font-size="12" fill="{ORG}">1 new part request · pending</text>')
    s.add(icon("star", CX + PAD, iy + 28, 18, BRAND))
    s.add(f'  <text x="{CX + PAD + 26}" y="{iy + 42}" font-family="{FONT}" font-size="12" fill="{N_FG1}">Preferences updated</text>')
    s.end_card(72)
    s.gap(G12)
    y0, _ = s.card_box(72, accent=True)
    s.add(icon("check_circle", CX + PAD, y0 + PAD + 4, 22, ORG))
    s.add(
        f'  <text x="{CX + PAD + 30}" y="{y0 + PAD + 20}" font-family="{FONT}" font-size="13" font-weight="600" fill="{N_FG1}">Nothing ambiguous open</text>'
    )
    s.add(
        f'  <text x="{CX + PAD + 30}" y="{y0 + PAD + 38}" font-family="{FONT}" font-size="11" fill="{N_FG3}">Next visit pre-loaded · Dr. Vasquez</text>'
    )
    s.end_card(72)
    s.cta("End visit", "check")
    return "\n".join(s.parts)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"Writing layout-corrected wireframes → {OUT.relative_to(ROOT)}/")
    specs = [
        ("beat-01-arrive.svg", "01 · ARRIVE", "Hospital visit", "building", beat_01),
        ("beat-02-preferences.svg", "02 · PREFERENCES", "Surgeon preferences", "star", beat_02),
        ("beat-03-order.svg", "03 · ORDER", "New order", "cart", beat_03),
        ("beat-04-order-track.svg", "04 · ORDER TRACK", "Order status", "arrow_sync", beat_04),
        ("beat-05-part-track.svg", "05 · PART TRACK", "Part tracking", "box", beat_05),
        ("beat-06-deliver.svg", "06 · DELIVER", "Delivery", "vehicle", beat_06),
        ("beat-07-use.svg", "07 · USE", "Surgical use", "heart_pulse", beat_07),
        ("beat-08-return.svg", "08 · RETURN", "Send back", "arrow_sync", beat_08),
        ("beat-09-request.svg", "09 · REQUEST", "New part request", "add", beat_09),
        ("beat-10-close-loop.svg", "10 · CLOSE LOOP", "Visit summary", "check_circle", beat_10),
    ]
    for name, beat, title, hi, fn in specs:
        s = Screen()
        if "03" in name:
            s.nav_active = 1
        elif "04" in name:
            s.nav_active = 1
        elif "05" in name or "06" in name or "07" in name or "08" in name:
            s.nav_active = 2
        elif "09" in name:
            s.nav_active = 3
        s.y = s.content_top
        body = fn(s)
        nav = s.bottom_nav()
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img">
{phone_frame(beat, title, hi)}
{body}
{nav}
  <text x="600" y="{H - 18}" text-anchor="middle" font-family="{FONT}" font-size="10" fill="{N_FG3}">Fluent UI · 20px margins · 8px grid</text>
</svg>'''
        (OUT / name).write_text(svg, encoding="utf-8")
        print(f"  {name}")
    print("Done: 10 SVGs")


if __name__ == "__main__":
    main()

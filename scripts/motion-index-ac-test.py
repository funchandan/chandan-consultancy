#!/usr/bin/env python3
"""Index motion acceptance tests — maps spec AC IDs to repo checks.

Usage:
  python3 scripts/motion-index-ac-test.py              # post-WO-015 strict (default)
  python3 scripts/motion-index-ac-test.py --baseline   # only shipped modules; warn on gaps
  python3 scripts/motion-index-ac-test.py --wo016      # WO-016 depth gates (strict)
  python3 scripts/motion-index-ac-test.py --baseline --wo016
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
MOTION_DIR = ROOT / "assets/motion"
CASE_CSS = ROOT / "assets/wp-project-case.css"
POLISH_CSS = ROOT / "assets/index-product-polish.css"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def grep_files(pattern: str, *paths: Path) -> bool:
    rx = re.compile(pattern)
    for p in paths:
        if p.is_file() and rx.search(read(p)):
            return True
    return False


def module_registered(module_id: str) -> bool:
    if not MOTION_DIR.is_dir():
        return False
    for js in MOTION_DIR.glob("*.js"):
        if re.search(rf'register\s*\(\s*["\']{re.escape(module_id)}["\']', read(js)):
            return True
    return False


def run_hero_bento_tests() -> list[str]:
    """WO-023 BoxBento — G-/BB-/M- gates."""
    fails: list[str] = []
    html = read(INDEX)
    cta_css = read(ROOT / "assets/wp-gemini-cta-reveal.css")
    bento_css = read(ROOT / "assets/wp-box-bento.css")
    gemini_js = read(ROOT / "assets/motion/wp-google-gemini-effect.js")
    bento_js = read(ROOT / "assets/wp-box-bento.js")

    if "rotate(90" in gemini_js or 'rotate(90' in read(ROOT / "components/ui/google-gemini-effect.tsx"):
        fails.append("G-001: Gemini SVG must not use vertical rotate(90)")
    if "data-box-bento-search" not in gemini_js:
        fails.append("G-002: gemini-effect must anchor layout to data-box-bento-search")
    if "data-box-bento" not in html:
        fails.append("BB-001: missing data-box-bento in index.html")
    hero_motion = re.search(r'id="hero"[^>]*data-wp-motion="([^"]+)"', html)
    if not hero_motion or "gemini-effect" not in hero_motion.group(1):
        fails.append("BB-015: #hero must include gemini-effect in data-wp-motion")
    if "wp-box-bento.css" not in html:
        fails.append("BB-002: missing wp-box-bento.css link in index.html")
    if "wp-box-bento.js" not in html:
        fails.append("BB-003: missing wp-box-bento.js script in index.html")
    if not (ROOT / "components/ui/bento-grid.tsx").is_file():
        fails.append("BB-004: components/ui/bento-grid.tsx missing (Magic UI install)")
    if not (ROOT / "components/box-bento.tsx").is_file():
        fails.append("BB-005: components/box-bento.tsx missing")
    hero_inner = re.search(
        r'<section[^>]*\bid="hero"[^>]*>([\s\S]*?)</section>',
        html,
    )
    if hero_inner and "data-box-bento" in hero_inner.group(1):
        fails.append("BB-006: BoxBento must not live inside #hero")
    if hero_inner and 'data-wp-glass-compose' in hero_inner.group(1):
        fails.append("BB-007: search must not remain in #hero (inside BoxBento only)")
    if "wp-box-bento-ledge" not in html or "data-box-bento-search" not in html:
        fails.append("BB-008: BoxBento ledge + search slot required")
    if "wp-hero-bento-ledge" in html or "wp-hero-bento.css" in html:
        fails.append("BB-009: legacy wp-hero-bento-ledge assets must be removed from index")
    if "--box-bento-t" not in gemini_js or "0.3" not in gemini_js:
        fails.append("M-001: gemini-effect must publish --box-bento-t at 30% scroll")
    if "--box-bento-t" not in bento_css:
        fails.append("M-002: wp-box-bento.css must consume --box-bento-t blur reveal")
    if ".bento-grid" not in bento_css or ".bento-card" not in bento_css:
        fails.append("BB-014: wp-box-bento.css must port Magic UI bento-grid/bento-card styles")
    if "wp-section-stage" in bento_css:
        fails.append("M-003: BoxBento must not use wp-section-stage")
    if not (ROOT / "assets/hero-bento.json").is_file():
        fails.append("BB-010: assets/hero-bento.json missing")
    if "bento-grid" not in html:
        fails.append("BB-011: index.html must use Magic UI bento-grid class")
    if html.count('class="bento-card bento-card--') < 3:
        fails.append("BB-012: expected 3 pathway bento-card tiles in index.html")
    if "hero-impact-counter" not in html:
        fails.append("BB-013: proof counters missing hero-impact-counter hook")
    if "wp:hero-bento-reveal" in bento_js or "is-animating" in bento_js:
        fails.append("M-004: box-bento JS must not run scroll reveal animations")
    if "--gemini-bento-t" in cta_css:
        fails.append("M-005: legacy --gemini-bento-t must be removed from CTA CSS")
    return fails


def run_hero_atmosphere_tests() -> list[str]:
    """WO-024 RetroGrid atmosphere — LR-/IG- gates."""
    fails: list[str] = []
    html = read(INDEX)
    retro_js = read(ROOT / "assets/motion/wp-hero-retrogrid-morph.js")
    rays_css = read(ROOT / "assets/wp-hero-light-rays.css")
    ig_css = read(ROOT / "assets/bg-grid-after-hero.css")

    if "data-hero-light-rays" not in html:
        fails.append("LR-001: missing data-hero-light-rays in index.html")
    if "--hero-light-rays-t" not in retro_js:
        fails.append("LR-002: retrogrid morph must publish --hero-light-rays-t")
    if "engageLightRays" not in retro_js:
        fails.append("LR-003: retrogrid morph must engage light rays on first keyword change")
    if "wp-hero-light-rays--engaged" not in retro_js:
        fails.append("LR-003b: retrogrid morph must lock light rays via wp-hero-light-rays--engaged")
    if not (ROOT / "components/ui/light-rays.tsx").is_file():
        fails.append("LR-004: components/ui/light-rays.tsx missing (Magic UI install)")
    if "--hero-light-rays-t" not in rays_css:
        fails.append("LR-005: wp-hero-light-rays.css must consume --hero-light-rays-t")
    if "z-index: 4" not in rays_css:
        fails.append("LR-006: light rays must render above retrogrid fade")

    if 'id="bg-grid-after-hero"' not in html or "data-bg-grid-after-hero" not in html:
        fails.append("IG-001: missing #bg-grid-after-hero in index.html")
    if "bg-grid-after-hero" not in html or "wp-bg-grid-after-hero.js" not in html:
        fails.append("IG-002: bg-grid-after-hero assets must be linked in index.html")
    if not module_registered("bg-grid-after-hero"):
        fails.append("IG-003: bg-grid-after-hero motion module must register")
    if not (ROOT / "components/ui/interactive-grid-pattern.tsx").is_file():
        fails.append("IG-004: components/ui/interactive-grid-pattern.tsx missing")
    if "home-page--post-hero" not in ig_css:
        fails.append("IG-005: bg-grid-after-hero.css must show grid on post-hero")
    if "--bg-grid-inset-top" not in ig_css:
        fails.append("IG-006: bg-grid-after-hero must clip below hero via --bg-grid-inset-top")
    if "pointer-events: all" not in ig_css:
        fails.append("IG-007: grid cells must use pointer-events: all (Magic UI parity)")
    if "svg.style.height" not in read(ROOT / "assets/motion/wp-bg-grid-after-hero.js"):
        fails.append("IG-008: bg-grid-after-hero JS must size SVG to visible band")
    if "home-page--post-hero" not in ig_css:
        fails.append("IG-009: dot-grid must fade when post-hero active")
    return fails


def run_wo015_tests(baseline: bool) -> tuple[list[str], list[str]]:
    fails: list[str] = []
    warns: list[str] = []
    html = read(INDEX)

    def require(ac_id: str, ok: bool, msg: str, *, pending: bool = False) -> None:
        if ok:
            return
        if baseline and pending:
            warns.append(f"{ac_id} (pending): {msg}")
        else:
            fails.append(f"{ac_id}: {msg}")

    # --- Shipped (baseline must pass) ---
    require("HS-001", module_registered("hero-slot"), "hero-slot module not registered")
    require("HS-004", "hero-slot" in html, "index.html missing data-wp-motion hero-slot")
    require(
        "HS-004",
        html.count("wp-hero-slot__word") >= 5,
        "expected 5 slot words in index.html",
    )

    require(
        "TH-005",
        module_registered("hero-veil"),
        "hero-veil module not registered",
    )
    require(
        "TH-005",
        "wp-index-page-torch.css" in html,
        "index.html missing wp-index-page-torch.css",
    )

    require("ML-001", module_registered("method-rail"), "method-rail not registered")
    require("ML-001", "method-rail" in html, "#approach missing method-rail hook")

    require("WC-001", html.count('class="wp-project-case"') == 3, "expected 3 wp-project-case articles")
    require("WC-001", module_registered("work-reveal"), "work-reveal not registered")

    # --- WO-015 (shipped) ---
    require(
        "WC-006",
        module_registered("work-case-reveal"),
        "work-case-reveal module not registered",
    )
    require(
        "WC-006",
        "work-case-reveal" in html,
        "#work missing work-case-reveal in data-wp-motion",
    )
    require(
        "WC-007",
        grep_files(
            r"wp-project-case__device.*hover|hover.*wp-project-case__device",
            CASE_CSS,
            POLISH_CSS,
        )
        or grep_files(r"translateY\(-2px\)", CASE_CSS),
        "device hover lift CSS not found",
    )

    require(
        "MC-001",
        module_registered("method-close-reveal"),
        "method-close-reveal module not registered",
    )
    require(
        "MC-001",
        "method-close-reveal" in html,
        "wp-method-close missing method-close-reveal hook",
    )

    require(
        "CN-001",
        module_registered("connect-reveal"),
        "connect-reveal module not registered",
    )
    require(
        "CN-001",
        "connect-reveal" in html,
        "#connect missing connect-reveal hook",
    )
    require(
        "CN-005",
        "wp-connect-atmosphere" in read(POLISH_CSS)
        and "display: none" in read(POLISH_CSS),
        "product index should hide legacy connect atmosphere",
    )

    require(
        "TH-007",
        grep_files(r"\.wp-project-case::before", CASE_CSS),
        "case-local torch lift CSS not found on .wp-project-case::before",
    )
    polish = read(POLISH_CSS)
    require(
        "TH-007",
        "#project-points-marketplace::before" not in polish,
        "torch lift should not remain case-01-only in index-product-polish.css",
    )

    require(
        "ML-003",
        grep_files(
            r"wp-method-line.*focus-within|focus-within.*wp-method-line|:focus-within",
            ROOT / "assets/noomo-primitives.css",
            POLISH_CSS,
        ),
        "method line active emphasis CSS not found",
    )

    return fails, warns


def run_wo021_tests(baseline: bool) -> tuple[list[str], list[str]]:
    fails: list[str] = []
    warns: list[str] = []
    slot_css = ROOT / "assets/wp-hero-display-slot.css"
    funnel_css = ROOT / "assets/hero-toolkit-funnel.css"
    journey_js = MOTION_DIR / "wp-journey-immersive.js"

    def require(ac_id: str, ok: bool, msg: str, *, pending: bool = False) -> None:
        if ok:
            return
        if baseline and pending:
            warns.append(f"{ac_id} (WO-021 pending): {msg}")
        else:
            fails.append(f"{ac_id}: {msg}")

    require(
        "HS-005",
        slot_css.is_file()
        and re.search(
            r"wp-hero-range__dot\.is-active[\s\S]{0,200}width:\s*14px",
            read(slot_css),
        ),
        "active dot width morph missing (HS-005)",
    )
    require(
        "HS-006",
        journey_js.is_file()
        and re.search(r"offsetHeight\s*\*\s*0\.35", read(journey_js)),
        "scroll cue 35% hero threshold missing (HS-006)",
    )
    require(
        "HL-001",
        funnel_css.is_file()
        and re.search(
            r"statement-viewport__lead\[data-hero-funnel-root\]:hover.*lead-funnel",
            read(funnel_css),
            re.S,
        ),
        "lead funnel hover emphasis missing (HL-001)",
    )
    require(
        "HL-002",
        funnel_css.is_file()
        and "wp-hero-funnel-panel-in" in read(funnel_css),
        "funnel panel enter animation missing (HL-002)",
    )
    require(
        "HST-002",
        slot_css.is_file()
        and "wp-hero-strip-tile-in" in read(slot_css)
        and (
            re.search(r"nth-child\(2\)[\s\S]{0,120}0\.5s", read(slot_css))
            or re.search(
                r"wp-hero-toolkit-path__stage:nth-child\(2\)[\s\S]{0,120}animation-delay",
                read(slot_css),
            )
        ),
        "per-tile strip stagger missing (HST-002)",
    )
    require(
        "HST-001",
        module_registered("hero-project-strip"),
        "hero-project-strip module not registered (HST-001)",
    )
    require(
        "HST-001",
        "hero-project-strip" in read(INDEX),
        "#hero missing hero-project-strip hook (HST-001)",
    )

    wo021_spec = ROOT / "_bmad-output/D-UX-Design/motion/wp-hero-lead.md"
    wo021_wo = ROOT / "_bmad-output/E-Development/WO-021-index-hero-p1-beautification.md"
    require(
        "HH-004",
        wo021_spec.is_file() and wo021_wo.is_file(),
        "WO-021 spec/WO docs required (HH-004)",
        pending=baseline,
    )

    return fails, warns


def run_wo020_tests(baseline: bool) -> tuple[list[str], list[str]]:
    fails: list[str] = []
    warns: list[str] = []
    html = read(INDEX)
    l0_js = MOTION_DIR / "wp-l0-atmosphere-gl.js"
    l0_css = ROOT / "assets/wp-l0-atmosphere-gl.css"
    journey_js = MOTION_DIR / "wp-journey-immersive.js"

    def require(ac_id: str, ok: bool, msg: str, *, pending: bool = False) -> None:
        if ok:
            return
        if baseline and pending:
            warns.append(f"{ac_id} (WO-020 pending): {msg}")
        else:
            fails.append(f"{ac_id}: {msg}")

    require(
        "L0-002",
        module_registered("l0-atmosphere-gl"),
        "l0-atmosphere-gl module not registered (L0-002)",
    )
    require(
        "L0-002",
        "l0-atmosphere-gl" in html,
        "body missing l0-atmosphere-gl hook (L0-002)",
    )
    require(
        "L0-002",
        l0_js.is_file() and l0_css.is_file(),
        "L0 atmosphere GL assets missing (L0-002)",
    )
    require(
        "L0-001",
        l0_css.is_file()
        and re.search(
            r"wp-l0-gl-active[\s\S]{0,120}\.wp-page-torch",
            read(l0_css),
        ),
        "DOM torch hide when GL active missing (L0-001)",
    )
    require(
        "L0-003",
        journey_js.is_file()
        and "wp-l0-gl-active" in read(journey_js),
        "hero-veil must branch on wp-l0-gl-active (L0-003)",
    )
    require(
        "L0-006",
        l0_js.is_file()
        and re.search(r"catch|WebGL unavailable", read(l0_js)),
        "WebGL fail fallback path missing (L0-006)",
    )
    require(
        "L0-007",
        l0_js.is_file()
        and "wp-l0-atmosphere-gl" in read(l0_js),
        "single L0 GL canvas class missing (L0-007)",
    )

    wo020_spec = ROOT / "_bmad-output/D-UX-Design/motion/wp-l0-atmosphere-gl.md"
    wo020_wo = ROOT / "_bmad-output/E-Development/WO-020-l0-marble-webgl-upgrade.md"
    require(
        "L0-002",
        wo020_spec.is_file() and wo020_wo.is_file(),
        "WO-020 spec/WO docs required",
        pending=baseline,
    )

    return fails, warns


def run_wo016_tests(baseline: bool) -> tuple[list[str], list[str]]:
    fails: list[str] = []
    warns: list[str] = []
    html = read(INDEX)
    case_css = read(CASE_CSS) if CASE_CSS.is_file() else ""
    polish_css = read(POLISH_CSS) if POLISH_CSS.is_file() else ""
    combined_css = case_css + polish_css

    def require(ac_id: str, ok: bool, msg: str, *, pending: bool = True) -> None:
        if ok:
            return
        if baseline and pending:
            warns.append(f"{ac_id} (WO-016 pending): {msg}")
        else:
            fails.append(f"{ac_id}: {msg}")

    depth_js = MOTION_DIR / "wp-work-case-depth.js"
    depth_registered = module_registered("work-case-depth")
    depth_hooked = "work-case-depth" in html

    require("WD-001", depth_registered and depth_hooked, "work-case-depth module/hook missing")
    require(
        "WD-001",
        depth_js.is_file(),
        "assets/motion/wp-work-case-depth.js missing",
    )
    require(
        "WD-001",
        grep_files(
            r"project-points-marketplace|project-hp-field-service|project-stryker-logistics",
            depth_js,
        )
        if depth_js.is_file()
        else False,
        "depth module should reference all three case IDs",
    )

    require(
        "WD-002",
        not re.search(
            r"\.wp-project-case__copy[^{]*\{[^}]*rotateX",
            combined_css,
            re.I | re.S,
        ),
        "copy plane must not use rotateX (WD-002)",
        pending=False,
    )
    require(
        "WD-002",
        not re.search(
            r"\.wp-project-case__(title|body|meta)[^{]*\{[^}]*rotateX",
            combined_css,
            re.I | re.S,
        ),
        "title/body/meta must not use rotateX (WD-002)",
        pending=False,
    )

    require(
        "WD-005",
        not re.search(r"#work[^{]*\{[^}]*position:\s*fixed", combined_css, re.I | re.S),
        "#work must not be scroll-pinned (WD-005)",
        pending=False,
    )
    require(
        "WD-005",
        not (
            depth_js.is_file()
            and re.search(r"pin\s*:\s*true", read(depth_js), re.I)
        ),
        "ScrollTrigger pin:true not allowed on work cases (WD-005)",
    )

    require(
        "WD-006",
        "wp-connect-atmosphere" in polish_css and "display: none" in polish_css,
        "section veils must stay disabled on product index (WD-006)",
        pending=False,
    )
    require(
        "WD-006",
        grep_files(r"\.wp-project-case::before", CASE_CSS),
        "torch lift on cases unchanged (WD-006)",
        pending=False,
    )

    require("WD-007", depth_registered, "work-case-depth not registered (WD-007)")
    require("WD-007", depth_hooked, "#work missing work-case-depth hook (WD-007)")

    require(
        "WD-004",
        depth_js.is_file()
        and (
            re.search(r"prefers-reduced-motion", read(depth_js), re.I)
            or re.search(r"wp-motion--static", read(depth_js))
        ),
        "depth module must respect reduced motion (WD-004)",
    )

    require(
        "WD-004",
        grep_files(
            r"prefers-reduced-motion|--case-depth-progress|--case-media-scale",
            CASE_CSS,
            POLISH_CSS,
        ),
        "depth CSS vars or RM overrides missing (WD-004)",
    )

    require(
        "WD-001",
        grep_files(
            r"perspective|--case-media-scale|--case-depth-progress",
            CASE_CSS,
            POLISH_CSS,
        ),
        "depth CSS tokens missing (WD-001)",
    )

    require(
        "WD-001",
        depth_js.is_file()
        and re.search(r"ScrollTrigger|WPScroll", read(depth_js)),
        "depth module should use ScrollTrigger + WPScroll (WD-001)",
    )

    wo016_spec = ROOT / "_bmad-output/D-UX-Design/motion/wp-project-case-depth.md"
    wo016_wo = ROOT / "_bmad-output/E-Development/WO-016-work-case-3d-depth.md"
    require(
        "WD-009",
        wo016_spec.is_file() and wo016_wo.is_file(),
        "WO-016 spec/WO docs required for GPU QA log (WD-009)",
        pending=False,
    )

    return fails, warns


def run_noomo_tests(baseline: bool) -> tuple[list[str], list[str]]:
    fails: list[str] = []
    warns: list[str] = []
    html = read(INDEX)
    tier_css = ROOT / "assets/index-noomo-tier3.css"

    def require(ac_id: str, ok: bool, msg: str, *, pending: bool = False) -> None:
        if ok:
            return
        if baseline and pending:
            warns.append(f"{ac_id} (Noomo pending): {msg}")
        else:
            fails.append(f"{ac_id}: {msg}")

    section_js = MOTION_DIR / "wp-section-depth.js"
    evidence_js = MOTION_DIR / "wp-work-case-evidence-3d.js"
    glass_js = MOTION_DIR / "wp-glass-scroll.js"
    three_js = ROOT / "assets/vendor/three/three.min.js"

    require("NP-001", module_registered("section-depth"), "section-depth not registered")
    require("NP-001", "section-depth" in html, "#main missing section-depth hook")
    require("NP-001", section_js.is_file(), "wp-section-depth.js missing")
    require(
        "NP-001",
        section_js.is_file() and re.search(r"hero.*work|ScrollTrigger", read(section_js), re.I),
        "section-depth must handle hero→work handoff",
    )

    require("NP-002", module_registered("work-case-evidence-3d"), "work-case-evidence-3d not registered")
    require("NP-002", "work-case-evidence-3d" in html, "#work missing work-case-evidence-3d hook")
    require("NP-002", evidence_js.is_file(), "wp-work-case-evidence-3d.js missing")
    require(
        "NP-002",
        evidence_js.is_file() and re.search(r"WebGLRenderer|THREE", read(evidence_js)),
        "evidence module must use WebGL/Three.js (NP-002)",
    )
    require("NP-002", three_js.is_file(), "Three.js vendor missing")
    require("NP-002", "three.min.js" in html, "index.html missing three.min.js")

    require("NP-003", tier_css.is_file(), "index-noomo-tier3.css missing")
    require(
        "NP-003",
        (ROOT / "_bmad-output/E-Development/WO-018-case-evidence-3d-noomo-parity.md").is_file(),
        "WO-018 doc required for GPU QA log (NP-003)",
    )

    require("NP-005", module_registered("glass-scroll"), "glass-scroll module not registered")
    require("NP-005", "glass-scroll" in html, "body missing glass-scroll hook")
    require("NP-005", glass_js.is_file(), "Tier 3 glass-scroll module missing")

    require(
        "NP-001",
        grep_files(r"wp-section-depth-ready|section-stage-scale", tier_css),
        "section depth CSS missing",
    )
    require(
        "NP-005",
        grep_files(r"prefers-reduced-motion", tier_css, evidence_js, section_js),
        "Tier 3 RM overrides missing",
    )

    return fails, warns


    return fails


def run_edge_blur_tests() -> list[str]:
    """EdgeBlur — EB-* gates."""
    fails: list[str] = []
    html = read(INDEX)
    polish = read(POLISH_CSS)
    eb_css = ROOT / "assets/wp-edge-blur.css"
    eb_js = MOTION_DIR / "wp-edge-blur-handoff.js"
    component = ROOT / "components/ui/edge-blur.tsx"

    def require(gate: str, ok: bool, msg: str) -> None:
        if not ok:
            fails.append(f"{gate}: {msg}")

    require("EB-001", component.is_file(), "components/ui/edge-blur.tsx missing")
    require("EB-002", module_registered("edge-blur-handoff"), "edge-blur-handoff module not registered")
    require(
        "EB-003",
        "data-wp-edge-blur-handoff" in html
        and "data-edge-blur-seam" in html
        and "data-edge-blur-bottom" in html,
        "index missing edge blur shell, seam, or bottom pane",
    )
    require(
        "EB-004",
        eb_css.is_file()
        and eb_js.is_file()
        and "wp-edge-blur.css" in html
        and "wp-edge-blur-handoff.js" in html,
        "edge blur assets missing or not linked in index",
    )
    require(
        "EB-005",
        "wp-edge-blur-ready" in polish and "statement-viewport::after" in polish,
        "legacy blur seam not gated behind wp-edge-blur-ready",
    )
    require(
        "EB-006",
        grep_files(r"pointer-events:\s*none", eb_css),
        "edge blur shell missing pointer-events: none",
    )
    require(
        "EB-007",
        "edge-blur-handoff" in html,
        "#main missing edge-blur-handoff hook",
    )

    return fails


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--baseline",
        action="store_true",
        help="Only fail on shipped-module regressions; warn on pending WO-016",
    )
    parser.add_argument(
        "--wo016",
        action="store_true",
        help="Include WO-016 work-case depth acceptance gates",
    )
    parser.add_argument(
        "--noomo",
        action="store_true",
        help="Include Noomo Tier 3 parity gates (NP-*)",
    )
    args = parser.parse_args()

    fails, warns = run_wo015_tests(baseline=args.baseline)
    fails.extend(run_hero_bento_tests())
    fails.extend(run_hero_atmosphere_tests())
    fails.extend(run_edge_blur_tests())

    if not args.baseline:
        w21_fails, w21_warns = run_wo021_tests(baseline=args.baseline)
        fails.extend(w21_fails)
        warns.extend(w21_warns)
        w20_fails, w20_warns = run_wo020_tests(baseline=args.baseline)
        fails.extend(w20_fails)
        warns.extend(w20_warns)

    if args.wo016:
        w16_fails, w16_warns = run_wo016_tests(baseline=args.baseline)
        fails.extend(w16_fails)
        warns.extend(w16_warns)

    if args.noomo:
        np_fails, np_warns = run_noomo_tests(baseline=args.baseline)
        fails.extend(np_fails)
        warns.extend(np_warns)

    if warns:
        print("WARNINGS:")
        for w in warns:
            print(f"  - {w}")

    if fails:
        print("MOTION INDEX AC: FAIL")
        for f in fails:
            print(f"  - {f}")
        return 1

    parts = []
    if args.baseline:
        parts.append("BASELINE")
    else:
        parts.append("STRICT")
    if args.wo016:
        parts.append("WO-016")
    if not args.baseline:
        parts.append("WO-021")
        parts.append("WO-020")
    if args.noomo:
        parts.append("NOOMO-T3")
    mode = " + ".join(parts)
    print(f"MOTION INDEX AC: PASS ({mode})")
    if warns:
        print(f"  {len(warns)} pending item(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

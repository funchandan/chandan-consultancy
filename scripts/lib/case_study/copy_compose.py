from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]


def _resolve_ticker_source(
    inbox: Path, item: dict, *, dest_dir: Path | None = None
) -> Path | None:
    """Find slide source in inbox, on Desktop, published assets, or via optional ``source``."""
    names: list[str] = []
    for key in ("file", "source"):
        name = (item.get(key) or "").strip()
        if name and name not in names:
            names.append(name)
    desktop = inbox.parent if inbox.name == "hero-ticker" else inbox
    for name in names:
        candidates = [inbox / name, desktop / name]
        if dest_dir is not None:
            candidates.append(dest_dir / name)
        for candidate in candidates:
            if candidate.is_file():
                return candidate
    return None


def _sync_hero_ticker(meta: dict, slug: str, asset_prefix: str) -> list[dict]:
    """Copy ~/Desktop/hero-ticker (or meta.hero_ticker.inbox) into case-study assets."""
    ht = meta.get("hero_ticker") or {}
    inbox = Path(ht.get("inbox") or Path.home() / "Desktop" / "hero-ticker")
    dest_dir = REPO_ROOT / "assets" / "case-studies" / slug / "hero-ticker"
    dest_dir.mkdir(parents=True, exist_ok=True)

    manifest = ht.get("slides") or []
    slides: list[dict] = []

    def _publish(
        src_path: Path,
        dest_name: str,
        label: str,
        frame: str = "plain",
        meta_item: dict | None = None,
    ) -> None:
        dest_path = dest_dir / dest_name
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        same_file = src_path.resolve() == dest_path.resolve()
        if not same_file:
            if dest_path.suffix.lower() == ".png" and src_path.suffix.lower() in {
                ".jpg",
                ".jpeg",
            }:
                try:
                    subprocess.run(
                        ["sips", "-s", "format", "png", str(src_path), "--out", str(dest_path)],
                        check=True,
                        capture_output=True,
                    )
                except subprocess.CalledProcessError:
                    shutil.copy2(src_path, dest_path)
            else:
                shutil.copy2(src_path, dest_path)
        try:
            probe = subprocess.run(
                ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(dest_path)],
                check=True,
                capture_output=True,
                text=True,
            )
            dims = [
                int(line.split()[-1])
                for line in probe.stdout.splitlines()
                if "pixelWidth" in line or "pixelHeight" in line
            ]
            max_edge = max(dims) if dims else 0
            cap = 960 if frame == "macbook" else 1200
            if max_edge > cap:
                subprocess.run(
                    ["sips", "-Z", str(cap), str(dest_path)],
                    check=True,
                    capture_output=True,
                )
        except (subprocess.CalledProcessError, ValueError):
            pass
        rel = f"hero-ticker/{dest_name}"
        url = _case_asset_src(slug, rel, asset_prefix)
        if url:
            entry: dict = {
                "src": url,
                "label": label,
                "file": dest_name,
                "alt": (meta_item or {}).get("alt", ""),
            }
            if frame and frame != "plain":
                entry["frame"] = frame
            layout = (meta_item or {}).get("layout")
            if layout:
                entry["layout"] = layout
            if (meta_item or {}).get("width") and (meta_item or {}).get("height"):
                entry["width"] = meta_item["width"]
                entry["height"] = meta_item["height"]
            retina = dest_dir / dest_name.replace(".png", "@2x.png")
            if retina.is_file():
                retina_url = _case_asset_src(slug, f"hero-ticker/{retina.name}", asset_prefix)
                if retina_url:
                    entry["srcset"] = f"{retina_url} 2x"
            slides.append(entry)

    if manifest:
        for item in manifest:
            fname = item.get("file", "")
            src = _resolve_ticker_source(inbox, item, dest_dir=dest_dir)
            if src and fname:
                _publish(
                    src,
                    fname,
                    item.get("label", fname),
                    item.get("frame", "plain"),
                    meta_item=item,
                )
    elif inbox.is_dir():
        for src in sorted(inbox.glob("*")):
            if src.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                continue
            if "@2x" in src.stem or src.name.startswith("."):
                continue
            label = ht.get("labels", {}).get(src.name) or src.stem.replace("-", " ").title()
            _publish(src, src.name, label)

    return slides


def _ticker_slides_for_copy(meta: dict, slug: str, asset_prefix: str) -> list[dict]:
    ht = meta.get("hero_ticker") or {}
    if ht.get("slides"):
        built = _sync_hero_ticker(meta, slug, asset_prefix)
        if built:
            return built
    slides = []
    dest_dir = REPO_ROOT / "assets" / "case-studies" / slug / "hero-ticker"
    if dest_dir.is_dir():
        for p in sorted(dest_dir.glob("*")):
            if p.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                continue
            if "@2x" in p.stem:
                continue
            rel = f"hero-ticker/{p.name}"
            url = _case_asset_src(slug, rel, asset_prefix)
            if url:
                slides.append({"src": url, "label": p.stem, "file": p.name})
    return slides


def _case_asset_src(
    slug: str | None, rel_path: str, asset_prefix: str = ".."
) -> str | None:
    if not slug or not rel_path:
        return None
    if not (REPO_ROOT / "assets" / "case-studies" / slug / rel_path).is_file():
        return None
    return f"{asset_prefix}/assets/case-studies/{slug}/{rel_path}"


DEFAULT_BEAT_ARTEFACTS = {
    "beat_objective": "A1",
    "beat_problem": "A2",
    "beat_role_method": "A3",
    "beat_insights": "A5",
    "beat_recommendations": "A4",
}

BEAT_GLYPHS = {
    "01": "◆",
    "02": "▼",
    "03": "◎",
    "04": "▣",
    "05": "→",
}

DEFAULT_HERO_FACTS = [
    {
        "label": "Program",
        "value": (
            "Foundational UX research, 2022. Rewards, retention, and loyalty "
            "mechanics on a K-8 math learning platform."
        ),
    },
    {
        "label": "Role",
        "value": (
            "Led UX end to end: problem framing, Figma stimulus on the design system, "
            "synthesis, and readout so product could decide what to build."
        ),
    },
    {
        "label": "Skills",
        "value": (
            "Product teams for journey tradeoffs. CXO and leadership for strategic insights. "
            "Engineering for component feasibility and ship constraints."
        ),
    },
    {
        "label": "Research",
        "value": (
            "15 in-depth interviews (US and India). Moderated stimulus sessions. "
            "Figma prototypes aligned to the design system."
        ),
    },
]


def _artefact_index(pkg: dict) -> dict[str, dict]:
    return {a["id"]: a for a in pkg.get("artefacts") or []}


def _artefact_src(slug: str | None, artefact: dict, asset_prefix: str = "..") -> str | None:
    path = artefact.get("path")
    if not path or not slug:
        return None
    return f"{asset_prefix}/assets/case-studies/{slug}/{path}"


def _file_label(path: str) -> str:
    if not path:
        return "Figma wireframe"
    return Path(path).stem.replace("-", " ").title()


def _normalize_hero_facts(meta: dict) -> list[dict]:
    raw = meta.get("hero_facts") or DEFAULT_HERO_FACTS
    out = []
    for item in raw:
        if item.get("label") and item.get("value"):
            out.append({"label": item["label"], "value": item["value"]})
        elif item.get("text"):
            out.append({"label": "", "value": item["text"]})
    return out or list(DEFAULT_HERO_FACTS)


def _metric_impact_items(pkg: dict) -> list[dict]:
    metrics = pkg.get("metrics") or []
    items = []
    for m in metrics[:3]:
        caption = (m.get("baseline") or m.get("note") or "").strip()
        if not caption and m.get("verification") == "directional":
            caption = "Directional signal from synthesis"
        items.append(
            {
                "value": str(m.get("value", "")),
                "title": m.get("label", ""),
                "caption": caption,
            }
        )
    while len(items) < 3:
        items.append({"value": "—", "title": "", "caption": ""})
    return items[:3]


def _build_project_context_points(pkg: dict) -> dict:
    """BYJU'S — cohesive design-practice narrative for project context cards."""
    meta = pkg["meta"]
    base = _build_project_context_default(pkg)
    base["product"]["description"] = (meta.get("hero_deck") or "").strip()
    base["details"][1]["text"] = "Design lead · foundational study"
    base["narrative"] = [
        {
            "title": "Problem",
            "subtitle": "Loop not legible",
            "body": (
                "Learners earned points and creator coins but could not describe how to spend them. "
                "Attendance and session time dropped while the product prepared to scale marketplace "
                "and avatar UI—without a validated earn-and-spend story in the journey."
            ),
        },
        {
            "title": "Approach",
            "subtitle": "Design practice",
            "body": (
                "I framed the retention question with product, built moderated stimulus on the "
                "design system (not throwaway comps), and paired every verbatim to the frame on screen. "
                "Engineering reviewed the same components before recommendations became a ship plan."
            ),
        },
        {
            "title": "Outcome",
            "subtitle": "Shippable foundation",
            "body": (
                "One ledger, onboarding before the shop, and aspiration-led marketplace framing—"
                "staged so ledger clarity shipped first. Post-launch: 43% higher attendance and 27% "
                "higher course completion in the weeks from the milestone."
            ),
        },
    ]
    base["impact"]["metrics"][0]["caption"] = "From launch milestone · directional programme metric"
    base["impact"]["metrics"][1]["caption"] = "Students who finished the course"
    return base


def _beats_points_marketplace(pkg: dict, quotes: list, insights: list, recommendations: list) -> list:
    """Gallery beats — one thread: validate mental model before scaling UI."""
    return [
        {
            "id": "beat_objective",
            "section": "Objective",
            "glyph": BEAT_GLYPHS["01"],
            "step": "01",
            "title": "Objective",
            "subtitle": "Validate the earn-and-spend mental model before UI scales.",
            "lead": "Product was ready to invest in marketplace and avatar work.",
            "body": (
                "The design practice goal was simple: agree what learners should see in wallet, "
                "onboarding, and marketplace surfaces—then scale UI with engineering confidence, "
                "not parallel currency experiments."
            ),
            "heuristic": _heuristic(
                "Match between system and real world",
                "Children talked in heroes, powers, and class wins—not ledger types the product never taught.",
                "DS-aligned wallet, avatar grid, and redeem paths used in all 15 moderated sessions.",
            ),
            "artefact_id": "A1",
        },
        {
            "id": "beat_problem",
            "section": "Problem",
            "glyph": BEAT_GLYPHS["02"],
            "step": "02",
            "title": "Problem",
            "subtitle": "Retention slipped when the rewards loop was hard to read.",
            "lead": "Points accumulated; attendance and time-on-platform fell.",
            "body": (
                "Loyalty mechanics sat outside the core class journey. Dual currency and missing "
                "affordances meant learners could not name their next spend action."
            ),
            "quotes": quotes,
            "heuristic": _heuristic(
                "Visibility of system status",
                "Balances were visible; the path from balance to redeem was not—so intent stalled.",
                "Synthesis linked platform decline to a missing earn-and-spend loop in the product story.",
            ),
            "artefact_id": "A2",
        },
        {
            "id": "beat_role_method",
            "section": "My role / Methodology",
            "glyph": BEAT_GLYPHS["03"],
            "step": "03",
            "title": "My role and methodology",
            "subtitle": "One practice, end to end.",
            "lead": "I led design research as a ship-ready practice—not a readout deck alone.",
            "body": (
                "Framed the problem with product and CXO, built Figma stimulus on the design system, "
                "ran 15 IDIs across US and India (grades 1–8), and co-reviewed components with "
                "engineering so recommendations were feasible before marketplace build started."
            ),
            "heuristic": _heuristic(
                "Consistency and standards",
                "Findings had to ship: the same components in sessions were the ones in the handoff spec.",
                "FutureSchool tokens and patterns—not one-off research comps.",
            ),
            "artefact_id": "A3",
        },
        {
            "id": "beat_insights",
            "section": "Insights",
            "glyph": BEAT_GLYPHS["04"],
            "step": "04",
            "title": "User testing",
            "subtitle": "Evidence stays on the artefact.",
            "lead": "Fifteen sessions; every theme maps to a frame learners touched.",
            "body": (
                "HCI signal and UI evidence stay paired—what they said is what they pointed at. "
                "That discipline kept synthesis honest when product asked what to build first."
            ),
            "insight_bullets": insights[:4],
            "heuristic": _heuristic(
                "Help users recognize, diagnose, and recover from errors",
                "Redemption intent was there; the UI offered no confident next step on the marketplace surface.",
                "Verbatims pinned to the wallet or grid frame in view—not floating in a report appendix.",
                before="Points? nothing, i just have them, i dont know what to do with them",
                after="Quote tied to marketplace frame: balance visible, spend path unclear.",
            ),
            "artefact_id": "A5",
        },
        {
            "id": "beat_recommendations",
            "section": "Recommendations",
            "glyph": BEAT_GLYPHS["05"],
            "step": "05",
            "title": "Recommendations and implementation guide",
            "subtitle": "Decisions engineering could schedule.",
            "lead": "One ledger, onboarding before browse, heroes over currency jargon.",
            "body": (
                "Recommendations were ordered for ship: ledger and onboarding first, then marketplace "
                "depth—tokens, UX writing, in-product comms, and a single earn → balance → redeem journey."
            ),
            "implementation": [
                "Ledger: one spendable balance, spent history, visible next action on marketplace.",
                "Onboarding: earn and spend modules at deploy, before shop exposure.",
                "Marketplace: aspiration-led hero framing aligned to how learners describe powers.",
                "Ship order: ledger + onboarding → marketplace depth (badges, avatars, level-ups).",
            ],
            "recommendation_bullets": recommendations[:4],
            "heuristic": _heuristic(
                "Recognition rather than recall",
                "Dual currency forced invented rules instead of reading one balance.",
                "Single ledger plus plain-language onboarding before marketplace browse.",
                before="I think 1 coin = 2 points because coins are more precious than points",
                after="One balance, plain labels, onboarding before the shop.",
            ),
            "artefact_id": "A4",
        },
    ]


def _build_project_context_default(pkg: dict) -> dict:
    meta = pkg["meta"]
    res = pkg.get("resources") or {}
    constraints = res.get("constraints") or []
    rec = (res.get("recommendations") or [""])[0]
    tools = meta.get("tools") or []
    scope = " · ".join(tools[:4]) if tools else "Foundational research · Figma stimulus · Design system"

    role_line = res.get("role_context", "") or "Lead UX researcher (foundational study)"
    if len(role_line) > 88:
        role_line = role_line[:85].rstrip() + "…"

    problem_bits = constraints[:2] if constraints else [
        "Platform time and attendance fell while loyalty mechanics stayed invisible in the journey."
    ]
    problem_body = ". ".join(s.strip().rstrip(".") for s in problem_bits) + "."

    return {
        "product": {
            "label": "Product",
            "name": meta.get("client_safe_name", "Byju's FutureSchool"),
            "description": (meta.get("hero_deck") or "").strip()
            or res.get("objective_notes", ""),
        },
        "details_approved_by": "",
        "details": [
            {
                "type": "item",
                "icon": "platform",
                "label": "platform",
                "text": "K-8 web & mobile · math learning",
            },
            {
                "type": "item",
                "icon": "role",
                "label": "role",
                "text": "User Experience Lead",
            },
            {
                "type": "item",
                "icon": "team",
                "label": "stakeholders",
                "text": "Product · CXO · Engineering",
            },
            {
                "type": "item",
                "icon": "calendar",
                "label": "duration",
                "text": "8 weeks",
            },
            {
                "type": "toolstack",
                "label": "Tech stack",
                "tools": [
                    {"id": "figma", "name": "Figma"},
                    {"id": "modeln", "name": "Model N"},
                    {"id": "azure-devops", "name": "Azure DevOps"},
                    {"id": "react", "name": "React"},
                    {"id": "react-native", "name": "React Native"},
                    {"id": "miro", "name": "Miro"},
                ],
            },
        ],
        "narrative": [
            {
                "title": "Problem",
                "subtitle": "Engagement & retention",
                "body": (
                    "Attendance and time-on-platform were falling while points piled up with "
                    "no clear redeem path. Product was ready to scale marketplace and avatar UI "
                    "without a shared earn-and-spend story. We needed a retention strategy "
                    "grounded in how young learners read rewards, not another layer of opaque "
                    "currency mechanics."
                ),
            },
            {
                "title": "Solution",
                "subtitle": "Personalized marketplace",
                "body": (
                    "Journey work foresaw friction early and cut it before build. Design-system "
                    "component design and spec-based engineering handoffs trimmed roughly three "
                    "weeks from implementation. We planned a staged rollout by feature: ledger "
                    "clarity and onboarding first, then marketplace depth, with badges, avatars, "
                    "and level-ups on a foundation teams could ship in order."
                ),
            },
            {
                "title": "Result",
                "subtitle": "Launch impact",
                "body": (
                    "43% higher attendance in the weeks from the launch milestone. "
                    "27% increase in the percentage of students who completed the course."
                ),
            },
        ],
        "impact": {
            "title": "Impact",
            "metrics": [
                {
                    "value": "43%",
                    "title": "Higher attendance",
                    "caption": "Weeks from day-of-launch milestone",
                },
                {
                    "value": "27%",
                    "title": "Course completion",
                    "caption": "Increase in students who finished the course",
                },
                {
                    "value": "15",
                    "title": "In-depth interviews",
                    "caption": "Grades 1–8 · US + IN",
                },
            ],
        },
    }


def _build_project_context(pkg: dict) -> dict:
    if pkg["meta"].get("slug") == "points-marketplace-foundational":
        return _build_project_context_points(pkg)
    return _build_project_context_default(pkg)


def _normalize_project_context(meta: dict, pkg: dict) -> dict:
    raw = meta.get("project_context")
    if isinstance(raw, dict) and raw.get("product"):
        return raw
    return _build_project_context(pkg)


def _heuristic(
    principle: str,
    affected_because: str,
    artifact_link: str,
    *,
    before: str = "",
    after: str = "",
) -> dict:
    h = {
        "principle": principle,
        "affected_because": affected_because,
        "artifact_link": artifact_link,
    }
    if before:
        h["before"] = before
    if after:
        h["after"] = after
    return h


def compose_copy_draft(pkg: dict, *, asset_prefix: str = "..") -> dict:
    meta = pkg["meta"]
    slug = meta["slug"]
    title = meta["title"]
    res = pkg.get("resources") or {}
    quotes = res.get("quotes") or []
    insights = res.get("insights") or []
    recommendations = res.get("recommendations") or []
    artefacts = _artefact_index(pkg)

    hero_facts = _normalize_hero_facts(meta)
    project_context = _normalize_project_context(meta, pkg)
    hero_deck = (meta.get("hero_deck") or "").strip()

    if slug == "points-marketplace-foundational":
        beats = _beats_points_marketplace(pkg, quotes, insights, recommendations)
    else:
        beats = [
            {
                "id": "beat_objective",
                "section": "Objective",
                "glyph": BEAT_GLYPHS["01"],
                "step": "01",
                "title": "Objective",
                "lead": "Set the rewards mental model before we scale UI.",
                "body": (
                    "Product was ready to invest in marketplace and avatar work "
                    "without a shared earn and spend story."
                ),
                "heuristic": _heuristic(
                    "Match between system and real world",
                    "In IDIs, learners named heroes and powers—not ledger types or conversion rules the product never explained.",
                    "Wallet, avatar grid, and redeem paths in the DS-aligned stimulus (15 sessions, grades 1–8, US + IN).",
                ),
                "artefact_id": "A1",
            },
            {
                "id": "beat_problem",
                "section": "Problem",
                "glyph": BEAT_GLYPHS["02"],
                "step": "02",
                "title": "Problem",
                "subtitle": "Engagement dropped when the loop was hard to read.",
                "lead": (
                    "Platform time and class attendance fell. "
                    "Loyalty mechanics were not in the journey."
                ),
                "body": (
                    "Kids stacked points and creator coins with no clear redeem path."
                ),
                "quotes": quotes,
                "heuristic": _heuristic(
                    "Visibility of system status",
                    "After class 8, points piled up while attendance and time-on-platform fell—no visible earn or spend loop.",
                    "Synthesis tied platform decline to loyalty mechanics missing from the journey.",
                ),
                "artefact_id": "A2",
            },
            {
                "id": "beat_role_method",
                "section": "My role / Methodology",
                "glyph": BEAT_GLYPHS["03"],
                "step": "03",
                "title": "My role and methodology",
                "lead": (
                    "I led the design research flow end to end with product and engineering in the room."
                ),
                "body": (
                    "Framed the problem, built Figma stimulus on the design system, and validated "
                    "components with the team before ship. Ran 15 IDIs (US and IN, grades 1-8) and "
                    "tech checks so recommendations were feasible to build."
                ),
                "heuristic": _heuristic(
                    "Consistency and standards",
                    "Findings had to ship: product and engineering reviewed the same components used in moderated sessions.",
                    "FutureSchool design-system frames—not throwaway comps—across all 15 IDIs.",
                ),
                "artefact_id": "A3",
            },
            {
                "id": "beat_insights",
                "section": "Insights",
                "glyph": BEAT_GLYPHS["04"],
                "step": "04",
                "title": "User testing",
                "subtitle": "Testing the objective against the marketplace stimulus.",
                "lead": (
                    "Fifteen sessions. Every theme maps to a frame in Figma, not a survey row."
                ),
                "body": (
                    "HCI signal and UI evidence stay paired: what they said is what they pointed at on screen."
                ),
                "insight_bullets": insights[:4],
                "heuristic": _heuristic(
                    "Help prevent mistakes",
                    "Redemption intent was there; the UI offered no obvious next step on the marketplace surface.",
                    "Each verbatim mapped to the wallet or grid frame the learner was viewing.",
                    before="Points? nothing, i just have them, i dont know what to do with them",
                    after="Quote pinned to marketplace frame with balance visible but no redeem affordance.",
                ),
                "artefact_id": "A5",
            },
            {
                "id": "beat_recommendations",
                "section": "Recommendations",
                "glyph": BEAT_GLYPHS["05"],
                "step": "05",
                "title": "Recommendations and implementation guide",
                "lead": (
                    "One ledger, onboarding before the shop, aspiration-led avatars."
                ),
                "body": (
                    "Ship with HCI components (balance, spend path), design tokens, "
                    "UX writing guidelines, in-product comms, and a clear earn-to-spend journey."
                ),
                "implementation": [
                    "HCI: single balance, spent history, visible next action on marketplace surfaces.",
                    "Tokens: align reward states to design system color and type roles.",
                    "Guidelines: plain earn/spend copy; no parallel currency names in child UI.",
                    "Comms: onboarding modules at deploy (how to earn, how to spend).",
                    "Journey: earn in class → see balance → redeem before deeper marketplace browse.",
                ],
                "recommendation_bullets": recommendations[:4],
                "heuristic": _heuristic(
                    "Recognition rather than recall",
                    "Dual currency forced kids to invent rules (e.g. one coin equals two points) instead of reading one balance.",
                    "Recommendation: single spendable-points ledger plus earn/spend onboarding before shop exposure.",
                    before="I think 1 coin = 2 points because coins are more precious than points",
                    after="One ledger, plain language, onboarding before marketplace browse.",
                ),
                "artefact_id": "A4",
            },
        ]

    hero_bg_cfg = meta.get("hero_bg") or {}
    hero_style = hero_bg_cfg.get("style", "devices")
    desktop_id = hero_bg_cfg.get("desktop_artefact_id", "A5")
    mobile_id = hero_bg_cfg.get("mobile_artefact_id", "A1")
    desktop_art = artefacts.get(desktop_id, artefacts.get("A5", {}))
    mobile_art = artefacts.get(mobile_id, artefacts.get("A1", {}))
    desktop_src = (
        hero_bg_cfg.get("desktop_src")
        or _case_asset_src(slug, "regenerated/hero-desktop.png", asset_prefix)
        or (_artefact_src(slug, desktop_art, asset_prefix) if desktop_art else None)
    )
    mobile_src = (
        hero_bg_cfg.get("mobile_src")
        or _case_asset_src(slug, "regenerated/hero-mobile.png", asset_prefix)
        or (_artefact_src(slug, mobile_art, asset_prefix) if mobile_art else None)
    )
    frame_prefix = f"{asset_prefix}/assets/case-studies/{slug}/devices"
    hero_art_id = hero_bg_cfg.get("artefact_id", "A1")
    hero_art = artefacts.get(hero_art_id, artefacts.get("A1", {}))
    hero_src = _artefact_src(slug, hero_art, asset_prefix) if hero_art else None

    ticker_slides = _ticker_slides_for_copy(meta, slug, asset_prefix)

    hero_ab_cfg = meta.get("hero_ab") or {}
    hero_ab = {
        "enabled": hero_ab_cfg.get("enabled", False),
        "default": hero_ab_cfg.get("default", "ticker"),
        "ticker_slides": ticker_slides,
        "signoffs": hero_ab_cfg.get(
            "signoffs",
            [
                {"name": "Sally", "role": "US UX"},
                {"name": "Paige", "role": "Analyst"},
                {"name": "John", "role": "Product"},
            ],
        ),
        "decision": hero_ab_cfg.get(
            "decision", "Ship wireframe ticker hero (signed off)."
        ),
    }
    ht_meta = meta.get("hero_ticker") or {}
    hero_ticker = {
        "slides": ticker_slides,
        "inbox": str(ht_meta.get("inbox", "")),
        "macbook_frame_src": f"{asset_prefix}/assets/case-studies/{slug}/devices/macbook-pro-frame.svg",
        "signoff": ht_meta.get(
            "signoff",
            "Sally · US UX · ticker spacing & MacBook frame signed off",
        ),
        "signoffs": ht_meta.get(
            "signoffs",
            [
                {
                    "name": "Sally",
                    "role": "US UX",
                    "items": ["Ticker slide spacing", "MacBook Pro frame"],
                }
            ],
        ),
    }

    for beat in beats:
        aid = beat.get("artefact_id") or DEFAULT_BEAT_ARTEFACTS.get(beat["id"])
        art = artefacts.get(aid, {})
        image_src = _artefact_src(slug, art, asset_prefix)
        beat["artefact"] = {
            "id": aid,
            "kind": art.get("kind", "artefact"),
            "file_label": _file_label(art.get("path", "")),
            "caption": art.get("caption") or art.get("description", ""),
            "image_src": image_src,
            "image_alt": art.get("alt") or beat["title"],
        }
        if image_src and "/for-card/" in image_src:
            gi = {
                "src": image_src,
                "alt": beat["artefact"]["image_alt"],
            }
            if "beat-role" not in image_src:
                gi["variant"] = "portrait"
            beat["gallery_image"] = gi

    meta_description = (
        f"{title} Enterprise field-service UX for AI-assisted diagnosis, "
        "parts ordering, and first-time resolution on the truck."
        if slug == "hp-field-service-ai"
        else (
            f"{title} Foundational UX on a K-8 rewards marketplace—design-system "
            "stimulus, moderated testing, and shippable earn-and-spend decisions."
            if slug == "points-marketplace-foundational"
            else (
                f"{title} Foundational UX research on why loyalty mechanics failed "
                "and what earn-and-spend should mean for a K-8 math platform."
            )
        )
    )

    return {
        "slug": slug,
        "version": 14,
        "hero_bg": {
            "style": hero_style
            if hero_style == "ticker" and ticker_slides
            else (
                hero_style
                if (hero_style == "devices" and desktop_src and mobile_src)
                or (hero_style == "showcase" and hero_src)
                else ("ticker" if ticker_slides else ("devices" if desktop_src and mobile_src else "paper"))
            ),
            "desktop_src": desktop_src,
            "mobile_src": mobile_src,
            "laptop_frame_src": f"{frame_prefix}/macbook-frame.svg",
            "macbook_frame_src": f"{frame_prefix}/macbook-pro-frame.svg",
            "phone_frame_src": f"{frame_prefix}/iphone-frame.svg",
            "desktop_artefact_id": desktop_id,
            "mobile_artefact_id": mobile_id,
            "desktop_alt": desktop_art.get("alt") or "Byju's FutureSchool · desktop marketplace UI",
            "mobile_alt": mobile_art.get("alt") or "Byju's FutureSchool · mobile earn UI",
            "src": hero_src,
            "artefact_id": hero_art_id,
            "alt": hero_art.get("alt")
            or "Marketplace and rewards stimulus used in foundational interviews",
            "caption": hero_art.get("caption") or "Figma reference · earn-and-spend exploration",
        },
        "hero_deck": hero_deck,
        "meta_description": meta_description,
        "hero_facts": hero_facts,
        "hero_ab": hero_ab,
        "hero_ticker": hero_ticker,
        "project_context": project_context,
        "scan": {
            "beats": beats,
            "exec_summary": _build_exec_paragraph(pkg),
            "programme_detail": _programme_detail_blocks(pkg),
        },
        "depth_cta": {"label": "Executive summary", "href": "#case-exec-collapse"},
        "secondary_cta": {
            "label": "Book a call",
            "href": "mailto:hello@example.com?subject=Earn-and-spend%20UX%20research",
        },
    }


def _programme_detail_blocks(pkg: dict) -> dict:
    res = pkg.get("resources") or {}
    return {
        "context": res.get("objective_notes", ""),
        "role": res.get("role_context", ""),
        "method": res.get("method_notes", ""),
        "quotes": res.get("quotes") or [],
        "insights": res.get("insights") or [],
        "recommendations": res.get("recommendations") or [],
    }


def _build_exec_paragraph(pkg: dict) -> str:
    res = pkg.get("resources") or {}
    rec = (res.get("recommendations") or [""])[0]
    insight = (res.get("insights") or [""])[0]
    text = (
        "Foundational UX research for a math learning platform rewards program. "
        "Platform time and attendance were down. Loyalty mechanics were unclear. "
        "I led Figma stimulus, 15 IDIs (US and IN, grades 1-8), and synthesis. "
        f"Key finding: {insight.rstrip('.')}. "
        "Direction: one ledger with onboarding for earn and spend. "
        f"Primary recommendation: {rec.rstrip('.')}."
    )
    words = text.split()
    if len(words) > 180:
        return " ".join(words[:178]) + "…"
    return text


def load_copy(path: Path | str) -> dict:
    with Path(path).open(encoding="utf-8") as f:
        return json.load(f)


def scan_word_count(copy: dict) -> int:
    words = []
    for beat in (copy.get("scan") or {}).get("beats") or []:
        words.extend(str(beat.get("lead", "")).split())
        words.extend(str(beat.get("body", "")).split())
        for q in beat.get("quotes") or []:
            words.extend(str(q).split())
    return len(words)

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from .paths import ROOT, SCHEMA_PATH
from .youtube import parse_youtube_video_id

REQUIRED_TOP = ("meta", "narrative", "resources", "artefacts", "metrics", "voice", "media", "approvals")
REQUIRED_META = ("title", "client_safe_name", "slug")
PLACEMENTS = frozenset(
    {
        "scan_hero",
        "scan_beat_2",
        "scan_beat_4",
        "scan_beat_6",
        "depth_method",
        "appendix",
    }
)
CONSENT_TYPES = frozenset({"owned", "third_party_reference"})


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def default_approvals() -> dict:
    draft = {"status": "draft", "approved_by": "", "approved_at": ""}
    return {"copy": dict(draft), "design": dict(draft), "po": dict(draft)}


def default_media() -> dict:
    return {"youtube": []}


def ensure_package_shape(pkg: dict) -> dict:
    pkg.setdefault("media", default_media())
    pkg.setdefault("approvals", default_approvals())
    meta = pkg.setdefault("meta", {})
    for key in REQUIRED_META:
        meta.setdefault(key, "")
    if not meta.get("depth_href"):
        meta["depth_href"] = f"../_bmad-output/case-studies/{meta.get('slug', 'case')}-longform.md"
    return pkg


def infer_study_type(pkg: dict) -> None:
    meta = pkg.setdefault("meta", {})
    if meta.get("study_type"):
        meta.setdefault("study_type_inferred", meta["study_type"])
        meta.setdefault("study_type_confidence", meta.get("study_type_confidence") or 0.85)
        return
    text = " ".join(
        [
            meta.get("title", ""),
            (pkg.get("resources") or {}).get("objective_notes", ""),
            " ".join((pkg.get("resources") or {}).get("constraints") or []),
        ]
    ).lower()
    if any(k in text for k in ("compliance", "regulated", "audit", "clinical", "healthcare")):
        inferred = "enterprise-regulated"
    elif any(k in text for k in ("foundational", "research", "interview", "idi")):
        inferred = "foundational-research"
    elif any(k in text for k in ("marketplace", "learner", "retention", "grades", "consumer")):
        inferred = "scale-consumer"
    elif any(k in text for k in ("ai", "field", "agent")):
        inferred = "ai-field"
    else:
        inferred = "scale-consumer"
    meta["study_type_inferred"] = inferred
    meta["study_type"] = inferred
    meta["study_type_confidence"] = meta.get("study_type_confidence") or 0.75


def normalize_youtube(pkg: dict) -> list[str]:
    errors: list[str] = []
    media = pkg.setdefault("media", default_media())
    youtube = media.setdefault("youtube", [])
    scan_above_fold = 0
    for entry in youtube:
        url = entry.get("url") or entry.get("video_id") or ""
        vid = parse_youtube_video_id(url)
        if not vid:
            errors.append(f"YouTube {entry.get('id', '?')}: invalid URL {url!r}")
            continue
        entry["video_id"] = vid
        placement = entry.get("placement", "appendix")
        if placement in ("scan_hero", "scan_beat_2", "scan_beat_4"):
            scan_above_fold += 1
        if entry.get("consent") not in CONSENT_TYPES:
            entry["consent"] = "third_party_reference"
        entry.setdefault("start_seconds", 0)
    if len(youtube) > 3:
        errors.append(f"YouTube: max 3 per case (found {len(youtube)})")
    if scan_above_fold > 1:
        errors.append(f"YouTube: max 1 above-fold on scan (found {scan_above_fold})")
    return errors


def hash_asset(path: Path) -> str | None:
    if not path.is_file():
        return None
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()[:16]


def validate_artefacts(pkg: dict) -> list[str]:
    errors: list[str] = []
    slug = pkg.get("meta", {}).get("slug", "")
    for artefact in pkg.get("artefacts") or []:
        rel = artefact.get("path")
        if not rel:
            continue
        candidate = Path(rel)
        if not candidate.is_absolute():
            candidate = ROOT / "assets" / "case-studies" / slug / rel
        if not candidate.is_file():
            errors.append(f"Artefact {artefact.get('id')}: missing file {candidate}")
        else:
            artefact["sha256_prefix"] = hash_asset(candidate)
    return errors


def validate_package(pkg: dict) -> list[str]:
    errors: list[str] = []
    for key in REQUIRED_TOP:
        if key not in pkg:
            errors.append(f"Missing top-level key: {key}")
    meta = pkg.get("meta") or {}
    for key in REQUIRED_META:
        if not meta.get(key):
            errors.append(f"meta.{key} is required")
    claims = (pkg.get("narrative") or {}).get("claims") or []
    if not claims:
        errors.append("narrative.claims must not be empty")
    errors.extend(normalize_youtube(pkg))
    errors.extend(validate_artefacts(pkg))
    for entry in (pkg.get("media") or {}).get("youtube") or []:
        if not entry.get("title"):
            errors.append(f"YouTube {entry.get('id')}: title required")
        if not entry.get("caption"):
            errors.append(f"YouTube {entry.get('id')}: caption required")
        placement = entry.get("placement", "")
        if placement and placement not in PLACEMENTS:
            errors.append(f"YouTube {entry.get('id')}: unknown placement {placement}")
    return errors


def approvals_ready(pkg: dict) -> tuple[bool, list[str]]:
    approvals = pkg.get("approvals") or {}
    missing = []
    for gate in ("copy", "design", "po"):
        status = (approvals.get(gate) or {}).get("status")
        if status != "approved":
            missing.append(gate)
    return (len(missing) == 0, missing)


PROOF_MAP = {
    "method_steps": lambda p: bool((p.get("resources") or {}).get("method_notes")),
    "artefact_validation": lambda p: len(p.get("artefacts") or []) >= 2,
    "decision_tradeoff": lambda p: len((p.get("resources") or {}).get("recommendations") or []) >= 2,
    "metric_pair": lambda p: len(p.get("metrics") or []) >= 2,
}


def validate_narrative(pkg: dict) -> list[dict]:
    rows = []
    for claim in (pkg.get("narrative") or {}).get("claims") or []:
        cid = claim.get("id", "?")
        expectations = claim.get("proof_expectations") or []
        missing = [e for e in expectations if e in PROOF_MAP and not PROOF_MAP[e](pkg)]
        status = "pass" if not missing else ("weak" if len(missing) < len(expectations) else "missing")
        rows.append(
            {
                "claim_id": cid,
                "statement": claim.get("statement"),
                "status": status,
                "missing_proof": missing,
                "artefacts": [
                    a["id"]
                    for a in pkg.get("artefacts") or []
                    if cid in (a.get("linked_claim_ids") or [])
                ],
            }
        )
    return rows


def feed_package(pkg: dict) -> tuple[dict, list[str]]:
    pkg = ensure_package_shape(pkg)
    infer_study_type(pkg)
    errors = validate_package(pkg)
    return pkg, errors

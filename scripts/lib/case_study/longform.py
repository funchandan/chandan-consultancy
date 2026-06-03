from __future__ import annotations


def generate_longform_md(pkg: dict, validation: list[dict]) -> str:
    meta = pkg["meta"]
    res = pkg.get("resources") or {}
    lines = [
        f"# {meta['title']}",
        "",
        f"**Client:** {meta.get('client_safe_name', '')}  ",
        f"**Study type:** {meta.get('study_type', '')} (confidence {meta.get('study_type_confidence', 'n/a')})  ",
        f"**Timeline:** {meta.get('timeline', '')}  ",
        "",
        "## Context",
        "",
        res.get("objective_notes", ""),
        "",
        f"**My role:** {res.get('role_context', '')}",
        "",
        "### Constraints",
        "",
    ]
    for c in res.get("constraints") or []:
        lines.append(f"- {c}")
    lines += ["", "## Methodology", "", res.get("method_notes", ""), "", "## Observations", ""]
    for q in res.get("quotes") or []:
        lines.append(f"> {q}")
        lines.append("")
    lines += ["## Insights", ""]
    for i in res.get("insights") or []:
        lines.append(f"- {i}")
    lines += ["", "## Recommendations", ""]
    for r in res.get("recommendations") or []:
        lines.append(f"- {r}")
    lines += ["", "## Metrics", ""]
    for m in pkg.get("metrics") or []:
        tag = m.get("verification", "directional")
        lines.append(
            f"- **{m.get('label', '')}:** {m.get('value', '')} `{tag}`"
            + (f" (baseline: {m['baseline']})" if m.get("baseline") else "")
        )
    lines += [
        "",
        "## Narrative validation",
        "",
        "| Claim | Status | Missing proof | Artefacts |",
        "|-------|--------|---------------|-----------|",
    ]
    for row in validation:
        lines.append(
            f"| {row['claim_id']} | {row['status']} | {', '.join(row['missing_proof']) or '—'} | {', '.join(row['artefacts']) or '—'} |"
        )
    lines += ["", "## Artefact index", ""]
    for a in pkg.get("artefacts") or []:
        lines.append(f"- **{a['id']}** ({a.get('kind')}): {a.get('description', '')}")
    return "\n".join(lines) + "\n"

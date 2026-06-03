#!/usr/bin/env python3
"""Patch hero project-context bento tiles into promoted case study HTML."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))

from case_study.copy_compose import load_copy  # noqa: E402
from case_study.paths import OUT_DIR, PROMOTED_DIR  # noqa: E402
from case_study.render import (  # noqa: E402
    _detail_icon_html,
    _tool_icon_html,
    html_esc,
    render_project_context_html,
)

MARKER = '<section class="case-project-context"'


def _render_bento(copy: dict) -> str:
    ctx = copy["project_context"]
    product = ctx["product"]
    details = ctx.get("details") or []
    narrative = ctx.get("narrative") or []
    impact = ctx.get("impact") or {}

    detail_rows: list[str] = []
    for row in details:
        if row.get("type") == "toolstack":
            tools = row.get("tools") or []
            items = "".join(
                f'                <li class="case-project-context__tool"><span class="case-project-context__tool-icon" role="img" aria-label="{html_esc(t.get("name", ""))}">{_tool_icon_html(t.get("id", ""))}</span></li>\n'
                for t in tools
            )
            detail_rows.append(
                f"""            <div class="case-project-context__detail-item case-project-context__detail-item--stack">
              <span class="case-project-context__detail-label">{html_esc(row.get("label", "Tech stack"))}</span>
              <ul class="case-project-context__tool-row">
{items}              </ul>
            </div>"""
            )
            continue
        detail_rows.append(
            f"""            <div class="case-project-context__detail-item">
              <span class="case-project-context__detail-icon" aria-hidden="true">{_detail_icon_html(row.get("icon", ""))}</span>
              <div class="case-project-context__detail-copy">
                <span class="case-project-context__detail-text">{html_esc(row.get("text", row.get("value", "")))}</span>
                <span class="case-project-context__detail-label">{html_esc(row.get("label", ""))}</span>
              </div>
            </div>"""
        )

    signoff = ctx.get("details_approved_by", "")
    signoff_html = (
        f'              <p class="case-project-context__detail-signoff">{html_esc(signoff)}</p>\n'
        if signoff
        else ""
    )

    narrative_html = []
    for block in narrative:
        narrative_html.append(
            f"""              <div class="case-project-context__narrative-block">
                <h3 class="case-project-context__card-title">{html_esc(block.get("title", ""))} <em class="case-project-context__card-em">{html_esc(block.get("subtitle", ""))}</em></h3>
                <p class="case-project-context__card-body">{html_esc(block.get("body", ""))}</p>
              </div>"""
        )

    metrics = []
    for m in (impact.get("metrics") or [])[:3]:
        metrics.append(
            f"""          <div class="case-project-context__impact-col">
            <p class="case-project-context__impact-value">{html_esc(m.get("value", ""))}</p>
            <p class="case-project-context__impact-title">{html_esc(m.get("title", ""))}</p>
            <p class="case-project-context__impact-caption">{html_esc(m.get("caption", ""))}</p>
          </div>"""
        )

    pl = html_esc(product.get("label", "Product"))
    pn = html_esc(product.get("name", ""))
    it = html_esc(impact.get("title", "Impact"))

    return f"""        <section class="case-project-context" aria-label="Project context">
          <div class="case-project-context__grid">
            <article class="case-project-context__card case-project-context__card--product">
              <h2 class="case-project-context__card-title">{pl} <em class="case-project-context__card-em">{pn}</em></h2>
              <p class="case-project-context__card-body">{html_esc(product.get("description", ""))}</p>
            </article>
            <article class="case-project-context__card case-project-context__card--details">
              <h2 class="case-project-context__card-title">Details</h2>
              <div class="case-project-context__detail-list">
{chr(10).join(detail_rows)}{signoff_html}              </div>
            </article>
            <article class="case-project-context__card case-project-context__card--narrative">
{chr(10).join(narrative_html)}            </article>
            <article class="case-project-context__card case-project-context__card--impact">
              <h2 class="case-project-context__card-title">{it}</h2>
              <div class="case-project-context__impact-row">
{chr(10).join(metrics)}
              </div>
            </article>
          </motion.div>
        </section>
""".replace("<motion.div", "<div").replace("</motion.div>", "</div>")


def patch(slug: str) -> None:
    copy_path = OUT_DIR / f"{slug}-copy-approved.json"
    copy = load_copy(copy_path)
    ctx = copy.setdefault("project_context", {})
    for row in ctx.get("details") or []:
        if row.get("label") == "role":
            row["text"] = "User Experience Lead"
        if row.get("label") == "duration":
            row["text"] = "8 weeks"
    copy_path.write_text(json.dumps(copy, indent=2) + "\n", encoding="utf-8")

    html_path = PROMOTED_DIR / f"{slug}.html"
    html = html_path.read_text(encoding="utf-8")
    start = html.find(MARKER)
    if start < 0:
        raise SystemExit(f"No project context in {html_path}")
    end = html.find("</section>", start) + len("</section>")
    html_path.write_text(html[:start] + _render_bento(copy).strip() + html[end:], encoding="utf-8")
    print(f"Patched hero bento → {html_path.relative_to(ROOT)}")


def main() -> int:
    for slug in sys.argv[1:] or ["points-marketplace-foundational"]:
        patch(slug)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

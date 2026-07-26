from __future__ import annotations

from html import escape

from .paths import TEMPLATES_DIR
from .youtube import embed_src, poster_url, watch_url


def html_esc(s: str) -> str:
    return escape(s or "", quote=True)


def verification_tag(verification: str | None) -> str:
    if not verification or verification == "verified":
        return ""
    label = verification.replace("-", " ")
    return (
        f' <span class="case-scan-tag" data-verification="{html_esc(verification)}">'
        f"({html_esc(label)})</span>"
    )


def render_heuristic_html(
    heuristic: dict | None, *, variant: str = "default", include_shift: bool = True
) -> str:
    if not heuristic:
        return ""
    principle = html_esc(heuristic.get("principle") or heuristic.get("name", ""))
    affected = html_esc(heuristic.get("affected_because", ""))
    artifact = html_esc(heuristic.get("artifact_link", ""))
    before = heuristic.get("before")
    after = heuristic.get("after")

    if variant == "glass":
        shift = ""
        if include_shift and before and after:
            shift = (
                f'<p class="case-scan-story__heuristic-shift">'
                f"{html_esc(before)} → {html_esc(after)}</p>"
            )
        return f"""          <aside class="case-scan-story__heuristic case-scan-story__heuristic--glass" aria-label="Design lens: {principle}">
            <p class="case-scan-story__heuristic-kicker">Design lens</p>
            <p class="case-scan-story__heuristic-name">{principle}</p>
            <p class="case-scan-story__heuristic-line">{affected}</p>
            <p class="case-scan-story__heuristic-line case-scan-story__heuristic-line--muted">{artifact}</p>
{shift}          </aside>
"""

    before_after = ""
    if before and after:
        before_after = f"""                <dt>Before</dt>
                <dd>{html_esc(before)}</dd>
                <dt>After</dt>
                <dd>{html_esc(after)}</dd>
"""
    return f"""          <aside class="case-scan-story__heuristic" aria-label="Design lens: {principle}">
            <div class="case-scan-story__heuristic-mark" aria-hidden="true"></div>
            <div class="case-scan-story__heuristic-content">
              <p class="case-scan-story__heuristic-kicker">Design lens</p>
              <p class="case-scan-story__heuristic-name">{principle}</p>
              <dl class="case-scan-story__heuristic-meta">
                <dt>Why it breaks</dt>
                <dd>{affected}</dd>
                <dt>On this artefact</dt>
                <dd>{artifact}</dd>
{before_after}              </dl>
            </div>
          </aside>
"""


def _beat_extra_html(beat: dict) -> str:
    out = []
    if beat.get("quotes") and beat.get("id") == "beat_problem":
        items = "".join(
            f'              <li class="case-card-gallery__learner-quote">{html_esc(q)}</li>\n'
            for q in beat["quotes"][:2]
        )
        out.append(
            f'              <ul class="case-card-gallery__learner-quotes" aria-label="Learner quotes">\n{items}              </ul>\n'
        )
    if beat.get("insight_bullets"):
        limit = 3 if beat.get("id") == "beat_insights" else len(beat["insight_bullets"])
        items = "".join(f"<li>{html_esc(x)}</li>" for x in beat["insight_bullets"][:limit])
        out.append(
            f'          <ul class="case-scan-story__bullets" aria-label="Themes">\n{items}          </ul>\n'
        )
    if beat.get("id") == "beat_recommendations" and beat.get("implementation"):
        impl = "".join(f"<li>{html_esc(x)}</li>" for x in beat["implementation"][:2])
        rec = "".join(
            f"<li>{html_esc(x)}</li>" for x in (beat.get("recommendation_bullets") or [])[:2]
        )
        out.append(
            f"""          <h3 class="case-scan-story__subhead">Implementation guide</h3>
          <ul class="case-scan-story__impl">{impl}</ul>
          <h3 class="case-scan-story__subhead">Recommendations</h3>
          <ul class="case-scan-story__recs">{rec}</ul>
"""
        )
    return "".join(out)


def render_hero_facts_html(copy: dict) -> str:
    facts = copy.get("hero_facts") or []
    rows = []
    for f in facts:
        if f.get("label"):
            rows.append(
                '      <div class="case-meta-facts__pair">'
                f"<dt>{html_esc(f['label'])}</dt>"
                f"<dd>{html_esc(f.get('value', ''))}</dd></div>"
            )
    if not rows:
        return ""
    return "      <dl class=\"case-meta-facts\">\n" + "\n".join(rows) + "\n      </dl>"


def _detail_icon_html(icon_id: str) -> str:
    icons = {
        "platform": (
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">'
            '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 20h8"/></svg>'
        ),
        "role": (
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">'
            '<circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>'
        ),
        "team": (
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">'
            '<path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 10 0"/></svg>'
        ),
        "calendar": (
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">'
            '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/></svg>'
        ),
    }
    return icons.get(icon_id, icons["platform"])


def _simpleicon_img(slug: str, color: str, *, size: int = 22) -> str:
    return (
        f'<img class="case-project-context__tool-logo" '
        f'src="https://cdn.simpleicons.org/{slug}/{color}" '
        f'width="{size}" height="{size}" alt="" loading="lazy" decoding="async" />'
    )


def _tool_icon_html(tool_id: str) -> str:
    key = (tool_id or "").strip().lower().replace("_", "-")
    cdn = {
        "react": ("react", "61DAFB"),
        "miro": ("miro", "050038"),
    }
    if key in cdn:
        slug, color = cdn[key]
        return _simpleicon_img(slug, color)

    icons = {
        "figma": (
            '<svg width="24" height="24" viewBox="0 0 38 57" aria-hidden="true">'
            '<path fill="#1ABCFE" d="M19 28.5c0-5.2 4.2-9.5 9.5-9.5S38 23.3 38 28.5 33.8 38 28.5 38 19 33.7 19 28.5z"/>'
            '<path fill="#0ACF83" d="M0 47.5C0 42.3 4.2 38 9.5 38H19v9.5c0 5.2-4.2 9.5-9.5 9.5S0 52.7 0 47.5z"/>'
            '<path fill="#FF7262" d="M0 28.5C0 23.3 4.2 19 9.5 19H19v9.5H9.5C4.2 28.5 0 28.5 0 28.5z"/>'
            '<path fill="#F24E1E" d="M0 9.5C0 4.2 4.2 0 9.5 0H19v19H9.5C4.2 19 0 14.8 0 9.5z"/>'
            '<path fill="#A259FF" d="M19 0h9.5C33.8 0 38 4.2 38 9.5S33.8 19 28.5 19H19V0z"/>'
            "</svg>"
        ),
        "modeln": (
            '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">'
            '<rect width="24" height="24" rx="6" fill="#003B71"/>'
            '<path fill="#8DC63F" d="M6.5 17V7h2.4l3.1 5.8L14.1 7H16.5v10h-2.1V11.4l-2.8 5.1h-1.4l-2.8-5.1V17H6.5z"/>'
            "</svg>"
        ),
        "azure-devops": (
            '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">'
            '<path fill="#0078D4" d="M0 8.877 2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z"/>'
            "</svg>"
        ),
        "devops": (
            '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">'
            '<path fill="#0078D4" d="M0 8.877 2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z"/>'
            "</svg>"
        ),
        "typescript": _simpleicon_img("typescript", "3178C6"),
        "postman": _simpleicon_img("postman", "FF6C37"),
        "react-native": (
            '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">'
            '<circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>'
            '<ellipse cx="12" cy="12" rx="10" ry="3.6" fill="none" stroke="#61DAFB" stroke-width="1.1"/>'
            '<ellipse cx="12" cy="12" rx="10" ry="3.6" fill="none" stroke="#61DAFB" stroke-width="1.1" transform="rotate(60 12 12)"/>'
            '<ellipse cx="12" cy="12" rx="10" ry="3.6" fill="none" stroke="#61DAFB" stroke-width="1.1" transform="rotate(120 12 12)"/>'
            '<rect x="15.5" y="14.5" width="6" height="8" rx="1.4" fill="none" stroke="#61DAFB" stroke-width="1.1"/>'
            "</svg>"
        ),
    }
    return icons.get(key, _simpleicon_img("react", "61DAFB"))


def render_project_context_html(copy: dict) -> str:
    ctx = copy.get("project_context")
    if not ctx or not ctx.get("product"):
        return (
            '        <div class="case-hero-facts case-scan-hero-facts" aria-label="Project summary">\n'
            + render_hero_facts_html(copy)
            + "        </div>\n"
        )

    product = ctx["product"]
    details = ctx.get("details") or []
    narrative = list(ctx.get("narrative") or [])
    if not narrative:
        if ctx.get("problem"):
            narrative.append(ctx["problem"])
        if ctx.get("solution"):
            narrative.append(ctx["solution"])
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

    impact_metrics = []
    for m in (impact.get("metrics") or [])[:3]:
        impact_metrics.append(
            f"""          <div class="case-project-context__impact-col">
            <p class="case-project-context__impact-value">{html_esc(m.get("value", ""))}</p>
            <p class="case-project-context__impact-title">{html_esc(m.get("title", ""))}</p>
            <p class="case-project-context__impact-caption">{html_esc(m.get("caption", ""))}</p>
          </div>"""
        )

    impact_title = html_esc(impact.get("title", "Impact"))
    product_label = html_esc(product.get("label", "Product"))
    product_name = html_esc(product.get("name", ""))

    return f"""        <section class="case-project-context" aria-label="Project context">
          <div class="case-project-context__grid">
            <article class="case-project-context__card case-project-context__card--product">
              <h2 class="case-project-context__card-title">{product_label} <em class="case-project-context__card-em">{product_name}</em></h2>
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
              <h2 class="case-project-context__card-title">{impact_title}</h2>
              <div class="case-project-context__impact-row">
{chr(10).join(impact_metrics)}
              </div>
            </article>
          </div>
        </section>
"""


def render_youtube_figure(entry: dict, *, compact: bool = False) -> str:
    vid = entry.get("video_id")
    if not vid:
        return ""
    title = html_esc(entry.get("title", "Video"))
    caption = html_esc(entry.get("caption", ""))
    start = int(entry.get("start_seconds") or 0)
    src = embed_src(vid, start)
    watch = html_esc(watch_url(vid, start))
    poster = html_esc(poster_url(vid))
    mod = " case-media--compact" if compact else ""
    return f"""        <figure class="case-media case-media--youtube{mod}" data-video-id="{html_esc(vid)}">
          <div class="case-media__responsive case-media__responsive--iframe">
          <iframe title="{title}" src="{html_esc(src)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
          </div>
          <div class="case-media__reduced-motion">
            <a class="case-media__poster-link" href="{watch}"><img src="{poster}" alt="" width="480" height="360" loading="lazy" /><span class="case-media__play-label">Play on YouTube</span></a>
          </div>
          <figcaption>{caption} · <span class="case-scan-tag" data-verification="reference">reference</span></figcaption>
        </figure>
"""


def _fix_yt(html: str) -> str:
    return html


def youtube_for_placement(pkg: dict, placement: str, *, compact: bool = False) -> str:
    for entry in (pkg.get("media") or {}).get("youtube") or []:
        if entry.get("placement") == placement:
            return _fix_yt(render_youtube_figure(entry, compact=compact))
    return ""


def _crop_frame_class(crop: str | None) -> str:
    if crop == "marketplace-profile":
        return " case-scan-story__artefact-frame--crop-marketplace"
    if crop == "retention-signals":
        return " case-scan-story__artefact-frame--crop-retention"
    return ""


def _artefact_media_html(art: dict) -> str:
    src = art.get("image_src")
    file_label = html_esc(art.get("file_label", "Figma wireframe"))
    if src:
        return f"""            <img class="case-scan-story__img" src="{html_esc(src)}" alt="{html_esc(art.get('image_alt', ''))}" loading="lazy" decoding="async" />"""
    return f"""            <div class="case-scan-story__placeholder" aria-hidden="true">
              <span class="case-scan-story__placeholder-grid"></span>
              <span class="case-scan-story__placeholder-label">{file_label}</span>
            </div>"""


def render_gallery_wireframe_html(beat: dict, art: dict) -> str:
    """One study wireframe — flat on glass, no nested frame or caption."""
    gallery = beat.get("gallery_image") or {}
    src = gallery.get("src") or art.get("image_src")
    alt = html_esc(gallery.get("alt") or art.get("image_alt", ""))
    crop_cls = _crop_frame_class(beat.get("artefact_crop"))

    if not src:
        return _artefact_media_html(art)

    crop_mod = ""
    if "crop-marketplace" in crop_cls:
        crop_mod = " case-card-gallery__wireframe-img--crop-marketplace"
    elif "crop-retention" in crop_cls:
        crop_mod = " case-card-gallery__wireframe-img--crop-retention"
    if gallery.get("variant") == "portrait":
        crop_mod += " case-card-gallery__wireframe-img--portrait"

    return (
        f'              <img class="case-card-gallery__wireframe-img{crop_mod}" '
        f'src="{html_esc(src)}" alt="{alt}" loading="lazy" decoding="async" />'
    )


def _ticker_slides(copy: dict) -> list:
    ht = copy.get("hero_ticker") or {}
    if ht.get("slides"):
        return ht["slides"]
    ab = copy.get("hero_ab") or {}
    return ab.get("ticker_slides") or []


def _macbook_frame_src(copy: dict, slide: dict) -> str:
    ht = copy.get("hero_ticker") or {}
    if slide.get("frame_src"):
        return slide["frame_src"]
    if ht.get("macbook_frame_src"):
        return ht["macbook_frame_src"]
    bg = copy.get("hero_bg") or {}
    slug = copy.get("slug", "")
    return bg.get("macbook_frame_src") or bg.get(
        "laptop_frame_src",
        f"../assets/case-studies/{slug}/devices/macbook-pro-frame.svg",
    )


def _render_ticker_slide_html(slide: dict, copy: dict) -> str:
    src = html_esc(slide.get("src", ""))
    alt = html_esc(slide.get("alt") or slide.get("label") or "Wireframe")
    srcset = slide.get("srcset")
    srcset_attr = f' srcset="{html_esc(srcset)}"' if srcset else ""
    w = slide.get("width")
    h = slide.get("height")
    dim_attr = ""
    if w and h:
        dim_attr = f' width="{html_esc(str(w))}" height="{html_esc(str(h))}"'
    layout = slide.get("layout") or slide.get("orientation")
    slide_class = "case-hero-ticker__slide"
    stage_class = "case-hero-ticker__stage"
    img_class = "case-hero-ticker__img"
    if layout == "landscape":
        slide_class += " case-hero-ticker__slide--landscape"
        stage_class += " case-hero-ticker__stage--landscape"
        img_class += " case-hero-ticker__img--landscape"
        frame = html_esc(_macbook_frame_src(copy, slide))
        visual = f"""                <motion.div class="case-hero-ticker__macbook">
                  <motion.div class="case-hero-ticker__macbook-screen">
                    <img class="{img_class}" src="{src}"{srcset_attr}{dim_attr} alt="{alt}" loading="lazy" decoding="async" />
                  </motion.div>
                  <img class="case-hero-ticker__macbook-bezel" src="{frame}" alt="" width="1200" height="740" decoding="async" />
                </motion.div>"""
        visual = visual.replace("<motion.div", "<div").replace("</motion.div>", "</div>")
    else:
        visual = f"""                <img class="{img_class}" src="{src}"{srcset_attr}{dim_attr} alt="{alt}" loading="lazy" decoding="async" />"""
    return f"""            <figure class="{slide_class}">
              <div class="{stage_class}">
{visual}
              </div>
            </figure>"""


def render_hero_ticker_html(copy: dict) -> str:
    slides = _ticker_slides(copy)
    if not slides:
        return ""
    items = [_render_ticker_slide_html(slide, copy) for slide in slides * 2]
    ht = copy.get("hero_ticker") or {}
    signoff = (ht.get("signoff") or "").strip()
    signoff_html = (
        f'          <p class="case-hero-ticker__signoff">{html_esc(signoff)}</p>\n'
        if signoff
        else ""
    )
    return f"""        <div class="case-hero-ticker" data-hero-ticker>
          <div class="case-hero-ticker__track" data-hero-ticker-track>
{chr(10).join(items)}
          </div>
{signoff_html}        </div>"""


def render_hero_ab_html(copy: dict, bg: dict) -> str:
    ab = copy.get("hero_ab") or {}
    if not ab.get("enabled"):
        return render_hero_devices_html(bg)

    devices = render_hero_devices_html(bg)
    ticker = render_hero_ticker_html(copy)
    if not devices:
        return ticker
    default_raw = ab.get("default", "devices")
    default = html_esc(default_raw)
    signoffs = ab.get("signoffs") or []
    signoff_text = " · ".join(
        f"{html_esc(s.get('name', ''))} ({html_esc(s.get('role', ''))})" for s in signoffs
    )
    pending = html_esc(ab.get("decision_pending", ""))
    ticker_panel = (
        f'        <div class="case-hero-ab__panel" data-hero-panel="ticker" hidden>\n{ticker}        </div>\n'
        if ticker
        else ""
    )
    devices_selected = "true" if default_raw == "devices" else "false"
    ticker_selected = "true" if default_raw == "ticker" else "false"
    devices_hidden = "" if default_raw == "devices" else " hidden"
    return f"""        <div class="case-hero-ab" data-hero-ab data-hero-default="{default}">
          <div class="case-hero-ab__chrome">
            <p class="case-hero-ab__eyebrow">Hero A/B review</p>
            <div class="case-hero-ab__toggle" role="tablist" aria-label="Hero layout variant">
              <button type="button" class="case-hero-ab__btn" role="tab" data-hero-variant="devices" aria-selected="{devices_selected}">A · Device stack</button>
              <button type="button" class="case-hero-ab__btn" role="tab" data-hero-variant="ticker" aria-selected="{ticker_selected}">B · Wireframe ticker</button>
            </div>
            <p class="case-hero-ab__hint">B pauses on hover · resumes when pointer leaves</p>
            <p class="case-hero-ab__signoff">{signoff_text} · Pending: {pending}</p>
          </div>
          <div class="case-hero-ab__panel" data-hero-panel="devices"{devices_hidden}>
{devices}          </div>
{ticker_panel}        </div>"""


def render_hero_devices_html(bg: dict) -> str:
    desktop = html_esc(bg.get("desktop_src", ""))
    mobile = html_esc(bg.get("mobile_src", ""))
    if not desktop or not mobile:
        return ""
    desktop_alt = html_esc(bg.get("desktop_alt", "Desktop product UI"))
    mobile_alt = html_esc(bg.get("mobile_alt", "Mobile product UI"))
    return f"""        <div class="case-scan-hero__visual" role="group" aria-label="Product UI on desktop and mobile">
          <figure class="case-scan-hero__device case-scan-hero__device--desktop">
            <div class="case-scan-story__artefact-frame case-scan-hero__device-frame">
              <img class="case-scan-story__img" src="{desktop}" alt="{desktop_alt}" loading="eager" decoding="async" />
            </div>
          </figure>
          <figure class="case-scan-hero__device case-scan-hero__device--phone">
            <div class="case-scan-story__artefact-frame case-scan-hero__device-frame">
              <img class="case-scan-story__img" src="{mobile}" alt="{mobile_alt}" loading="eager" decoding="async" />
            </div>
          </figure>
        </div>"""


def render_hero_html(copy: dict, page_title: str) -> str:
    bg = copy.get("hero_bg") or {}
    style = bg.get("style", "paper")
    src = bg.get("src")
    project_context = render_project_context_html(copy)
    title = html_esc(page_title)
    deck = (copy.get("hero_deck") or "").strip()
    has_context = bool((copy.get("project_context") or {}).get("product"))
    show_deck = deck and (not has_context or style in ("devices", "ticker"))
    deck_html = (
        f'        <p class="case-scan-hero__deck">{html_esc(deck)}</p>\n' if show_deck else ""
    )
    ticker_html = render_hero_ticker_html(copy)
    if style == "ticker" and ticker_html:
        return f"""    <header class="case-scan-hero case-scan-hero--paper case-scan-hero--ticker">
      <div class="case-scan-hero__content shell">
        <div class="case-scan-hero__masthead case-scan-hero__masthead--ticker">
          <div class="case-scan-hero__masthead-copy">
            <h1 class="case-scan-hero__title case-scan-hero__title--focus">{title}</h1>
{deck_html}          </div>
{ticker_html}
        </div>
{project_context}
      </div>
    </header>
"""
    devices_html = render_hero_ab_html(copy, bg) if style == "devices" else ""
    if style == "devices" and devices_html:
        return f"""    <header class="case-scan-hero case-scan-hero--paper case-scan-hero--devices">
      <div class="case-scan-hero__content shell">
        <div class="case-scan-hero__masthead">
          <div class="case-scan-hero__masthead-copy">
            <h1 class="case-scan-hero__title case-scan-hero__title--focus">{title}</h1>
{deck_html}          </div>
{devices_html}
        </div>
{project_context}
      </div>
    </header>
"""
    if style == "showcase" and src:
        alt = html_esc(bg.get("alt", "Case study hero visual"))
        caption = html_esc(bg.get("caption", ""))
        caption_html = (
            f'          <figcaption class="case-scan-hero__showcase-caption">{caption}</figcaption>\n'
            if caption
            else ""
        )
        showcase = f"""        <figure class="case-scan-hero__showcase">
          <img class="case-scan-hero__showcase-img" src="{html_esc(src)}" alt="{alt}" loading="eager" decoding="async" />
{caption_html}        </figure>"""
        return f"""    <header class="case-scan-hero case-scan-hero--paper case-scan-hero--showcase">
      <div class="case-scan-hero__content shell">
        <h1 class="case-scan-hero__title case-scan-hero__title--focus">{title}</h1>
{deck_html}{project_context}
{showcase}
      </div>
    </header>
"""
    if style == "paper" or not src:
        return f"""    <header class="case-scan-hero case-scan-hero--paper">
      <div class="case-scan-hero__content shell">
        <h1 class="case-scan-hero__title case-scan-hero__title--focus">{title}</h1>
{deck_html}{project_context}
      </div>
    </header>
"""
    alt = html_esc(bg.get("alt", "Marketplace stimulus"))
    return f"""    <header class="case-scan-hero case-scan-hero--artefact-bg">
      <div class="case-scan-hero__media" aria-hidden="true">
        <img class="case-scan-hero__bg-img" src="{html_esc(src)}" alt="" decoding="async" />
      </div>
      <div class="case-scan-hero__scrim" aria-hidden="true"></div>
      <div class="case-scan-hero__content shell">
        <h1 class="case-scan-hero__title case-scan-hero__title--focus">{title}</h1>
{project_context}
      </div>
      <span class="visually-hidden">{alt}</span>
    </header>
"""


def _artefact_panel(beat: dict, *, reversed_layout: bool = False) -> str:
    art = beat.get("artefact") or {}
    rev = " case-scan-story--reverse" if reversed_layout else ""
    tag = verification_tag(beat.get("metric_verification"))
    crop_cls = _crop_frame_class(beat.get("artefact_crop"))
    media = _artefact_media_html(art)
    heuristic_html = render_heuristic_html(beat.get("heuristic"))
    extra = _beat_extra_html(beat)
    body = beat.get("body", "")
    body_html = f'          <p class="case-scan-story__body">{html_esc(body)}</p>\n' if body else ""
    subtitle = beat.get("subtitle", "")
    subtitle_html = (
        f'          <p class="case-scan-story__subtitle">{html_esc(subtitle)}</p>\n'
        if subtitle
        else ""
    )
    section = html_esc(beat.get("section", ""))
    show_section_in_hidden = beat.get("title", "").lower() != beat.get("section", "").lower()

    return f"""    <article class="case-scan-story{rev}" id="{html_esc(beat.get('id', ''))}" data-story-step="{html_esc(beat.get('step', ''))}">
      <div class="case-scan-story__rail" aria-hidden="true">
        <span class="case-scan-story__step">{html_esc(beat.get('step', ''))}</span>
        <span class="case-scan-story__glyph">{html_esc(beat.get('glyph', ''))}</span>
        <span class="case-scan-story__rail-line"></span>
      </div>
      <div class="case-scan-story__grid">
        <div class="case-scan-story__copy">
          <h2 class="case-scan-story__title">{"<span class=\"visually-hidden\">" + section + ": </span>" if show_section_in_hidden else ""}{html_esc(beat.get('title', ''))}{tag}</h2>
{subtitle_html}          <p class="case-scan-story__lead">{html_esc(beat.get('lead', ''))}</p>
{body_html}{extra}{heuristic_html}        </div>
        <figure class="case-scan-story__artefact">
          <div class="case-scan-story__artefact-frame{crop_cls}">
{media}
          </div>
        </figure>
      </div>
    </article>
"""


def render_stories_html(copy: dict, pkg: dict) -> str:
    parts = []
    beats = (copy.get("scan") or {}).get("beats") or []
    for i, beat in enumerate(beats):
        parts.append(_artefact_panel(beat, reversed_layout=(i % 2 == 1)))
    return "".join(parts)


def _gallery_nav_label(beat: dict) -> str:
    labels = {
        "beat_objective": "Objective",
        "beat_problem": "Problem",
        "beat_role_method": "Role",
        "beat_insights": "Testing",
        "beat_recommendations": "Recommendations",
    }
    return labels.get(beat.get("id", ""), beat.get("section", "Section"))


_EVIDENCE_DEFAULT_OPEN = frozenset({"beat_insights", "beat_recommendations"})


def _gallery_evidence_html(beat: dict) -> tuple[str, bool]:
    heuristic_html = render_heuristic_html(beat.get("heuristic"), variant="glass")
    extra = _beat_extra_html(beat)
    body = beat.get("body", "")
    subtitle_raw = (beat.get("subtitle") or "").strip()
    lead_raw = (beat.get("lead") or "").strip()

    detail_parts: list[str] = []
    if lead_raw and subtitle_raw and lead_raw != subtitle_raw:
        detail_parts.append(
            f'                <p class="case-card-gallery__body-text">{html_esc(lead_raw)}</p>\n'
        )
    if body:
        for para in body.split("\n\n"):
            para = para.strip()
            if para:
                detail_parts.append(
                    f'                <p class="case-card-gallery__body-text">{html_esc(para)}</p>\n'
                )
    if extra:
        detail_parts.append(extra)
    if heuristic_html.strip():
        detail_parts.append(f"{heuristic_html}\n")

    inner = "".join(detail_parts)
    return inner, bool(inner.strip())


def render_card_slide_html(beat: dict, index: int) -> str:
    art = beat.get("artefact") or {}
    beat_id = beat.get("id", "")
    tag = verification_tag(beat.get("metric_verification"))
    media = render_gallery_wireframe_html(beat, art)
    subtitle_raw = (beat.get("subtitle") or "").strip()
    lead_raw = (beat.get("lead") or "").strip()
    section = html_esc(beat.get("section", ""))
    show_section_in_hidden = beat.get("title", "").lower() != beat.get("section", "").lower()
    hidden_section = (
        f'<span class="visually-hidden">{section}: </span>' if show_section_in_hidden else ""
    )

    evidence_inner, has_evidence = _gallery_evidence_html(beat)
    default_open = beat_id in _EVIDENCE_DEFAULT_OPEN and has_evidence
    visible_subtitle = subtitle_raw or lead_raw

    subtitle_html = ""
    if visible_subtitle:
        subtitle_html = (
            f'              <p class="case-card-gallery__subtitle">{html_esc(visible_subtitle)}</p>\n'
        )

    trigger_html = ""
    if has_evidence:
        expanded = "true" if default_open else "false"
        trigger_html = (
            f'              <button type="button" class="case-card-gallery__evidence-trigger" '
            f'data-evidence-trigger aria-expanded="{expanded}" '
            f'aria-controls="evidence-{html_esc(beat_id)}">Evidence</button>\n'
        )

    rail_html = ""
    if has_evidence:
        open_cls = " is-open" if default_open else ""
        hidden_attr = "" if default_open else " hidden"
        default_attr = ' data-evidence-default-open="true"' if default_open else ""
        rail_html = f"""            <aside class="case-card-gallery__evidence-rail{open_cls}" id="evidence-{html_esc(beat_id)}" data-evidence-rail{default_attr}{hidden_attr} role="region" aria-label="Evidence for {html_esc(beat.get('title', ''))}">
              <header class="case-card-gallery__evidence-rail-header">
                <h3 class="case-card-gallery__evidence-rail-title">Evidence</h3>
                <button type="button" class="case-card-gallery__evidence-close" data-evidence-close>Close</button>
              </header>
              <div class="case-card-gallery__evidence-rail-scroll" data-evidence-rail-scroll tabindex="-1">
{evidence_inner}              </div>
            </aside>
"""

    evidence_open_cls = " is-evidence-open" if default_open else ""
    active = " is-active" if index == 0 else ""
    hidden_attr = "" if index == 0 else ' aria-hidden="true"'

    return f"""        <article class="case-card-gallery__slide{active}{evidence_open_cls}" id="{html_esc(beat_id)}" data-case-gallery-slide data-card-index="{index}"{hidden_attr}>
          <div class="case-card-gallery__grid">
            <div class="case-card-gallery__story">
              <h2 class="case-card-gallery__title">{hidden_section}{html_esc(beat.get('title', ''))}{tag}</h2>
{subtitle_html}{trigger_html}            </div>
{rail_html}            <div class="case-card-gallery__media">
{media}
            </div>
          </div>
        </article>
"""


def render_gallery_nav_html(beats: list) -> str:
    items = []
    for i, beat in enumerate(beats):
        bid = html_esc(beat.get("id", f"beat_{i}"))
        label = html_esc(_gallery_nav_label(beat))
        active = " is-active" if i == 0 else ""
        aria = ' aria-current="true"' if i == 0 else ""
        items.append(
            f'        <li><button type="button" class="case-scan-gallery-nav__link{active}"'
            f' data-gallery-index="{i}"{aria}>{label}</button></li>'
        )
    return f"""    <nav class="case-scan-gallery-nav case-scan-gallery-nav--minimal" aria-label="Case study sections" data-case-gallery-nav>
      <ol class="case-scan-gallery-nav__list">
{chr(10).join(items)}
      </ol>
    </nav>
"""


def render_gallery_section_html(copy: dict, pkg: dict) -> str:
    beats = (copy.get("scan") or {}).get("beats") or []
    slides = "".join(render_card_slide_html(b, i) for i, b in enumerate(beats))
    nav = render_gallery_nav_html(beats)
    return f"""    <section class="case-card-gallery" data-case-card-gallery aria-label="Case study sections">
      <motion.div class="case-card-gallery__runway" data-case-gallery-runway>
      <div class="case-card-gallery__pin case-scan__body--gallery shell" data-case-gallery-pin>
{nav}        <div class="case-card-gallery__shell" data-case-card-shell tabindex="0" role="region" aria-label="Case study sections">
          <div class="case-card-gallery__viewport">
            <div class="case-card-gallery__track" data-case-card-track>
{slides}            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
""".replace("<motion.div", "<div").replace("</motion.div>", "</div>")


def render_exec_summary_html(copy: dict) -> str:
    scan = copy.get("scan") or {}
    blocks = scan.get("exec_blocks") or []
    if not blocks and scan.get("exec_summary"):
        blocks = [{"title": "Summary", "body": scan["exec_summary"]}]

    items = []
    for i, block in enumerate(blocks):
        delay = f' style="--motion-delay: {i * 0.14}s"' if i else ""
        items.append(
            f"""      <article class="case-scan-exec__block motion-enter"{delay}>
        <h3 class="case-scan-exec__block-title">{html_esc(block.get("title", ""))}</h3>
        <p class="case-scan-exec__block-body">{html_esc(block.get("body", ""))}</p>
      </article>"""
        )

    return f"""    <section class="case-scan-exec" id="case-exec-summary" aria-label="Executive summary">
      <h2 class="case-scan-exec__heading">Executive summary</h2>
      <div class="case-scan-exec__blocks">
{chr(10).join(items)}
      </div>
    </section>
"""


def render_exec_collapse_html(copy: dict) -> str:
    return render_exec_summary_html(copy)


def render_case_close_cta_html(*, asset_prefix: str = "..") -> str:
    del asset_prefix  # kept for API compatibility with callers
    mailto = "mailto:chandan004sharma@gmail.com"
    return f"""    <section class="case-scan-close case-scan-close--minimal" aria-label="Get in touch">
      <div class="framework-close__panel" role="group" aria-labelledby="case-close-heading">
        <h2 id="case-close-heading" class="framework-close__headline">
          Receive a Personalized User Experience Audit
        </h2>
        <div class="framework-close__actions">
          <a class="framework-close__cta framework-close__cta--primary"
             href="{html_esc(mailto)}"
             aria-label="Email Chandan">
            Talk to Chandan
          </a>
        </div>
      </div>
    </section>
"""


def _clean_exec_html(html: str) -> str:
    return html


def render_scan_page(
    pkg: dict,
    copy: dict,
    *,
    asset_prefix: str = "..",
    promoted: bool = False,
) -> str:
    meta = pkg["meta"]
    scan = copy.get("scan") or {}
    depth = copy.get("depth_cta") or {}
    secondary = copy.get("secondary_cta") or {}
    slug = meta["slug"]

    chrome = (TEMPLATES_DIR / "case-site-chrome.html").read_text(encoding="utf-8")
    header, footer = chrome.split("<!-- CASE_CHROME_FOOTER -->", 1)
    header = header.replace("{{ASSET_PREFIX}}", asset_prefix)
    footer = footer.replace("{{ASSET_PREFIX}}", asset_prefix)

    title = html_esc(meta["title"])
    description = html_esc(copy.get("meta_description", ""))
    stories = render_stories_html(copy, pkg)
    exec_summary = _clean_exec_html(render_exec_summary_html(copy))
    hero_html = render_hero_html(copy, meta["title"])
    hero_bg_style = (copy.get("hero_bg") or {}).get("style", "")
    hero_ab = copy.get("hero_ab") or {}
    needs_ticker_js = hero_bg_style == "ticker" or hero_ab.get("enabled")
    hero_ab_script = (
        f'  <script src="{asset_prefix}/assets/case-study-hero-ab.js" defer></script>\n'
        if needs_ticker_js
        else ""
    )
    gallery_mode = meta.get("scan_layout", "gallery") == "gallery"
    body_class = f"case-scan-page case-scan-page--boutique case-scan-page--{html_esc(slug)}"
    if gallery_mode:
        body_class += " case-scan-page--gallery"

    if gallery_mode:
        scan_block = render_gallery_section_html(copy, pkg)
        close_cta = render_case_close_cta_html(asset_prefix=asset_prefix)
        tail_block = f"""    <div class="shell case-scan__body case-scan__body--after-gallery">
{close_cta}
    <p class="case-scan-footer-note">Case study · {html_esc(slug)}{' · published' if promoted else ' · preview'}</p>
    </div>"""
    else:
        scan_block = f"""    <div class="shell case-scan__body">
    <div class="case-scan-timeline" data-case-timeline>
{stories}
    </div>"""
        exec_collapse = render_exec_collapse_html(copy)
        tail_block = f"""{exec_collapse}
    <nav class="case-scan-actions" aria-label="Case study actions">
      <a class="button button-primary" href="{html_esc(depth.get('href', '#'))}">{html_esc(depth.get('label', 'Executive summary'))}</a>
      <a class="text-link" href="{html_esc(secondary.get('href', '#'))}">{html_esc(secondary.get('label', 'Book a call'))}</a>
    </nav>
    <p class="case-scan-footer-note">Case study · {html_esc(slug)}{' · published' if promoted else ' · preview'}</p>
    </div>"""

    return f"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>{title} | Case study</title>
  <meta name="description" content="{description}" />
  <link rel="stylesheet" href="{asset_prefix}/styles.css" />
  <link rel="stylesheet" href="{asset_prefix}/assets/case-study-card-gallery.css?v=6" />
  <script src="{asset_prefix}/assets/site-nav.js" defer></script>
  <script src="{asset_prefix}/assets/case-study-scan.js" defer></script>
  <script src="{asset_prefix}/assets/case-study-card-gallery.js?v=6" defer></script>
{hero_ab_script}</head>
<body class="{body_class}">
{header}
  <main id="main" class="case-scan case-scan--story" tabindex="-1">
    <div class="shell">
    <a class="back-link case-scan-back" href="{asset_prefix}/index.html#work">Back to work</a>
    </div>
{hero_html}
{scan_block}
{tail_block}
  </main>
{footer}
</body>
</html>
"""

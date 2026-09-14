import json, os, re, glob
from bs4 import BeautifulSoup

os.makedirs("text", exist_ok=True)
BASE = "https://www.homemadebycolleen.com"
pages = []

def clean(s):
    return re.sub(r"[ \t ]+", " ", (s or "")).strip()

for f in sorted(glob.glob("html/*.html")):
    slug = os.path.basename(f)[:-5]
    url = BASE + ("" if slug == "index" else "/" + slug.replace("__", "/"))
    soup = BeautifulSoup(open(f, encoding="utf-8", errors="replace").read(), "html.parser")
    for t in soup(["script", "style", "noscript", "svg"]):
        if t.name == "script" and t.get("type") == "application/ld+json":
            continue
        t.decompose()

    title = clean(soup.title.get_text() if soup.title else "")
    md = soup.find("meta", attrs={"name": "description"})
    desc = clean(md.get("content") if md else "")
    canon = soup.find("link", rel="canonical")
    ld = []
    for s in soup.find_all("script", type="application/ld+json"):
        try: ld.append(json.loads(s.string or "{}"))
        except Exception: ld.append({"_raw": clean(s.string)[:2000]})
        s.decompose()

    heads = [{"tag": h.name, "text": clean(h.get_text(" "))}
             for h in soup.find_all(["h1","h2","h3","h4"]) if clean(h.get_text(" "))]
    imgs = [{"src": i.get("src") or i.get("data-src") or "", "alt": clean(i.get("alt"))}
            for i in soup.find_all("img")]
    links = sorted({(a.get("href") or "").strip() for a in soup.find_all("a") if a.get("href")})
    internal = sorted(l for l in links if l.startswith("/") or l.startswith(BASE))
    external = sorted(l for l in links if l.startswith("http") and BASE not in l)
    tels = sorted({l for l in links if l.startswith("tel:")})

    body = soup.body or soup
    text = body.get_text("\n")
    lines, prev = [], None
    for ln in (clean(x) for x in text.split("\n")):
        if ln and ln != prev:
            lines.append(ln); prev = ln
    content = "\n".join(lines)

    pages.append({"url": url, "slug": slug, "title": title, "description": desc,
                  "canonical": canon.get("href") if canon else None,
                  "headings": heads, "word_count": len(content.split()),
                  "images": imgs, "internal_links": internal, "external_links": external,
                  "tel_links": tels, "jsonld": ld, "text": content})

    with open(f"text/{slug}.md", "w", encoding="utf-8") as out:
        out.write(f"# {title}\n\nURL: {url}\nMeta description: {desc}\n\n---\n\n{content}\n")

json.dump(pages, open("colleen-site.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print(f"pages: {len(pages)}  total words: {sum(p['word_count'] for p in pages)}")

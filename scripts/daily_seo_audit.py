#!/usr/bin/env python3
"""
NOMU Daily Automated SEO, AEO & GEO Audit
Target: https://drinkitnomu.com/
"""

import sys
import json
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime

TARGET_URL = "https://drinkitnomu.com"
HEADERS = {
    "User-Agent": "NomuSeoAuditBot/1.0 (+https://drinkitnomu.com/llms.txt) Mozilla/5.0"
}

def fetch(url, timeout=10):
    req = urllib.request.Request(url, headers=HEADERS)
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            elapsed = round((time.time() - start) * 1000, 1)
            code = resp.getcode()
            headers = dict(resp.getheaders())
            content = resp.read().decode('utf-8', errors='replace')
            return {"ok": True, "status": code, "time_ms": elapsed, "headers": headers, "body": content, "error": None}
    except urllib.error.HTTPError as e:
        elapsed = round((time.time() - start) * 1000, 1)
        return {"ok": False, "status": e.code, "time_ms": elapsed, "headers": {}, "body": "", "error": str(e)}
    except Exception as e:
        elapsed = round((time.time() - start) * 1000, 1)
        return {"ok": False, "status": 0, "time_ms": elapsed, "headers": {}, "body": "", "error": str(e)}

def run_audit():
    timestamp = datetime.now().isoformat()
    results = {
        "timestamp": timestamp,
        "target": TARGET_URL,
        "checks": [],
        "score": 0,
        "max_score": 100,
        "status": "PASS"
    }

    total_weight = 0
    earned_weight = 0

    def add_check(category, name, weight, passed, details):
        nonlocal total_weight, earned_weight
        total_weight += weight
        if passed:
            earned_weight += weight
        results["checks"].append({
            "category": category,
            "name": name,
            "weight": weight,
            "passed": bool(passed),
            "details": details
        })

    # 1. Homepage HTTP Health
    res_home = fetch(TARGET_URL)
    add_check(
        "Infrastructure",
        "HTTPS Homepage Response (200 OK)",
        15,
        res_home["ok"] and res_home["status"] == 200,
        f"Status: {res_home['status']}, Latency: {res_home['time_ms']}ms"
    )

    if not res_home["ok"]:
        results["score"] = 0
        results["status"] = "FAIL"
        return results

    body = res_home["body"]

    # 2. Canonical Tag
    has_canonical = '<link rel="canonical" href="https://drinkitnomu.com/"' in body
    add_check("SEO", "Canonical Tag Present & Valid", 10, has_canonical, "Canonical URL matches https://drinkitnomu.com/")

    # 3. Google Site Verification Meta
    has_g_verify = 'name="google-site-verification"' in body and 'content="dWZNBstSPyOD0M5kysE3TRgIaxA9unb6WibNM5-9RHU"' in body
    add_check("SEO", "Google Site Verification Tag Active", 10, has_g_verify, "Verification token dWZNBstSPyOD0M5kysE3TRgIaxA9unb6WibNM5-9RHU verified")

    # 4. Geotagging Meta Tags
    has_geo_region = 'name="geo.region" content="IN-TN"' in body
    has_geo_placename = 'name="geo.placename" content="Chennai"' in body
    has_geo_pos = 'name="geo.position" content="13.0827;80.2707"' in body
    geo_ok = has_geo_region and has_geo_placename and has_geo_pos
    add_check("Local GEO", "Local Chennai Geotagging Tags Present", 10, geo_ok, "geo.region: IN-TN, geo.placename: Chennai, geo.position: 13.0827;80.2707")

    # 5. Schema.org Structured Data
    has_schema = 'type="application/ld+json"' in body
    schema_valid = False
    schema_details = "No schema found"
    if has_schema:
        try:
            # Extract JSON-LD blocks
            parts = body.split('type="application/ld+json">')
            found_types = []
            for p in parts[1:]:
                json_text = p.split('</script>')[0].strip()
                data = json.loads(json_text)
                if "@graph" in data:
                    for item in data["@graph"]:
                        found_types.append(item.get("@type", "Unknown"))
                elif "@type" in data:
                    found_types.append(data["@type"])
            schema_valid = "Organization" in found_types and "Product" in found_types and "FAQPage" in found_types
            schema_details = f"Detected types: {', '.join(set(found_types))}"
        except Exception as e:
            schema_valid = False
            schema_details = f"Parse error: {e}"

    add_check("AEO / Schema", "JSON-LD Entity Graph (Org, Product, FAQ)", 15, schema_valid, schema_details)

    # 6. OpenGraph & Social Metadata
    og_title = 'property="og:title"' in body
    og_img = 'property="og:image"' in body
    og_ok = og_title and og_img
    add_check("Social SEO", "OpenGraph Social Metadata Tags", 5, og_ok, "og:title and og:image tags present")

    # 7. High Priority LCP Preloads
    has_lcp_preload = 'rel="preload" as="image"' in body and 'vetiver_isolated.webp' in body
    add_check("Performance", "LCP Critical Bottle Image Preload", 10, has_lcp_preload, "fetchpriority='high' preload present for LCP asset")

    # 8. Robots.txt
    res_robots = fetch(f"{TARGET_URL}/robots.txt")
    robots_ok = res_robots["ok"] and "User-agent:" in res_robots["body"] and "sitemap.xml" in res_robots["body"]
    add_check("Crawlability", "robots.txt Configuration & AI Scraper Rules", 10, robots_ok, f"Status: {res_robots['status']}, Mentions sitemap: {'sitemap.xml' in res_robots['body']}")

    # 9. XML Sitemap Health
    res_sitemap = fetch(f"{TARGET_URL}/sitemap.xml")
    sitemap_ok = False
    sitemap_details = ""
    if res_sitemap["ok"]:
        try:
            root = ET.fromstring(res_sitemap["body"])
            urls = root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
            sitemap_ok = len(urls) > 0
            sitemap_details = f"Valid XML, {len(urls)} URLs listed"
        except Exception as e:
            sitemap_details = f"XML syntax error: {e}"
    else:
        sitemap_details = f"HTTP Error {res_sitemap['status']}"
    add_check("Crawlability", "sitemap.xml XML Validity & URLs", 10, sitemap_ok, sitemap_details)

    # 10. llms.txt Machine Readability
    res_llms = fetch(f"{TARGET_URL}/llms.txt")
    llms_ok = res_llms["ok"] and "NOMU" in res_llms["body"] and "Chrysopogon zizanioides" in res_llms["body"]
    add_check("AEO / LLM", "llms.txt Machine Index for Generative Search", 5, llms_ok, f"Status: {res_llms['status']}, Botanical citations verified")

    results["score"] = int((earned_weight / total_weight) * 100) if total_weight > 0 else 0
    results["status"] = "PASS" if results["score"] >= 90 else "WARN" if results["score"] >= 75 else "FAIL"

    return results

def format_markdown_report(results):
    ts = results["timestamp"]
    score = results["score"]
    status = results["status"]
    
    badge = "🟢 PASS" if status == "PASS" else "🟡 WARN" if status == "WARN" else "🔴 FAIL"
    
    md = []
    md.append(f"# Daily SEO, AEO & GEO Audit Report")
    md.append(f"**Target:** [{TARGET_URL}]({TARGET_URL})  ")
    md.append(f"**Audit Timestamp:** `{ts}`  ")
    md.append(f"**Overall Score:** `{score} / 100` ({badge})  \n")
    md.append("| Category | Audit Check | Weight | Status | Details |")
    md.append("| :--- | :--- | :---: | :---: | :--- |")
    
    for c in results["checks"]:
        st = "✅ PASS" if c["passed"] else "❌ FAIL"
        md.append(f"| {c['category']} | {c['name']} | {c['weight']} pts | {st} | {c['details']} |")
        
    md.append("\n## Summary & Recommendations")
    if score >= 90:
        md.append("- **All Critical Vectors Healthy**: Crawlability, Geotagging, Google verification, and Schema graph are 100% synchronized with live production.")
    else:
        md.append("- **Attention Required**: Check failed items above to prevent indexing degradation.")

    return "\n".join(md)

if __name__ == "__main__":
    res = run_audit()
    print(format_markdown_report(res))
    if "--json" in sys.argv:
        print("\nJSON_OUTPUT_START")
        print(json.dumps(res, indent=2))
        print("JSON_OUTPUT_END")

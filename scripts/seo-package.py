import json,zipfile
from pathlib import Path
root=Path('audit/seo')
files=['SEO-IMPLEMENTATION-REPORT.html','keyword-mapping.csv','indexing-priority.csv','source-text-inventory.csv','source-text-inventory.json','public-copy.json','shared-public-copy.json','published.json','live-checks.json','browser-functional.json','data-verification.json','deployment.json','category-correction.json','hero-layout-sample.json','sitemap.xml','robots.txt','live-home-hero-390.png','live-home-hero-1440.png','live-dehydrated-onions-mobile.png','live-enquiry-mobile.png','live-blog-mobile.png','report-preview.png']
for name in ['live-checks.json','browser-functional.json','data-verification.json']:
 data=json.loads((root/name).read_text(encoding='utf-8-sig'));assert all(r['status']=='PASS'for r in data['results']),name
assert len(json.loads((root/'live-checks.json').read_text(encoding='utf-8-sig'))['pages'])==39
archive=root/'OM-SEO-Handover-2026-11-18.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name in files:z.write(root/name,'OM-SEO-Handover/seo/'+name)
 z.write(Path('audit/blog/all-12-public-results.json'),'OM-SEO-Handover/blog/all-12-public-results.json')
 z.writestr('OM-SEO-Handover/READ-ME.txt','Open seo/SEO-IMPLEMENTATION-REPORT.html for the complete handover.\nCSV files contain keyword mapping, indexing priorities and source text inventory.\nJSON files contain public copy and test evidence.\nThis is the SEO handover, not the full project source archive. No credentials, private drafts or database backups are included.\nThe report distinguishes published work, retained wording, owner inputs and testing limitations.\n')
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert not any('.env' in n or 'source-before' in n or 'private' in n or 'database-content' in n for n in z.namelist())
 print('Verified ZIP:',len(z.namelist()),'entries;',archive.stat().st_size,'bytes')
print('SEO handover complete. All selected evidence files passed.')

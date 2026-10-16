#!/usr/bin/env python3
"""Export a prebuilt, vanilla static website for a GitHub Pages project URL.

Run on the built folder containing index.html, not on a framework source tree.
Only explicitly listed application scripts are rewritten; vendor JS is copied.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit


URL_ATTRIBUTE = re.compile(r"(\b(?:href|src|action|poster|data-src|data-href|xlink:href)\s*=\s*)([\"'])(.*?)(\2)", re.I | re.S)
JS_PATH = re.compile(r"([\"'])(/(?!/)[^\"'\\\s]*)(\1)")
CSS_URL = re.compile(r"(url\(\s*)([\"']?)([^)\"'\s]+)(\2)(\s*\))", re.I)
CSS_IMPORT = re.compile(r"(@import\s+)([\"'])(/[^\"']*)(\2)", re.I)
EXCLUDED = {'.git', '.openai', '__pycache__', 'node_modules'}


def export(source: Path, output: Path, repository: str, origin: str,
           app_scripts: list[str], replace_origins: list[str]) -> dict:
    source, output = source.resolve(), output.resolve()
    origin = origin.rstrip('/')
    host = urlsplit(origin)
    if host.scheme not in {'http', 'https'} or not host.netloc or host.path:
        raise ValueError('--origin must be an origin such as https://yourname.github.io')
    if not re.fullmatch(r'[A-Za-z0-9_.-]+', repository) or repository in {'.', '..'}:
        raise ValueError('--repository must be the repository name, without owner or slashes')
    if not (source / 'index.html').is_file():
        raise ValueError('The source folder must contain the built index.html')
    if output == source or source in output.parents:
        raise ValueError('Use a separate output folder outside the source folder')
    if output.exists() and any(output.iterdir()):
        raise ValueError('Use a new empty output folder; existing files are never overwritten')
    base = '/' if repository.lower() == host.netloc.lower() else f'/{repository}/'
    site_url = origin + base
    index = (source / 'index.html').read_text()
    old_base_match = re.search(r'<meta name="github-pages-base" content="([^"]+)"', index)
    old_site_match = re.search(r'<meta name="github-pages-origin" content="([^"]+)"', index)
    old_base = old_base_match.group(1) if old_base_match else '/'
    previous_sites = [x.rstrip('/') for x in replace_origins]
    if old_site_match:
        previous_sites.append(old_site_match.group(1).rstrip('/'))
    scripts = set(app_scripts)
    missing = sorted(x for x in scripts if not (source / x).is_file())
    if missing:
        raise ValueError('Application script not found: ' + ', '.join(missing))

    def path_url(value: str) -> str:
        if not value.startswith('/') or value.startswith('//'):
            return value
        if old_base != '/' and value.startswith(old_base):
            value = '/' + value[len(old_base):]
        elif base != '/' and value.startswith(base):
            return value
        return base + value.lstrip('/')

    def css(text: str) -> str:
        text = CSS_URL.sub(lambda m: m[1] + m[2] + path_url(m[3]) + m[4] + m[5], text)
        return CSS_IMPORT.sub(lambda m: m[1] + m[2] + path_url(m[3]) + m[4], text)

    changed, copied = [], []
    output.mkdir(parents=True, exist_ok=True)
    for path in sorted(source.rglob('*')):
        if not path.is_file() or any(part in EXCLUDED for part in path.relative_to(source).parts):
            continue
        relative = path.relative_to(source).as_posix()
        if relative == 'github-pages-export.json':
            continue
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if path.suffix.lower() in {'.html', '.css', '.svg'} or relative in scripts or relative == 'routes.json':
            original = text = path.read_text()
            if path.suffix.lower() in {'.html', '.svg'}:
                text = URL_ATTRIBUTE.sub(lambda m: m[1] + m[2] + path_url(m[3]) + m[4], text)
                text = css(text)
                for previous in sorted(set(previous_sites), key=len, reverse=True):
                    text = text.replace(previous + '/', site_url).replace('"' + previous + '"', '"' + site_url.rstrip('/') + '"')
                if path.suffix.lower() == '.html':
                    text = re.sub(r'<meta name="github-pages-(?:base|origin)" content="[^"]*">', '', text)
                    marker = f'<meta name="github-pages-base" content="{base}"><meta name="github-pages-origin" content="{site_url}">'
                    text = text.replace('<head>', '<head>' + marker, 1)
            elif path.suffix.lower() == '.css':
                text = css(text)
            elif relative in scripts:
                text = JS_PATH.sub(lambda m: m[1] + path_url(m[2]) + m[3], text)
            elif relative == 'routes.json':
                routes = json.loads(text)
                if not isinstance(routes, list) or not all(isinstance(x, str) for x in routes):
                    raise ValueError('routes.json must be a list of route URLs')
                text = json.dumps([path_url(x) for x in routes], indent=2) + '\n'
            target.write_text(text)
            (changed if text != original else copied).append(relative)
        else:
            shutil.copy2(path, target)
            copied.append(relative)
    (output / '.nojekyll').write_text('')
    result = {'repository': repository, 'origin': origin, 'base': base, 'url': site_url,
              'application_scripts': app_scripts, 'rewritten_files': changed,
              'copied_files': len(copied), 'deleted_files': 0}
    (output / 'github-pages-export.json').write_text(json.dumps(result, indent=2) + '\n')
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--repository', required=True)
    parser.add_argument('--origin', required=True)
    parser.add_argument('--app-script', action='append', default=[])
    parser.add_argument('--replace-origin', action='append', default=[])
    args = parser.parse_args()
    try:
        result = export(args.source, args.output, args.repository, args.origin,
                        args.app_script, args.replace_origin)
    except (ValueError, OSError) as error:
        parser.exit(1, str(error) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()

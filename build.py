"""Construit index.html (l'app pour téléphone) à partir de app-source.html.

app-source.html est la même page que la version dans Claude.
Usage : python3 build.py
"""
from pathlib import Path

here = Path(__file__).parent
src = (here / "app-source.html").read_text(encoding="utf-8")
src = src.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")

head = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Listes de cadeaux pour Noël, anniversaires et événements, avec budget, photos et partage PDF.">
<meta name="theme-color" content="#E0475A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Cadeaux">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/favicon-64.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px/1.5 system-ui,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
<script src="local-runtime.js"></script>
"""

out = head + src.replace("<title>", "<title>", 1).replace("</style>\n\n<div class=\"wrap\">", "</style>\n</head>\n<body>\n<div class=\"wrap\">", 1) + "\n</body>\n</html>\n"
(here / "index.html").write_text(out, encoding="utf-8")
print("index.html construit :", len(out) // 1024, "Ko")

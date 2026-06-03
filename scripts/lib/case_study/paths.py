from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCHEMA_PATH = ROOT / "schemas" / "case-package.v1.schema.json"
TEMPLATES_DIR = ROOT / "templates"
OUT_DIR = ROOT / "_bmad-output" / "case-studies"
PACKAGES_DIR = ROOT / "scripts" / "case-study-packages"
PROMOTED_DIR = ROOT / "case-studies"
ASSETS_DIR = ROOT / "assets" / "case-studies"

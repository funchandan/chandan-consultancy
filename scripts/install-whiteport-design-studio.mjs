#!/usr/bin/env node
/**
 * Non-interactive WDS install for Cursor.
 * Source repo: _bmad/wds-source (git clone)
 * Installed to: _bmad/wds (processed agents/skills)
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(__dirname, '..');
const wdsSource = path.join(projectDir, '_bmad', 'wds-source');

if (!fs.existsSync(path.join(wdsSource, 'tools/cli/lib/installer.js'))) {
  console.error('Missing _bmad/wds-source. Run:');
  console.error(
    '  git clone --depth 1 https://github.com/whiteport-collective/whiteport-design-studio.git _bmad/wds-source',
  );
  process.exit(1);
}

const require = createRequire(path.join(wdsSource, 'package.json'));
const { Installer } = require(path.join(wdsSource, 'tools/cli/lib/installer.js'));

const config = {
  projectDir,
  wdsFolder: '_bmad/wds',
  project_name: path.basename(projectDir),
  root_folder: 'design-process',
  starting_point: 'brief',
  ides: ['cursor'],
  install_learning: true,
  install_design_space: false,
  _detection: { type: 'fresh', folder: '_bmad/wds' },
  _action: fs.existsSync(path.join(projectDir, '_bmad', 'wds', 'config.yaml')) ? 'update' : 'fresh',
};

const installer = new Installer();
installer
  .install(config)
  .then((result) => {
    const progressDir = path.join(projectDir, '_progress');
    const outline = path.join(progressDir, 'wds-project-outline.yaml');
    if (!fs.existsSync(outline)) {
      fs.mkdirSync(progressDir, { recursive: true });
      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        outline,
        `wds-version: "1.0.0"
project: "${path.basename(projectDir)}"
created: "${today}"
rendering-tool: excalidraw

phases:
  product-brief: not-started
  trigger-map: not-started
  ux-scenarios: not-started
  ux-design: not-started
  development: not-started

output-folder: design-process
`,
        'utf8',
      );
    }
    console.log('\n✓ Whiteport Design Studio installed');
    console.log(`  Processed install: ${result.wdsDir}`);
    console.log(`  Source (updates):  ${wdsSource}`);
    console.log('  Cursor rules:      .cursor/rules/wds/');
    console.log('  Learning:          _wds-learn/ (optional)');
    console.log('  Progress:          _progress/wds-project-outline.yaml');
  })
  .catch((err) => {
    console.error('Install failed:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  });

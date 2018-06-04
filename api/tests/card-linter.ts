import * as fs from 'fs';
import * as path from 'path';

import config from '../config';
import { extract_frontmatter, errorHandler } from '../utils';

interface FilePaths {
  base: string,
  path: string
}

function checkCardsDirShape(d: FilePaths[], errorbin: Error[]): void {
  d.forEach(dir => {
    // check top level directories
    if(!fs.statSync(dir.path).isDirectory()) {
      errorbin.push(Error('No files should be located in the first level of the "cards" directory.'));
    }
    // check for card.md file
    if(fs.readdirSync(dir.path).indexOf('card.md') === -1) {
      errorbin.push(Error(`No "card.md" file found in directory: ${dir}`));
    }
  });
}

function checkFrontmatter(dir: string, errorbin: Error[]) {
  const keys = ['authors', 'categories', 'created', 'title', 'updates'];
  const contents = fs.readFileSync(`${dir}/card.md`, 'utf8');
  const { body, ...fm } = extract_frontmatter(contents);
  const attributeKeys = Object.keys(fm);

  if (attributeKeys.length < keys.length) {
    errorbin.push(Error(`${dir} is missing yaml attributes`));
  }

  ['authors', 'categories'].forEach(arr => {
    if (!Array.isArray(fm[arr])) {
      errorbin.push(Error (`Invalid "${arr}" in yaml of ${dir}`));
    }
    if (fm[arr].length === 0) {
      errorbin.push(Error (`No "${arr}" listed in yaml of ${dir}`));
    }
  });

  if (
    typeof fm.created !== 'string' ||
    fm.created === '' ||
    !config.REGEX.dateStringFormat.test(fm.created)
  ) {
    errorbin.push(Error(`Invalid "created" property in yaml of ${dir}`));
  }

  if (
    typeof fm.title !== 'string' || fm.title === ''
  ) {
    errorbin.push(Error(`Invalid "title" property in yaml of ${dir}`));
  }

  if (fm.updates !== null && !Array.isArray(fm.updates)) {
    errorbin.push(Error(`Invalid "updates" property in yaml of ${dir}`));
  }
}

function checkYAML(dir: string, errorbin: Error[]) {
  const contents = fs.readFileSync(`${dir}/card.md`, 'utf8');
  const { body, ...frontmatter } = extract_frontmatter(contents);
  // Does frontmatter exist?
  if (Object.keys(frontmatter).length === 0) {
    errorbin.push(Error(`Frontmatter not found for ${dir}`));
  }
  // Does the card have an H1 title?
  if (!config.REGEX.markdownH1.test(body)) {
    errorbin.push(Error(`H1 title not set for ${dir}`));
  }
  // Does the card have a reference header?
  if (!config.REGEX.hasReferenceHeading.test(body)) {
    errorbin.push(Error(`Improper reference format found in ${dir}`));
  }
  // Are their images w/o alt text?
  if (config.REGEX.imagesWithoutAltText.test(body)) {
    console.warn(
      `\x1b[33m\x1b[1mWarning:\x1b[0m One or more images in \x1b[32m${dir}\x1b[0m do not have alt text`,
    );
  }
}

// read cards dir, filter out ignored files
const cards_dir = fs.readdirSync(config.CARD_DIR)
  .filter(x => config.IGNORED_FILES.indexOf(x) === -1)
  .map(x => ({ base: x, path: `${config.CARD_DIR}/${x}` }));

// run tests
const errorbin = [];
checkCardsDirShape(cards_dir, errorbin);
cards_dir.forEach(dir => {
  checkYAML(dir.path, errorbin);
  checkFrontmatter(dir.path, errorbin);
});

errorHandler(errorbin, '✅  Card linter passed', 'Card Linter Errors present');

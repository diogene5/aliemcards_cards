import { readdirSync,readFileSync, statSync } from 'fs';

import config from '../config';
import { extract_frontmatter, errorHandler } from '../utils';

interface FilePaths {
  base: string,
  path: string
}

function checkCardsDirShape(d: FilePaths[], errorbin: Error[]): void {
  d.forEach(filename => {
    // check files
    if(!statSync(filename.path).isFile()) {
      errorbin.push(Error('Only files, no directories, should be in the "cards" directory.'));
    }
  });
}

function checkUpdated(u: any): boolean {
  if (typeof u !== 'string') return false;
  if (!config.REGEX.dateStringFormat.test(u)) return false;
  return true;
}

function checkFrontmatter(filename: string, errorbin: Error[]) {
  const keys = ['authors', 'categories', 'created', 'title', 'updated'];
  const contents = readFileSync(`${filename}`, 'utf8');
  const { body, ...fm } = extract_frontmatter(contents);
  const attributeKeys = Object.keys(fm);

  if (attributeKeys.length < keys.length) {
    errorbin.push(Error(`${filename} is missing yaml attributes`));
  }

  ['authors', 'categories'].forEach(arr => {
    if (!Array.isArray(fm[arr])) {
      errorbin.push(Error (`Invalid "${arr}" in yaml of ${filename}`));
    }
    if (fm[arr].length === 0) {
      errorbin.push(Error (`No "${arr}" listed in yaml of ${filename}`));
    }
  });

  if (
    typeof fm.created !== 'string' ||
    fm.created === '' ||
    !config.REGEX.dateStringFormat.test(fm.created)
  ) {
    errorbin.push(Error(`Invalid "created" property in yaml of ${filename}`));
  }

  if (fm.updated !== null) {
    if (checkUpdated(fm.updated) !== true) {
      errorbin.push(Error(`Invalid "updated" property in yaml of ${filename}`));
    }
  }
 
  if (
    typeof fm.title !== 'string' || fm.title === ''
  ) {
    errorbin.push(Error(`Invalid "title" property in yaml of ${filename}`));
  }
}

function checkCard(filename: string, errorbin: Error[]) {
  const contents = readFileSync(`${filename}`, 'utf8');
  const { body, ...frontmatter } = extract_frontmatter(contents);
  // Does frontmatter exist?
  if (Object.keys(frontmatter).length === 0) {
    errorbin.push(Error(`Frontmatter not found for ${filename}`));
  }
  // Does the card have an H1 title?
  if (!config.REGEX.markdownH1.test(body)) {
    errorbin.push(Error(`H1 title not set for ${filename}`));
  }
  // Does the card have a reference header?
  if (!config.REGEX.hasReferenceHeading.test(body)) {
    errorbin.push(Error(`Improper reference format found in ${filename}`));
  }
  // Are their images w/o alt text?
  if (config.REGEX.imagesWithoutAltText.test(body)) {
    console.warn(
      `\x1b[33m\x1b[1mWarning:\x1b[0m One or more images in \x1b[32m${filename}\x1b[0m do not have alt text`,
    );
  }
}

export default function(card_dir: string): void {
  // read cards dir, filter out ignored files
  const cards = readdirSync(card_dir)
    .filter(x => config.IGNORED_FILES.indexOf(x) === -1)
    .map(x => ({ base: x, path: `${card_dir}/${x}` }));

  // run tests
  const errorbin = [];
  checkCardsDirShape(cards, errorbin);
  cards.forEach(dir => {
    checkCard(dir.path, errorbin);
    checkFrontmatter(dir.path, errorbin);
  });

  errorHandler(errorbin, 'Card linter passed', 'Card Linter Errors present');
}

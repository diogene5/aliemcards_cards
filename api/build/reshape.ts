import * as fs from 'fs';
import * as path from 'path';

import * as rimraf from 'rimraf';

import config from '../config';
import { extract_frontmatter, slugify, stringify } from '../utils'

const CARDS_DIR = path.resolve(__dirname, '../../cards_old');
const NEW_DIR = path.resolve(__dirname, '../../cards');

function copyCards(src: string, dest: string): void {
  const card_paths = fs.readdirSync(src).filter(x => config.IGNORED_FILES.indexOf(x) === -1);
  const cards = [];
  card_paths.forEach(slug => {
    const contents = fs.readFileSync(`${src}/${slug}/card.md`, 'utf8');
    fs.writeFileSync(`${dest}/${slug}.md`, contents.replace(config.REGEX.image_url, `media/${slug}_$&`));
  });
}

// images
function copyImages(src: string, dest: string): void {
  const card_paths = fs.readdirSync(src).filter(x => config.IGNORED_FILES.indexOf(x) === -1);
  card_paths.forEach(slug => {
    const images = fs.readdirSync(`${src}/${slug}`).filter(x => x.match(config.REGEX.image_file) !== null);
    if (images.length > 0) moveImages(slug, images, src, dest);
  });
}

function moveImages(slug: string, images: string[], src: string, dest: string): void {
  images.forEach(image => {
    fs.writeFileSync(`${dest}/${slug}_${image}`, fs.readFileSync(`${src}/${slug}/${image}`));
  });
}


rimraf.sync(`${NEW_DIR}/*`);
fs.mkdirSync(`${NEW_DIR}/media`);
copyCards(CARDS_DIR, NEW_DIR);
copyImages(CARDS_DIR, `${NEW_DIR}/media`);

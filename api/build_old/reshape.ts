import * as fs from 'fs';
import * as path from 'path';

import * as yaml from 'js-yaml';
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
    const { body, updates, categories, ...frontmatter } = extract_frontmatter(contents);
    const new_body = body.replace(config.REGEX.image_url, `media/${slug}_$&`);
    const new_updates = Array.isArray(updates) ? updates[0] : null;
    const new_cats = categories.map(cat => cat.name);
    const new_content = `---\n${yaml.safeDump({...frontmatter, updated: new_updates, categories: new_cats })}---\n${new_body}`;
    fs.writeFileSync(`${dest}/${slug}.md`, new_content);
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

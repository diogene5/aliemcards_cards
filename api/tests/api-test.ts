import { readdirSync, readFileSync } from 'fs';
import * as path from 'path';

import config from '../build/config';
import CardFactory from '../build/CardFactory';


// run build on test cards
const cf = new CardFactory(path.join(__dirname, './cards'), path.join(__dirname, './dist'));
cf.writeEndpoints();

// compare built endpoints to snapshots
const slugs = readdirSync(path.join(__dirname, './snapshots/cards'));
const append_cards = slugs.map(slug => `cards/${slug}`);
const endpoints = [
  'authors.json',
  'cards.json',
  'cardsummaries.json',
  'categories.json',
  'recent.json',
  ...append_cards
];

endpoints.forEach(ep => {
  const snap = readFileSync(path.join(__dirname, `./snapshots/${ep}`));
  const test = readFileSync(path.join(__dirname, `./dist/${ep}`));
  if (snap.compare(test) !== 0) throw Error(`Error in ${ep} build`);
});

// compare built image directories to snapshop image directory
interface imageTree {
  [dir: string]: string[]
}

function buildTree(dir: string): imageTree {
  const tree = {};
  const slugs = readdirSync(path.join(__dirname, dir));
  slugs.forEach(slug => {
    const images = readdirSync(path.join(__dirname, `${dir}/${slug}`)).filter(x => x.match(config.REGEX.image_file) !== null);
    if (images.length > 0) tree[slug] = images;
  });
  return tree;
}

const a = JSON.stringify(buildTree('./snapshots/images'));
const b = JSON.stringify(buildTree('./dist/images'));
if ( a !== b) throw Error(`Error in images build`);

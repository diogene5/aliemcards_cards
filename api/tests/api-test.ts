import { readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';

import config from '../build/config';
import CardFactory from '../build/CardFactory';
import { errorHandler } from '../build/utils';

// build test files
export function buildTest() {
  rimraf.sync(path.join(__dirname, './dist/*'));
  const cf = new CardFactory(path.join(__dirname, './cards'), path.join(__dirname, './dist'));
  cf.writeEndpoints();
}

// compare built endpoints to snapshots
export function checkEndpoints(errorbin: Error[]) {
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
    if (snap.compare(test) !== 0) errorbin.push(Error(`Error in  builds: ${ep}`));
  });
}


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

export function checkImageDirs(errorbin: Error[]) {
  const a = JSON.stringify(buildTree('./snapshots/images'));
  const b = JSON.stringify(buildTree('./dist/images'));
  if ( a !== b) errorbin.push(Error(`Error in builds: images`));
}

// run the tests
const errorbin= [];
buildTest();
checkEndpoints(errorbin);
checkImageDirs(errorbin);

errorHandler(errorbin, '✅  API Build Tests passed', 'API Build Errors present');

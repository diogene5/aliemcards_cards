import { readdirSync, readFileSync } from 'fs';

import config from '../config';
import buildEndpoints from '../build/buildEndpoints';
import { errorHandler } from '../utils';

// compare built endpoints to snapshots
function checkEndpoints(dist_dir: string, snap_dir: string, errorbin: Error[]): void {
  const cards_json = readdirSync(`${snap_dir}/cards`);
  const append_dir = cards_json.map(slug => `cards/${slug}`);
  const endpoints = [
    'authors.json',
    'cards.json',
    'cardsummaries.json',
    'categories.json',
    'recent.json',
    ...append_dir
  ];

  endpoints.forEach(ep => {
    const snap = readFileSync(`${snap_dir}/${ep}`);
    const test = readFileSync(`${dist_dir}/${ep}`);
    if (snap.compare(test) !== 0) errorbin.push(Error(`Error in  builds: ${ep}`));
  });
}

// compare built image directories to snapshop image directory
interface imageTree {
  [dir: string]: string[]
}

function buildTree(dir: string): imageTree {
  const tree = {};
  const slugs = readdirSync(dir);
  slugs.forEach(slug => {
    const images = readdirSync(`${dir}/${slug}`).filter(x => x.match(config.REGEX.image_file) !== null);
    if (images.length > 0) tree[slug] = images;
  });
  return tree;
}

function checkImageDirs(dist_dir: string, snap_dir: string, errorbin: Error[]) {
  const a = JSON.stringify(buildTree(`${snap_dir}/images`));
  const b = JSON.stringify(buildTree(`${dist_dir}/images`));
  if (a !== b) errorbin.push(Error(`Error in builds: images`));
}

// full test
export default function(card_dir: string, dist_dir: string, snap_dir: string): void {
  const errorbin= [];
  buildEndpoints(card_dir, dist_dir);
  checkEndpoints(dist_dir, snap_dir, errorbin);
  checkImageDirs(dist_dir, snap_dir, errorbin);
  errorHandler(errorbin, 'API Build Tests passed', 'API Build Errors present');
}

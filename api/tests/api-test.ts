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

function checkImageDirs(dist_dir: string, snap_dir: string, errorbin: Error[]) {
  const a = JSON.stringify(readdirSync(`${snap_dir}/media`));
  const b = JSON.stringify(readdirSync(`${dist_dir}/media`));
  if (a !== b) errorbin.push(Error(`Error in builds: images`));
}

// full test
export default function(card_dir: string, dist_dir: string, snap_dir: string): void {
  const errorbin= [];
  buildEndpoints(card_dir, dist_dir, 'v1');
  const dist_versioned = `${dist_dir}/v1`;
  const snaps_versioned = `${snap_dir}/v1`;
  checkEndpoints(dist_versioned, snaps_versioned, errorbin);
  checkImageDirs(dist_versioned, snaps_versioned, errorbin);
  errorHandler(errorbin, 'API Build Tests passed', 'API Build Errors present');
}

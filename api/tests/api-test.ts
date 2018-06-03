import * as path from 'path';
import CardFactory from '../build/CardFactory';
import { readdirSync, readFileSync } from 'fs';

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

// compare image directories

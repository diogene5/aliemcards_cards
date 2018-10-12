import * as crypto from 'crypto';
import * as fs from 'fs';

import * as rimraf from 'rimraf';

import config from './config';
import { extract_frontmatter, slugify, stringify } from './utils'

// cards
function parseCard(slug: string, contents: string): Card {
  const { body, ...frontmatter } = extract_frontmatter(contents);
  const formatted_body = body
    .replace(config.REGEX.image_url, `${config.IMG_URL_PREFIX}/$&`);
  return { slug, ...frontmatter, body: formatted_body }
}

function buildCards(src: string): Card[] {
  const card_paths = fs.readdirSync(src).filter(x => config.IGNORED_FILES.indexOf(x) === -1);
  const cards = [];
  card_paths.forEach(filename => {
    const contents = fs.readFileSync(`${src}/${filename}`, 'utf8');
    cards.push(parseCard(filename.slice(0, -3), contents));
  });
  return cards;
}

// summaries
function buildSummaries(cards: Card[]): CardSummary[] {
  return cards.map(card => {
    const { body, ...summary } = card;
    return summary;
  });
}

// images
function copyImages(src: string, dest: string): void {
  const media_paths = fs.readdirSync(`${src}/media`);
  media_paths.forEach(media => {
    fs.writeFileSync(`${dest}/media/${media}`, fs.readFileSync(`${src}/media/${media}`));
  });
}

// categories, authors taxonomies
function unpackCardProp(card: CardSummary, property: string, container: {}): void {
  card[property].forEach(item => {
    const slug = item.slug ? item.slug : slugify(item);
    const name = item.name? item.name : item;
    if (container[slug]) {
      container[slug].cards.push(card);
    } else {
      container[slug] = { name, cards: [card] }
    }
  });
}

function buildTaxonomy(taxonomy: string, summaries: CardSummary[]): Taxonomy[] {
  const container = {};
  summaries.forEach(card => {
    unpackCardProp(card, taxonomy, container)
  });
  // flatten object into alphabetized array instead of object with properties
  return Object.keys(container).sort().map(key => ({ slug: key, ...container[key] }));
}

// order by created, updates
function buildRecent(sort_key: string, summaries: CardSummary[]): CardSummary[] {
  return summaries
    .map((card, index) => ({index, date: card[sort_key] }))
    .filter(x => x.date) // remove those with null updates after index extracted
    .sort((a,b) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0)
    .map(x => summaries[x.index]);
}

export default function(src: string, dest: string): void {
  // build cards and summaries
  const cards = buildCards(src);
  const summ = buildSummaries(cards);
  const hash = crypto.createHash('md5').update(JSON.stringify(cards)).digest('hex');

  //make or empty necessary sub directories
  if (fs.existsSync(dest)) {
    rimraf.sync(`${dest}/*`);
  } else {
    fs.mkdirSync(dest);
  }
  fs.mkdirSync(`${dest}/cards`);
  fs.mkdirSync(`${dest}/media`);

  // move images
  copyImages(src, dest);

  // master list
  fs.writeFileSync(`${dest}/cards.json`, stringify({ hash: hash, cards: cards }));

  // summary list
  fs.writeFileSync(
    `${dest}/cardsummaries.json`,
    stringify({ hash: hash, card_summaries: summ }),
  );

  // individual cards
  cards.forEach(card => {
    fs.writeFileSync(`${dest}/cards/${card.slug}.json`, stringify(card));
  });

  // taxonomies
  ['categories', 'authors'].forEach(tax => {
    fs.writeFileSync(`${dest}/${tax}.json`, stringify({ [tax]: buildTaxonomy(tax, summ) }));
  });

  // recent
  const recent = {
    created: buildRecent('created', summ).slice(0,5),
    updates: buildRecent('updated', summ).slice(0,5),
  }
  fs.writeFileSync(`${dest}/recent.json`, stringify(recent));
}

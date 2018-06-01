import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import config from './config';
import { extract_frontmatter, slugify, stringify } from './utils'

export default class CardFactory {

  card_dir: string;
  api_dir: string;
  cards: Card[];
  summaries: CardSummary[];
  hash: string;

  constructor() {
    this.card_dir = config.CARD_DIR;
    this.api_dir = config.API_DIR;
    this.cards = this.buildCards();
    this.summaries = this.buildSummaries();
    this.hash = crypto.createHash('md5').update(JSON.stringify(this.cards)).digest('hex');
  }

  writeEndpoints(): void {
    // api directory emptied by build script, make necessary sub directory
    fs.mkdirSync(`${this.api_dir}/cards`);
    fs.mkdirSync(`${this.api_dir}/images`);
    // move images
    this.copyImages();
    // master list
    fs.writeFileSync(`${this.api_dir}/cards.json`, stringify({ hash: this.hash, cards: this.cards }));
    // summary list
    fs.writeFileSync(
      `${this.api_dir}/cardsummaries.json`,
      stringify({ hash: this.hash, card_summaries: this.summaries }),
    );
    // individual cards
    this.cards.forEach(card => {
      fs.writeFileSync(`${this.api_dir}/cards/${card.slug}.json`, stringify(card));
    });
    // taxonomies
    ['categories', 'authors'].forEach(tax => {
      fs.writeFileSync(`${this.api_dir}/${tax}.json`, stringify({ [tax]: this.buildTaxonomy(tax) }));
    });
    // recent
    const recent = {
      created: this.buildRecent('created').slice(0, 4),
      updates: this.buildRecent('updates').slice(0,4),
    }
    fs.writeFileSync(`${this.api_dir}/recent.json`, stringify(recent));
  }

  // images
  copyImages(): void {
    const card_paths = fs.readdirSync(this.card_dir).filter(x => config.IGNORED_FILES.indexOf(x) === -1);
    card_paths.forEach(slug => {
      const images = fs.readdirSync(`${this.card_dir}/${slug}`).filter(x => x.match(config.REGEX.image_file) !== null);
      if (images.length > 0) this.moveImages(slug, images);
    });
  }

  moveImages(slug: string, images: string[]): void {
    fs.mkdirSync(`${this.api_dir}/images/${slug}`);
    images.forEach(image => {
      fs.writeFileSync(`${this.api_dir}/images/${slug}/${image}`, fs.readFileSync(`${this.card_dir}/${slug}/${image}`));
    });
  }

  // cards
  buildCards(): Card[] {
    const card_paths = fs.readdirSync(this.card_dir).filter(x => config.IGNORED_FILES.indexOf(x) === -1);
    const cards = [];
    card_paths.forEach(slug => {
      const contents = fs.readFileSync(`${this.card_dir}/${slug}/card.md`, 'utf8');
      cards.push(this.parseCard(slug, contents));
    });
    return cards;
  }

  parseCard(slug: string, contents: string): Card {
    const { body, ...frontmatter } = extract_frontmatter(contents);
    const formatted_body = body
      .replace(config.REGEX.image_url, `${config.IMG_URL_PREFIX}/${slug}/$&`)
      .replace(config.REGEX.markdownH1, '');
    return { slug, ...frontmatter, body: formatted_body }
  }

  // summaries
  buildSummaries(): CardSummary[] {
    return this.cards.map(card => {
      const { body, ...summary } = card;
      return summary;
    });
  }

  // categories, authors taxonomies
  buildTaxonomy(taxonomy: string): Taxonomy[] {
    const container = {};
    this.summaries.forEach(card => {
      this.unpackCardProp(card, taxonomy, container)
    });
    // flatten object into array instead of object with properties
    return Object.keys(container).map(key => ({ slug: key, ...container[key] }));
  }

  unpackCardProp(card: CardSummary, property: string, container: {}): void {
    card[property].forEach(item => {
      const slug = slugify(item);
      if (container[slug]) {
        container[slug].cards.push(card);
      } else {
        container[slug] = { name: item, cards: [card] }
      }
    });
  }

  // order by created, updates
  buildRecent(sort_key): CardSummary[] {
    return this.summaries
      .map((card, index) => ({index, date: Array.isArray(card[sort_key]) ? card[sort_key][0] : card[sort_key] }))
      .filter(x => x.date) // remove those with null updates after index extracted
      .sort((a,b) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0)
      .map(x => this.summaries[x.index]);
  }
}

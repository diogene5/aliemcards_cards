import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as yaml from 'js-yaml';

import config from './config';

export function extract_raw_frontmatter(contents: string): RawFrontMatter {
  const regex = config.REGEX.frontmatter;
  const matches = contents.match(regex);
  let frontmatter = (matches[2] !== undefined) ? <RawFrontMatter>yaml.safeLoad(matches[2]) : null;
  const body = (matches[3] !== undefined) ? matches[3] : null;
  if (frontmatter) {
    return { 
      title: frontmatter.title,
      authors: frontmatter.authors,
      categories: frontmatter.categories,
      created: frontmatter.created,
      updated: frontmatter.updated,
      body: body 
    }
  }
}

export function extract_frontmatter(contents: string): Card {
  const raw = extract_raw_frontmatter(contents);
  if (raw) {
    return { 
      title: raw.title,
      authors: raw.authors,
      categories: raw.categories.map(cat => ({ slug: slugify(cat), name: cat })),
      created: raw.created,
      updated: raw.updated,
      body: raw.body 
    }
  }
}

export function slugify(string: string): string {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function stringify(x: any): string {
  return JSON.stringify(x, null, '\t');
  //return JSON.stringify(x);
}

export function errorHandler(errorbin: Error[], successmsg: string, failmsg: string) {
  if (errorbin.length > 0) {
    errorbin.forEach(err => {
      console.error('❌  ', err.message);
    });
    throw Error(failmsg);
  } else {
    console.log('✅  ', successmsg);
  }
}

export function forEachCardContent(src: string, dest: string, callback: (card: RawFrontMatter) => any) {
  if (fs.existsSync(dest)) {
    rimraf.sync(`${dest}/*`);
  } else {
    fs.mkdirSync(dest);
  }
  const card_paths = fs.readdirSync(src).filter(x => config.IGNORED_FILES.indexOf(x) === -1);
  card_paths.forEach(filename => {
    const contents = extract_raw_frontmatter(fs.readFileSync(`${src}/${filename}`, 'utf8'));
    const new_contents = callback(contents);
    fs.writeFileSync(`${dest}/${filename}`, new_contents);
  });
}
import * as yaml from 'js-yaml';

import config from './config';

export function extract_frontmatter(contents: string): Card {
  const regex = config.REGEX.frontmatter;
  const matches = contents.match(regex);
  let frontmatter = (matches[2] !== undefined) ? <RawFrontMatter>yaml.safeLoad(matches[2]) : null;
  const body = (matches[3] !== undefined) ? matches[3] : null;
  if (frontmatter) {
    return { 
      title: frontmatter.title,
      authors: frontmatter.authors,
      categories: frontmatter.categories.map(cat => ({ slug: slugify(cat), name: cat })),
      created: frontmatter.created,
      updated: frontmatter.updated,
      body: body 
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
  //return JSON.stringify(x, null, '\t');
  return JSON.stringify(x);
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

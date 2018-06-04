import * as yaml from 'js-yaml';

import config from './config';

export function extract_frontmatter(contents: string): Card {
  const regex = config.REGEX.frontmatter;
  const matches = contents.match(regex);
  const frontmatter = (matches[2] !== undefined) ? yaml.safeLoad(matches[2]) : null;
  const body = (matches[3] !== undefined) ? matches[3] : null;
  if (frontmatter) return { ...<CardSummary>frontmatter, body }
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
}

export function errorHandler(errorbin: Error[], successmsg: string, failmsg: string) {
  if (errorbin.length > 0) {
    errorbin.forEach(err => {
      console.error('❌ ', err.message);
    });
    throw Error(failmsg);
  } else {
    console.log(successmsg);
  }
}
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import config from '../config';
import { forEachCardContent, extract_raw_frontmatter, stringify } from '../utils';

// forEachCardContent(config.CARDS_DIR, path.resolve(__dirname, '../../new_cards'), (fm) => {
//   const { title, authors, body, ...frontmatter } = <RawFrontMatter>fm;
//   const new_authors = authors.map(name => ({ author: name }));
//   const new_fm = { title, authors: new_authors, ...frontmatter };
//   return `---\n${yaml.dump(new_fm)}---\n${body}`;
// });

const filex = fs.readFileSync(path.resolve(__dirname, '../../cards/aorta-ultrasound.md'), 'utf8');
const fm = extract_raw_frontmatter(filex);
console.log(stringify(fm));
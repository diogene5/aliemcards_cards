import * as path from 'path';
import * as yaml from 'js-yaml';
import config from '../config';
import { forEachCardContent } from '../utils';
import { YAMLException } from '../../node_modules/@types/js-yaml';

forEachCardContent(config.CARDS_DIR, path.resolve(__dirname, '../../new_cards'), (fm) => {
  const { title, authors, body, ...frontmatter } = <RawFrontMatter>fm;
  const new_authors = authors.map(name => ({ author: name }));
  const new_fm = { title, authors: new_authors, ...frontmatter };
  return `---\n${yaml.dump(new_fm)}---\n${body}`;
});

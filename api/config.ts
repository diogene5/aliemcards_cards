import * as path from 'path';

export default {
  DIST_DIR: path.resolve(__dirname, '../dist'),
  CARDS_DIR: path.resolve(__dirname, '../cards'),
  IGNORED_FILES: ['.DS_Store', 'announcements.yml', 'media'],
  IMG_URL_PREFIX: 'https://aliemcards.netlify.com',
  REGEX: {
    image_url: new RegExp(/(\/?)(media\/[\w-]+\.)(png|jpg|jpeg|gif)/, 'gi'),
    image_file: new RegExp(/\.(gif|jpg|jpeg|tiff|png)$/, 'i'),
    markdownH1: new RegExp(/^#(?!#).+/, 'm'),
    frontmatter: new RegExp(/(^-{3}(?:\r\n|\r|\n)([\w\W]*?)-{3}(?:\r\n|\r|\n))?([\w\W]*)*/),
    hasReferenceHeading: new RegExp(/## References/),
    imagesWithoutAltText: new RegExp(/\!\[\]\(image-\d{1,2}\.\w+\)/, 'gi'),
    dateStringFormat: new RegExp(/^\d{4}\/\d{2}\/\d{2}$/),
  },
}

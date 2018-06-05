import * as path from 'path';

import api_test from './api-test';
import card_linter from './card-linter';

const card_dir = path.join(__dirname, './cards');
const dist_dir = path.join(__dirname, './dist');
const snap_dir = path.join(__dirname, './snapshots');

// card linting first, if cards wrong, api won't work
card_linter(card_dir);
api_test(card_dir, dist_dir, snap_dir);

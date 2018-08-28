import * as path from 'path';
import buildEndpoints from '../buildEndpoints';

buildEndpoints(path.join(__dirname, './test_cards'), path.join(__dirname, './snapshots'));

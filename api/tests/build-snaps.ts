import * as path from 'path';

import CardFactory from '../build/CardFactory';

const cf = new CardFactory(path.join(__dirname, './test-cards'), path.join(__dirname, './snapshots'));
cf.writeEndpoints();

import config from './config';
import buildEndpoints from './buildEndpoints';

buildEndpoints(config.CARDS_DIR, config.DIST_DIR);

import config from '../config';
import buildEndpoints from './buildEndpoints';

buildEndpoints(config.CARD_DIR, config.API_DIR);

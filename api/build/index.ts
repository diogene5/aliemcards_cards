import config from './config';
import CardFactory from './CardFactory';

const cf = new CardFactory(config.CARD_DIR, config.API_DIR);
cf.writeEndpoints();

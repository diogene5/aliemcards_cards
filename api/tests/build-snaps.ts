import * as path from 'path';
import buildEndpoints from '../build/buildEndpoints';

buildEndpoints(path.join(__dirname, './cards'), path.join(__dirname, './snapshots'));

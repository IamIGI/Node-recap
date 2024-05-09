import * as http from 'http';

import { requestHandler } from './route';

const server = http.createServer(requestHandler);

server.listen(3000);

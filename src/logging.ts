import process from 'process';

import pino, { Logger } from 'pino';
import 'dotenv/config';

let logger: Logger;

if (process.env.PRETTY_LOGGING) {
    logger = pino({
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                // Put objects on a single line when logging
                singleLine: true,
            },
        },
    });
} else {
    logger = pino();
}

export default logger;

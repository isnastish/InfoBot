import logger from './logging';
import commands from './commands';
import { Session, getDefaultSession } from './types';

import process from 'process';

import { Telegraf, session, SessionStore } from 'telegraf';
import { callbackQuery, message } from 'telegraf/filters';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse incoming requests as json
app.use(bodyParser.json());

// We don't need to protect it with a mutext since it cannot
// be accessed by multiple threads.
const storage = new Map<string, string>();

const store: SessionStore<Session> = {
    get(key: string) {
        logger.info(`get session by key: ${key}`);

        const value = storage.get(key);
        return value ? JSON.parse(value) : null;
    },

    set(key: string, value: Session) {
        logger.info(`insert session with key: ${key}`);

        storage.set(key, JSON.stringify(value));
    },

    delete(key: string) {
        logger.info(`delete session by key: ${key}`);

        storage.delete(key);
    },
};

// When setting up webhooks, Telegram will send HTTP POST requests to your bot’s specified URL whenever there’s an update
const bot = new Telegraf(process.env.BOT_TOKEN as string);

// middleware
bot.use(
    session({
        defaultSession: getDefaultSession,
        store: store,
    })
);

bot.use(async (ctx, next) => {
    const chatId = ctx.chat?.id;

    let content: string = '';

    if (ctx.has(message('text'))) {
        content = `message: ${ctx.message.text}`;
    } else if (ctx.has(message('photo'))) {
        content = 'received photo';
    } else if (ctx.has(message('video'))) {
        content = 'received video';
    } else if (ctx.has(callbackQuery('data'))) {
        content = `button [${ctx.callbackQuery.data}] was pressed`;
    } // TODO: Handle else case

    logger.info(`chatId: ${chatId}, ${content}`);

    return await next();
});

// commands
bot.command('about', commands['about']);
bot.command('links', commands['links']);
bot.command('help', commands['help']);
bot.command('start', commands['start']);
bot.command('quit', async (ctx) => await ctx.leaveChat());

bot.on(message('text'), async (ctx) => {
    const message = ctx.message.text;
    await ctx.reply(`message received: ${message}`);
});

bot.on(message('photo'), async (ctx) => {
    // Get a photo with a largest resolution.
    const photo = ctx.message.photo[0];

    // Get file id which will be used to forward the photo back
    const fileId = photo.file_id;

    await ctx.replyWithPhoto(fileId, {
        caption: 'Here is your photo again!',
    });
});

bot.on(message('video'), async (ctx) => {
    const video = ctx.message.video;

    const fileId = video.file_id;

    await ctx.replyWithVideo(fileId, {
        caption: 'Here is your video back again!',
    });
});

bot.on(callbackQuery('data'), async (ctx) => {
    await commands[ctx.callbackQuery.data](ctx);
});

if (process.env.NODE_ENV === 'production') {
    app.post('/webhook', async (req: Request, res: Response) => {
        await bot.handleUpdate(req.body, res);
        res.status(200).send();
    });

    const PORT = process.env.PORT || 8080;

    bot.telegram.setWebhook(process.env.WEBHOOK_URL as string);

    app.listen(PORT, () => {
        logger.info(`Server is listening on port ${PORT}`);
    });
} else {
    bot.launch(() => logger.info('The bot was launched'));
}

process.once('SIGINT', () => {
    logger.info('SIGINT signal received');
    bot.stop('SIGINT signal is received');
});

process.once('SIGTERM', () => {
    logger.info('SIGTERM signal received');
    bot.stop('SIGTERM signal is received');
});

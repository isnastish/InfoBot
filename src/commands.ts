import { Context } from './types';

import { fmt, bold, link } from 'telegraf/format';

const commandListWithMarkup = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'About', callback_data: 'about' },
                { text: 'Links', callback_data: 'links' },
            ],
            [
                { text: 'Start', callback_data: 'start' },
                { text: 'Help', callback_data: 'help' },
            ],
        ],
    },
};

/* eslint-disable no-unused-vars */
interface Commands {
    readonly [key: string]: (ctx: Context) => Promise<void> | void;
}

const commands: Commands = {
    start: async (ctx: Context) => {
        await ctx.reply(
            fmt`
        Hello, welcome to ${bold`Info`} bot. 
Here is a list of commands that you can use.
        `,
            commandListWithMarkup
        );
    },

    help: async (ctx: Context) => {
        await ctx.reply(
            fmt`${bold`Choose the command`}`,
            commandListWithMarkup
        );
    },

    about: async (ctx: Context) => {
        await ctx.reply(fmt`
                Hello, my name is ${bold`Alexey Yevtushenko`} and I'm 24 years old.
    I work as a backend engineer at ${link('Mirado Consulting', 'https://www.mirado.com/')} in
    a vibrant capital of Sweden, Stockholm.`);
    },

    links: async (ctx: Context) => {
        await ctx.reply(fmt`
        ${bold`Social media:`} 
        1. ${link('GitHub profile', 'https://github.com/isnastish')}
        2. ${link('LinkedIn', 'https://www.linkedin.com/in/alexey-yevtushenko-b76b6a2a1/')}
        3. ${link('Instagram', 'https://www.instagram.com/yevtushenkoalexey/')}
        4. ${link('YouTube', 'https://www.youtube.com/@isnastish')}
        `);
    },
};

export default commands;

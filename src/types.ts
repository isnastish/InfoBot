import { Context as TelegrafCtx } from 'telegraf';
import type { Message as TelegrafMessage } from 'telegraf/types';

type Message = {
    text?: TelegrafMessage.TextMessage;
    photo?: TelegrafMessage.PhotoMessage;
    video?: TelegrafMessage.VideoMessage;
};

// Session to persist all messages from users.
type Session = {
    messages: Message[];
};

// NOTE: If I add non-optional session here, we won't be able
// to pass context to command handlers, since the type would be different.
// Don't really have an idea of how to resolve that currently.
interface Context extends TelegrafCtx {
    session?: Session;
}

// NOTE: Not entirely sure whether it's the best place where to put it.
const getDefaultSession = (): Session => {
    return {
        messages: [],
    };
};

export { Message, Context, Session, getDefaultSession };

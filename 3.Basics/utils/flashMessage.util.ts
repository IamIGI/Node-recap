import { Request } from 'express';

export enum FlashTypeMessage {
  Error = 'error',
}

const getMessage = (
  req: Request,
  messageType: FlashTypeMessage
): string | null => {
  const message = req.flash(messageType) as string[];
  let msg;
  if (message.length > 0) {
    msg = message[0];
  } else {
    msg = null;
  }

  return msg;
};

export default {
  getMessage,
};

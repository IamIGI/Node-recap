import * as fs from 'fs';

export function requestHandler(req: any, res: any) {
  const { url, method } = req;
  if (url === '/' && method === 'GET') {
    console.log('main-page');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body: Uint8Array[] = [];

    req.on('data', (chunk: Uint8Array) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      fs.writeFile('message.txt', parsedBody, (err) => {
        res.statusCode = 302;
        // res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
}

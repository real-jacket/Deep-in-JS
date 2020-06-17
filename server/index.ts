import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';

const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    console.log('request.httpVersion: ', request.httpVersion);
    console.log('request.method: ', request.method);
    console.log('request.url: ', request.url);
    console.log('request.headers: ', request.headers);
    const result = [];
    request.on('data', (chunk) => {
        result.push(chunk);
    });
    request.on('end', () => {
        const body = Buffer.concat(result).toString();
        console.log('body: ', body);
        response.statusCode = 300;
        response.setHeader('x-kk', 'dsd');
        response.write('1\n');
        response.write('2\n');
        response.write('3\n');
        response.end('hi');
    });
});


server.listen(8888);

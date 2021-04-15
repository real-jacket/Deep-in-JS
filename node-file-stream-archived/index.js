const request = require('request');
const fs = require('fs');
const upload = require('./utils/upload.js');
const crypto = require('crypto');

fs.existsSync('./null') && fs.unlinkSync('./null');
console.log('删除成功！');

const BufferCache = require('./utils/file-cache');
const chunkSplice = 2097152; // 2MB
const RETRY_COUNT = 3;

function getMd5(buffer) {
  let md5 = crypto.createHash('md5');
  md5.update(buffer);
  return md5.digest('hex');
}

module.exports = function (url, uploadURL, filename) {
  let bufferCache = new BufferCache(chunkSplice);
  let isFinished = false;

  function getChunks(options, onStartDownload, onDownloading, onDownloadClose) {
    return new Promise((resolve, reject) => {
      let totalLength = 0;
      const httpStream = request({
        method: 'GET',
        url: options.url,
      });
      const writeStream = fs.createWriteStream('./null');

      httpStream.pipe(writeStream);

      httpStream
        .on('response', (response) => {
          onStartDownload({
            headers: response.headers,
            filename: options.filename,
            onUploadFinished(err) {
              if (err) {
                return reject(err);
              }
              resolve();
            },
          });
        })
        .on('data', (chunk) => {
          totalLength += chunk.length;
          onDownloading(chunk, totalLength);
        });
      writeStream.on('close', () => {
        onDownloadClose(totalLength);
      });
    });
  }

  function sendChunks(_opt) {
    let chunkId = 0;
    let maxSending = 0;
    let stopSend = false;

    function send(options) {
      let readyCache = options.readyCache;
      let fresh = options.fresh;
      let retryCount = options.retry;
      let chunkIndex;

      let chunk = null;

      if (fresh) {
        if (readyCache.length === 0) {
          return Promise.resolve();
        }

        chunk = readyCache.shift();
        chunkIndex = chunkId;
        chunkId++;
      } else {
        chunk = options.data;
        chunkIndex = options.index;
      }

      console.log(`chunkIndex: ${chunkIndex}, buffer:${getMd5(chunk)}`);
      maxSending++;

      return upload(uploadURL, {
        chunk: {
          value: chunk,
          options: {
            filename: `${_opt.filename}_IDSPLIT_` + chunkIndex,
          },
        },
      })
        .then((response) => {
          maxSending--;
          let json = JSON.parse(response);

          if (json.errno === 0 && readyCache.length > 0) {
            return send({
              retry: RETRY_COUNT,
              fresh: true,
              readyCache: readyCache,
            });
          }

          return Promise.resolve(json);
        })
        .catch((err) => {
          if (retryCount > 0) {
            return send({
              retry: retryCount - 1,
              index: chunkIndex,
              fresh: false,
              data: chunk,
              readyCache: readyCache,
            });
          } else {
            console.log(`upload failed of chunkIndex: ${chunkIndex}`);
            stopSend = true;
            return Promise.reject(err);
          }
        });
    }

    return new Promise((resolve, reject) => {
      let readyCache = bufferCache.getChunks();
      let threadPool = [];

      let sendTimer = setInterval(() => {
        if (maxSending < 4 && readyCache.length > 0) {
          for (let i = 0; i < 4; i++) {
            let thread = send({
              retry: RETRY_COUNT,
              fresh: true,
              readyCache: readyCache,
            });
            threadPool.push(thread);
          }
        } else if ((isFinished && readyCache.length === 0) || stopSend) {
          clearInterval(sendTimer);
          if (!stopSend) {
            let lastChunk = bufferCache.getRemainChunks();
            readyCache.push(lastChunk);
            threadPool.push(
              send({
                retryCount: RETRY_COUNT,
                fresh: true,
                readyCache: readyCache,
              })
            );
          }

          Promise.all(threadPool)
            .then((res) => {
              console.log('++++++ threadPool response array : ', res);
              console.log('send success!');
              resolve();
            })
            .catch((err) => {
              console.log('send error');
              reject(err);
            });
        }
      }, 200);
    });
  }

  function onStart(options) {
    const { headers, onUploadFinished, filename } = options;
    console.log('start downloading, headers is : ', headers);
    sendChunks({
      filename: filename,
    })
      .then(() => {
        onUploadFinished();
      })
      .catch((err) => {
        onUploadFinished(err);
      });
  }

  function onData(chunk, downloadLength) {
    // console.log('write ' + chunk.length + 'KB into cache');
    bufferCache.pushBuf(chunk);
  }

  function onFinished(totalLength) {
    let chunkCount = Math.ceil(totalLength / chunkSplice);
    console.log('total chunk count is : ' + chunkCount);
    isFinished = true;
  }

  return getChunks(
    {
      url: url,
      filename: filename,
    },
    onStart,
    onData,
    onFinished
  );
};

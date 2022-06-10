const https = require('https');

const npmCheck = (packageName) => {
  const url = `https://registry.npmjs.org/${packageName}`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const { statusCode } = res;
          const result = JSON.parse(data);
          resolve({ statusCode, data: result });
        });
      })
      .on('error', (e) => {
        reject(e);
      });
  });
};

(async function main() {
  const res = await npmCheck('gulu-k');
  if (res.statusCode >= 300) {
    console.log('error', res.statusCode);
  } else {
    console.log(res.data);
  }
})();

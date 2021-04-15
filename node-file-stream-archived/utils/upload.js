const request = require('request');

function upload(url, data) {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url,
        formData: data,
      },
      function (err, response, body) {
        if (!err && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(err);
        }
      }
    );
  });
}

module.exports = upload;

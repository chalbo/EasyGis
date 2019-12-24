const request = require('../request');

export default {
  Single: ((() => {
    let singleMap = {};
    const get = singleName => singleMap[singleName];
    const create = (singleName, callback) => {
      if (singleMap[singleName] === undefined) {
        singleMap[singleName] = [];
      }
      singleMap[singleName] = typeof callback === 'function' ? callback() : callback;
    };
    const off = (singleName, callback) => {
      if (singleName === undefined) {
        singleMap = {};
        return;
      }
      if (callback === undefined) {
        delete singleMap[singleName];
        return;
      }
      if (singleMap[singleName] === undefined) {
        return;
      }
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < singleMap[singleName].length; i++) {
        if (singleMap[singleName][i] === callback) {
          singleName.splice(i, 1);
          return;
        }
      }
    };
    const SingleObj = {
      create,
      off,
      get,
    };

    return SingleObj;
  })()),

  async getAsync(func) {
    return await (() => new Promise((resolve, reject) => {
      func(resolve, reject);
    }));
  },

};

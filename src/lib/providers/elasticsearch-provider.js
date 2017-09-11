import elasticsearch from 'elasticsearch';
import helper from './helper.js';

export default class ElasticsearchProvider {
  bulkDelete(cluster, index, type, ids, batchSize = 1000) {
    function resolver(resolve, reject) {
      const client = new elasticsearch.Client({
        host: cluster,
        log: 'trace',
      });
      let promises = [];
      while(ids.length) {
        promises.push(client.bulk({
          body: helper.mapToBulkDelete(index, type, ids.splice(0, batchSize))
        }));
      }
      Promise.all(promises).then(() => {
        resolve();
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
    }
    return new Promise(resolver);
  }
}

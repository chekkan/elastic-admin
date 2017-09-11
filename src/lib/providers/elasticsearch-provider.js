import elasticsearch from 'elasticsearch';
import helper from './helper.js';

export default class ElasticsearchProvider {
  bulkDelete(cluster, index, type, ids) {
    function resolver(resolve, reject) {
      const client = new elasticsearch.Client({
        host: cluster,
        log: 'trace',
      });
      client.bulk({
        body: helper.mapToBulkDelete(index, type, ids)
      }, function (err, resp) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    }
    return new Promise(resolver);
  }
}

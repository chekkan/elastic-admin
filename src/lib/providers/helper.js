function mapToBulkDelete(indexName, typeName, data) {
  return data.map((id) => ({
    "delete": { "_index": indexName, "_type": typeName, "_id": id }
  }));
}

module.exports = {
  mapToBulkDelete
}

import couchbase from 'couchbase';


export async function couchbaseConnect() {
  return await couchbase.connect(
    'couchbases://cb.6iovorxmoabw3rax.cloud.couchbase.com',
    {
      username: 'carlos',
      password: 'som$Complex33',
    }
  );
}

export function getBucket(cluster) {
  return cluster.bucket('library');
}

export function getCollection(scope) {
  return scope.collection('books');
}
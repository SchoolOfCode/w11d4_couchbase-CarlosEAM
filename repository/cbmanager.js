import couchbase from 'couchbase';
import  'dotenv/config';


export async function couchbaseConnect() {
  return await couchbase.connect(
    process.env.COUCHBASE_URI,
    {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    }
  );
}

export function getBucket(cluster) {
  return cluster.bucket('library');
}

export function getCollection(scope) {
  return scope.collection('books');
}
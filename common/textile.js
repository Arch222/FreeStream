import * as Utilities from "~/common/utilities";

import { Buckets, PrivateKey, Filecoin, Client, ThreadID } from "@textile/hub";
//Import major packages from the main hub as stated in the tutorial

const GB_BYTES = 104857600 * 10;

const PRIVATE_KEY_INFORMATION = {
  key: process.env.TEXTILE_HUB_KEY,
  secret: process.env.TEXTILE_HUB_SECRET,
};

const BUCKET_NAME = "data";

export const generateToken = async () => {
  const identity = await PrivateKey.fromRandom();
  const api = identity.toString();
  return api;
};

export const getFilecoinAPIFromUserToken = async ({ key }) => {
  const identity = await PrivateKey.fromString(key);
  const filecoin = await Filecoin.withKeyInfo(PRIVATE_KEY_INFORMATION);
  await filecoin.getToken(identity);

  return {
    filecoin,
  };
};

export const getBucketAPIFromUserToken = async ({ key, bucketName }) => {
  const identity = await PrivateKey.fromString(key);
  const name = U.isEmpty(bucketName) ? BUCKET_NAME : bucketName;
  const buckets = await Buckets.withKeyInfo(PRIVATE_KEY_INFORMATION);
  await buckets.getToken(identity);

  let root = null;
  try {
    const created = await buckets.getOrCreate(name);
    root = created.root;
  } catch (e) {
    console.log(e);
    return {
      error: e.message,
      buckets: null,
      bucketKey: null,
      bucketRoot: null,
    };
  }

  if (!root) {
    return { error: "Missing root", buckets: null, bucketKey: null, bucketRoot: null };
  }

  return {
    buckets,
    bucketKey: root.key,
    bucketRoot: root,
    bucketName: name,
  };
};

export const deleteBucket = async (options) => {
  const { buckets, bucketKey, bucketRoot, bucketName, error } = await getBucketAPIFromUserToken({
    key: options.key,
    bucketName: options.bucketName,
  });

  if (error) {
    return {
      error,
    };
  }

  return await buckets.remove(options.bucketKey);
};

export const createBucket = async (options) => {
  const { buckets, bucketKey, bucketRoot, bucketName, error } = await getBucketAPIFromUserToken({
    key: options.key,
    bucketName: options.bucketName,
  });

  if (error) {
    return {
      error,
    };
  }

  return bucketRoot;
};

export const listBuckets = async (options) => {
  const { buckets, bucketKey, bucketRoot, bucketName, error } = await getBucketAPIFromUserToken({
    key: options.key,
    bucketName: options.bucketName,
  });

  let userBuckets = [];
  try {
    userBuckets = await buckets.list();
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to fetch bucket list",
    };
  }

  for (let k = 0; k < userBuckets.length; k++) {
    try {
      const path = await buckets.listPath(userBuckets[k].key, "/");
      const data = path.item;

      userBuckets[k].bucketSize = data.size;
      userBuckets[k].cid = data.cid;
      userBuckets[k].isDir = data.isDir;
      userBuckets[k].items = data.items;
    } catch (e) {
      console.log(e);
      userBuckets[k].bucketSize = 0;
      userBuckets[k].cid = "FAILED TO RETRIEVE";
      userBuckets[k].isDir = false;
      userBuckets[k].items = [];
    }
  }

  return userBuckets;
};

import Cors from "cors";


import * as UTILITIES_MAIN from "~/common/utilities";
import * as SERVER_MAIN from "~/common/server";
import * as TEXTILE_MAIN from "~/common/textile";

const HIGH_WATER_MARK = 1024 * 1024 * 3;
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function bucketsAddFile(req, res) {
  await SERVER_MAIN.cors(req, res);

  const { bucketName, bucketKey, key } = UTILITIES_MAIN.getBucketDataFromHeader(req.headers.authorization);

  if (UTILITIES_MAIN.isEmpty(bucketName)) {
    return res.status(500).json({ error: true });
  }

  if (UTILITIES_MAIN.isEmpty(bucketKey)) {
    return res.status(500).json({ error: true });
  }

  if (UTILITIES_MAIN.isEmpty(key)) {
    return res.status(500).json({ error: true });
  }

  const { buckets, bucketRoot, error } = await TEXTILE_MAIN.getBucketAPIFromUserToken({
    key,
    bucketName,
  });

  if (error) {
    return res.status(500).json({ error });
  }

  const busboy = new BusBoyConstructor({
    headers: req.headers,
    highWaterMark: HIGH_WATER_MARK,
  });

  let push;
  const _createStreamAndUploadToTextile = async (SERVER_MAIN) => {
    return new Promise(function (resolve, reject) {
      SERVER_MAIN.on("file", async function (fieldname, stream, filename, encoding, mime) {
        console.log(filename);
        console.log(encoding);
        console.log(mime);

        push = await buckets
          .pushPath(bucketKey, filename, stream, {
            progress: function (num) {
              if (num % (HIGH_WATER_MARK * 5) !== 0) {
                return;
              }

              console.log(UTILITIES_MAIN.bytesToSize(num));
            },
          })
          .catch((e) => {
            console.log(e.message);
          });

        return resolve();
      });

      SERVER_MAIN.on("error", function (e) {
        throw new Error(e.message);
      });

      return req.pipe(SERVER_MAIN);
    });
  };

  console.log("upload start!");

  console.log("upload success!");

  return res.json({ success: true });
}

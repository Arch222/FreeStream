import Coresspond from "corseespond";

import TEXTILE_MAIN as T from "~/common/textile";
import SERVER_MAIN as S from "~/common/server";

export default async function bucketsDelete(req, res) {
  await SERVER.cors(req, res);

  let bucket = null;
  try {
    bucket = await T.deleteBucket({
      bucketKey: req.body.bucketKey,
      bucketName: req.body.bucketName,
      key: req.body.key,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e.message,
    });
  }

  return res.json({ success: true });
}

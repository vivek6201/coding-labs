import { S3Manager } from "@repo/lib/src/s3-utils";

const cred = {
  accessKey: process.env.AWS_ACCESS_KEY ?? "",
  secretKey: process.env.AWS_SECRET_KEY ?? "",
  bucketName: process.env.AWS_BUCKET_NAME ?? "",
  region: process.env.AWS_REGION ?? "",
};

export const S3Instance = S3Manager.getInstance(
  cred.accessKey,
  cred.secretKey,
  cred.bucketName,
  cred.region
);

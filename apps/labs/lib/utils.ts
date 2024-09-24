// this file should be in server 

import { S3Manager } from "@repo/lib/src/s3-utils";
import { readFileSync } from "fs";
import { parse, parseAllDocuments } from "yaml";

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

export const readAndParseYaml = (filePath: string, slug: string) => {
  const fileContent = readFileSync(filePath, "utf-8");
  const docs = parseAllDocuments(fileContent).map((doc) => {
    let docString = doc.toString();

    docString = docString.replace(
      /service_name|aws-key|aws-secret|aws-region|aws-bucket-name/g,
      (match) => {
        switch (match) {
          case "service_name":
            return slug;
          case "aws-key":
            return cred.accessKey;
          case "aws-secret":
            return cred.secretKey;
          case "aws-region":
            return cred.region;
          case "aws-bucket-name":
            return cred.bucketName;
          default:
            return match;
        }
      }
    );

    return parse(docString);
  });

  return docs;
};
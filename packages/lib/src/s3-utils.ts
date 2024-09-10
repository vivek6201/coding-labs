import { S3 } from "@aws-sdk/client-s3";

export class S3Manager {
  private accessKey: string;
  private secretKey: string;
  private bucketName: string;
  private s3Region: string;
  private static _instance: S3Manager;
  private client: S3;

  private constructor(
    accessKey: string,
    secretKey: string,
    bucketName: string,
    region: string
  ) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.bucketName = bucketName;
    this.s3Region = region;

    //initializing client
    this.client = new S3({
      region: this.s3Region,
      credentials: {
        accessKeyId: this.accessKey ?? "",
        secretAccessKey: this.secretKey ?? "",
      },
    });
  }

  public static getInstance(
    accessKey: string,
    secretKey: string,
    bucketName: string,
    region: string
  ) {
    if (!S3Manager._instance)
      this._instance = new S3Manager(accessKey, secretKey, bucketName, region);

    return this._instance;
  }

  public get S3Client() {
    return this.client;
  }

  public async copyS3Folder(
    basePrefix: string,
    destinationPrefix: string,
    continuationToken?: string
  ) {
    try {
      const listObjectParams = {
        Bucket: this.bucketName,
        Prefix: basePrefix,
        ContinuationToken: continuationToken,
      };

      const listedObjects = await this.client.listObjectsV2(listObjectParams);

      if (!listedObjects.Contents || listedObjects.Contents.length === 0)
        return;

      await Promise.all(
        listedObjects.Contents.map(async (object) => {
          if (!object.Key) return;
          let destinationKey = object.Key.replace(
            basePrefix,
            destinationPrefix
          );
          let copyParams = {
            Bucket: this.bucketName ?? "",
            CopySource: `${this.bucketName}/${object.Key}`,
            Key: destinationKey,
          };

          await this.client.copyObject(copyParams);
          console.log(`Copied ${object.Key} to ${destinationKey}`);
        })
      );

      if (listedObjects.IsTruncated) {
        listObjectParams.ContinuationToken =
          listedObjects.NextContinuationToken;
        await this.copyS3Folder(
          basePrefix,
          destinationPrefix,
          continuationToken
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
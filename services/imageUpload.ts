import s3 from "../config/s3.config";

interface S3FileProps {
    bucketName: string;
    key: string;
    body: any;
    contentType: string;
}
interface S3FileDeleteProps {
    bucketName: string;
    key: string;
}

export const s3FileUpload = async ({ bucketName, key, body, contentType }: S3FileProps) => {
    return await s3
        .upload({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
        .promise();
};

export const deleteFile = async ({ bucketName, key }: S3FileDeleteProps) => {
    return await s3
        .deleteObject({
            Bucket: bucketName,
            Key: key,
        })
        .promise();
};

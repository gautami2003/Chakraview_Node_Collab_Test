const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME, AWS_CLOUD_FRONT_URL, AWS_REGION, AWS_SECRET_ACCESS_KEY } = require("../configs/env.config");

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

const uploadFile = async (buffer, fileName, mimeType) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
    };
    await s3Client.send(new PutObjectCommand(params));
    return `${AWS_CLOUD_FRONT_URL}/${fileName}`;
};

const deleteFile = async (fileName) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
    };
    await s3Client.send(new DeleteObjectCommand(params));
};


const getFile = async (fileName) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
    };
    return await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
};

module.exports = {
    uploadFile, deleteFile, getFile,
};

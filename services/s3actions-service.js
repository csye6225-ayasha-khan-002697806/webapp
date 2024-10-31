// services/s3Service.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { statsdClient } from '../services/statD.js'
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory if needed
dotenv.config({
  override: true,
  path: path.join(__dirname, '../.env')
});

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const s3Upload = async (fileName, file) => {

    const startUploadImage = Date.now();
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    console.log("key "+params.Key);
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const duration = Date.now() - startUploadImage; // Calculate duration
    statsdClient.timing('s3.call_for_upload_image.duration', duration); 

    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
};

export const s3Delete = async (fileName) => {

    console.log("Deleting image from S3 with key:", fileName);

    const startdeleteImage = Date.now();
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
    };

    const command = new DeleteObjectCommand(params);

    try {
        await s3Client.send(command);
        console.log(`Successfully deleted ${fileName} from S3`);
    } catch (error) {
        console.error("Error deleting from S3:", error);
        throw new Error('Failed to delete image from S3');
    }finally{
        const duration = Date.now() - startdeleteImage; // Calculate duration
        statsdClient.timing('s3.call_for_delete_image.duration', duration); 
    }
    
};

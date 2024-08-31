'use server';

import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: fromEnv(),
});

export const listPlayerContents = async () => {
	const command = new ListObjectsV2Command({
		Bucket: process.env.AWS_S3_BUCKET_NAME!,
		Prefix: 'player/',
	});
	const response = await s3Client.send(command);

	return response.Contents;
};

export const getFileUrl = async (Key: string) => {
	const command = new GetObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME!,
		Key,
	});

	try {
		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
		return url;
	} catch (error) {
		console.error('Error generating pre-signed URL', error);
		throw new Error('Could not generate pre-signed URL');
	}
};
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1',
})

export async function uploadToS3(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || 'agrimind-uploads',
    Key: `reports/${Date.now()}-${filename}`,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read',
  }
  const result = await s3.upload(params).promise()
  return result.Location
}

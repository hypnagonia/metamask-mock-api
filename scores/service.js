const AWS = require('aws-sdk');
const fs = require('fs');
const StreamZip = require('node-stream-zip');

const s3 = new AWS.S3({
    accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY,
    region: process.env.YOUR_REGION
})

// Function to download a file from S3
function downloadFileFromS3(bucketName, fileName, destinationPath) {
    const params = {
        Bucket: bucketName,
        Key: fileName
    }

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destinationPath);
        const s3Stream = s3.getObject(params).createReadStream();

        s3Stream.on('error', (error) => {
            reject(error)
        });

        file.on('finish', () => {
            resolve(destinationPath);
        });

        s3Stream.pipe(file)
    });
}

// Function to unzip a file
function unzipFile(zipFilePath, destinationFolder) {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipFilePath,
            storeEntries: true
        });

        zip.on('error', (error) => {
            reject(error)
        });

        zip.on('ready', () => {
            zip.extract(null, destinationFolder, (err) => {
                if (err) {
                    reject(err)
                } else {
                    zip.close();
                    resolve(destinationFolder)
                }
            })
        })
    })
}

const bucketName = 'YOUR_BUCKET_NAME'
const fileName = 'your-archive.zip'
const destinationPath = 'local-path-to-save/archive.zip'
const destinationFolder = 'local-path-to-save/unzipped-files'

const getScores = async (bucketName, fileName, destinationPath) => {
    return downloadFileFromS3(bucketName, fileName, destinationPath)
        .then(() => {
            return unzipFile(destinationPath, destinationFolder)
        })
        .then((unzippedFolderPath) => {
            console.log(`Archive unzipped to: ${unzippedFolderPath}`)
        })
        .catch((error) => {
            console.error('Error:', error)
        })

}

module.exports = {
    getScores
}
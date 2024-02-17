const AWS = require('aws-sdk')
const fs = require('fs')
const StreamZip = require('node-stream-zip')
const path = require('path')

const s3 = new AWS.S3({
    accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY,
    region: process.env.YOUR_REGION
})

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

const getScores = async (bucketName, fileName) => {
    const destinationPath = path.join(__dirname, '../static/' + fileName)
    const destinationFolder = path.join(__dirname, '../static/' + fileName.split('.')[0] + '/')

    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
        console.log(`Folder "${destinationFolder}" created.`)
    }

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
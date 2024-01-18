const {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} = require('firebase/storage');

// Initialize Cloud Storage
const storage = getStorage();

const FileUpload = async (file) => {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
        storage,
        `files/${file.originalname + '       ' + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
        contentType: file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successfully uploaded.');
    return {
        message: 'file uploaded to firebase storage',
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
    };
};
const giveCurrentDateTime = () => {
    const today = new Date();
    const date =
        today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
};

module.exports = { FileUpload };
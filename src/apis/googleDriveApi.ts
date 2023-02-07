import fs from 'fs';
import { resolve } from 'path';
import { google } from 'googleapis';
import { IProfilePic } from '../api/models/ProfilePic';

import config from '../config/index';
const { google_folder_id } = config;

// const google_json_key = JSON.parse(process.env.GOOGLE_JSON_KEY);
const google_json_key = JSON.parse(
  fs.readFileSync(resolve('keys/google_json_key.json'), { encoding: 'utf-8' })
);

const auth = new google.auth.GoogleAuth({
  // keyFile: JSON.stringify(config.googleapikey),
  credentials: google_json_key,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const driveService = google.drive({
  version: 'v3',
  auth,
});

export async function uploadFileGoogleDrive(fileInfo: IProfilePic) {
  try {
    const fileMetaData = {
      name: fileInfo.filename,
      parents: [google_folder_id],
    };

    const media = {
      mimeType: fileInfo.mimetype,
      body: fs.createReadStream(fileInfo.url),
    };

    const response = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id',
    });

    fs.unlink(fileInfo.url, (err) => {
      if (err) throw err;
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
    return;
  }
}

export async function deleteFileGoogleDrive(
  fileId: string
): Promise<{ status: number; data: any }> {
  try {
    const response = await driveService.files.delete({
      fileId: fileId,
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

import fs from 'fs';
import { google } from 'googleapis';
import { IProfilePic } from '../api/models/ProfilePic';

import config from '../config/index';
const { google_folder_id, google_json_key } = config;

const auth = new google.auth.GoogleAuth({
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

export async function deleteFileGoogleDrive(fileId: string): Promise<{ status: number; data: any }> {
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

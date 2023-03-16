import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
const tmpFolder = path.resolve('tmp', 'uploads');

export default {
  dest: tmpFolder,
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, tmpFolder);
    },
    filename(req, file, cb) {
      const uuidFilename = crypto.randomUUID();
      const filename = `${uuidFilename}-${file.originalname}`;

      cb(null, filename);
    },
  }),

  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowMimeTypes = ['image/jpeg', 'image/gjpeg', 'image/png'];

    if (allowMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
};

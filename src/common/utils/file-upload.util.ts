import { diskStorage, Options, StorageEngine } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

export const getMulterConfig = (subfolder: string): Options => ({
    storage: diskStorage({
        destination: `./uploads/${subfolder}`,
        filename: (req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void): void => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }) as StorageEngine,
    fileFilter: (req: Request, file: Express.Multer.File, callback: (error: (Error | null), acceptFile: boolean) => void): void => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
});
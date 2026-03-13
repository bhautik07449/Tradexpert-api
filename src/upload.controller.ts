import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueName =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, uniqueName + extname(file.originalname));
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                    callback(new Error('Only image files allowed!'), false);
                }
                callback(null, true);
            },
        }),
    )
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        const imageUrl = `http://192.168.1.14:3030/uploads/${file.filename}`;

        return {
            message: 'Image uploaded successfully',
            url: imageUrl,
        };
    }
}
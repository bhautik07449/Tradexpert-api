import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                    callback(new BadRequestException('Only image files allowed!'), false);
                }
                callback(null, true);
            },
        }),
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is missing');
        }

        try {
            const result = await this.cloudinaryService.uploadFile(file);
            return {
                message: 'Image uploaded successfully',
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new BadRequestException('Image upload failed');
        }
    }
}
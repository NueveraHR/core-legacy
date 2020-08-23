import { DocumentDto } from '@hrms-core/dto/document.dto';
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Body,
    Req,
    Get,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { DocumentMangmentService } from '@hrms-core/core/document/document-mangment.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly documentMangmentService: DocumentMangmentService) {}

    @Get()
    getAllDocuments(): any {
        return this.documentMangmentService.findAllPaginated();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    uploadDocument(@Req() req: Request, @Body() documentDto: DocumentDto, @UploadedFile() file): any {
        return this.documentMangmentService.create(documentDto, req['user'].id, file);
    }

    @Put('/:documentId')
    updateDocument(@Param('documentId') documentId: string, @Body() documentDto: DocumentDto): any {
        return this.documentMangmentService.update(documentId, documentDto);
    }

    @Delete('/:documentId')
    deleteDocument(@Param('documentId') documentId: string): any {
        return this.documentMangmentService.delete(documentId);
    }
}

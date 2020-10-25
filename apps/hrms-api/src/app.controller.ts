/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Req,
    Res,
} from '@nestjs/common';
import { isOwner } from './employee/employee.resolver';

@Controller()
export class AppController {
    @Get('document/:userId/:imgId')
    serveStaticDocument(
        @Param('userId') userId,
        @Param('imgId') imgId,
        @Req() req,
        @Res() res,
    ) {
        if (!isOwner(req.user, userId)) {
            throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED);
        }
        return res.sendFile(`${userId}/${imgId}`, { root: 'public' });
    }
}

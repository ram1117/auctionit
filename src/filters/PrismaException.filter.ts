import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.code;

    console.error(`${statusCode ? statusCode : ''} ${exception.message}`);
    switch (statusCode) {
      case 'P2002':
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          error: 'ValueNotUnique',
          message: `${exception.meta.target[0]} already exists`,
        });

        break;
      case 'P2025':
        {
          response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.CONFLICT,
            error: 'NotFound',
            message: `${exception.message.replace(/\n/g, '')}`,
          });
        }
        break;
      case 'P2005':
        {
          response.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.CONFLICT,
            error: 'Error',
            message: `${exception.message.replace(/\n/g, '')}`,
          });
        }
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}

export default PrismaExceptionFilter;

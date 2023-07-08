import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error({
      code: exception.code,
      config: {
        method: exception.config.method,
        url: exception.config.url,
        data: exception.config.data,
      },
      response: {
        status: exception.response.status,
        statusText: exception.response.statusText,
        data: {
          error: exception.response.data.error,
          error_description: exception.response.data.error_description,
        },
      },
    });

    switch (exception.response.status) {
      case 401:
        response.status(401).json({
          statusCode: 401,
          message: 'Unauthorized',
        });

        break;
      case 403:
        response.status(403).json({
          statusCode: 403,
          message: 'Forbidden',
        });
        break;
      case 404:
        response.status(404).json({
          statusCode: 404,
          message: exception.message,
        });
        break;

      default:
        response.status(500).json({
          message: 'Internal server error',
        });
        break;
    }
  }
}

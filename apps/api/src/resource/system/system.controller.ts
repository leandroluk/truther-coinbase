import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {THealthcheck_Result} from '@repo/domain';
import * as services from './services';

@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(readonly moduleRef: ModuleRef) {}

  //#region healthcheck
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Healthcheck'})
  @ApiOkResponse({
    description: 'Application is healthy',
    schema: THealthcheck_Result.swagger,
  })
  async healthcheck(): Promise<THealthcheck_Result> {
    return await this.moduleRef.get(services.HealthcheckService).run();
  }
  //#endregion
}

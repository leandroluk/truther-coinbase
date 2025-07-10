import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {TSearchCoin_Query, TSearchCoin_Result} from '@repo/domain';
import {JwtAuthGuard} from '@repo/nest-auth';
import * as services from './services';

@ApiBearerAuth()
@ApiTags('coin')
@Controller('coin')
@UseGuards(JwtAuthGuard)
export class CoinController {
  constructor(private readonly moduleRef: ModuleRef) {}

  //#region searchCoin
  @Post('_search')
  @ApiOperation({summary: 'Search coin'})
  @ApiBody({schema: TSearchCoin_Query.swagger})
  @ApiOkResponse({description: 'Search successful'})
  @ApiBadRequestResponse({description: 'Invalid request'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  async searchCoin(@Body() query: TSearchCoin_Query): Promise<TSearchCoin_Result> {
    return this.moduleRef.get(services.SearchCoinService).run(query);
  }
  //#endregion
}

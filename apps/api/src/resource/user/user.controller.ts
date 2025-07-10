import {Body, Controller, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {TCreateUser_Data, TSearchUser_Query, TSearchUser_Result, TUpdateUserProfile_Data} from '@repo/domain';
import {JwtAuthGuard} from '@repo/nest-auth';
import * as services from './services';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly moduleRef: ModuleRef) {}

  //#region createUser
  @Post()
  @ApiOperation({summary: 'Create user'})
  @ApiBody({schema: TCreateUser_Data.swagger})
  @ApiBadRequestResponse({description: 'Invalid request'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiConflictResponse({description: 'Already exists "User" with received email'})
  async createUser(@Body() body: TCreateUser_Data): Promise<void> {
    return await this.moduleRef.get(services.CreateUserService).run(body);
  }
  //#endregion

  //#region searchUser
  @Post('_search')
  @ApiOperation({summary: 'Search user'})
  @ApiBody({schema: TSearchUser_Query.swagger})
  @ApiOkResponse({description: 'Search successful'})
  @ApiBadRequestResponse({description: 'Invalid request'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  async searchUser(@Body() query: TSearchUser_Query): Promise<TSearchUser_Result> {
    return await this.moduleRef.get(services.SearchUserService).run(query);
  }
  //#endregion

  //#region updateUser
  @Put(':id')
  @ApiOperation({summary: 'Update user'})
  @ApiParam({name: 'id', schema: TUpdateUserProfile_Data.swagger.properties.id})
  @ApiBody({schema: TUpdateUserProfile_Data.swagger.properties.changes})
  @ApiBadRequestResponse({description: 'Invalid request'})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiNotFoundResponse({description: 'Cannot find "user" with received id'})
  async updateUser(
    @Param('id') id: TUpdateUserProfile_Data['id'],
    @Body() changes: TUpdateUserProfile_Data['changes']
  ): Promise<void> {
    return await this.moduleRef.get(services.UpdateUserProfileService).run({id, changes});
  }
  //#endregion
}

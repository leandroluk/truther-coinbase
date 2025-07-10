import {Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {swaggerGenerator, TLoginAuthCredential_Data, TLoginAuthCredential_Result, TSession} from '@repo/domain';
import {AuthService, DynamicOidcGuard, GetSession, JwtAuthGuard, LocalGuard} from '@repo/nest-auth';
import {Request, Response} from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //#region loginAuthCredential
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Login using credential'})
  @ApiBody({schema: TLoginAuthCredential_Data.swagger})
  @ApiOkResponse({description: 'Login successful', schema: TLoginAuthCredential_Result.swagger})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @UseGuards(LocalGuard)
  async loginAuthCredential(@GetSession() session: TSession): Promise<TLoginAuthCredential_Result> {
    return await this.authService.createOpenidToken(session);
  }
  //#endregion

  //#region loginUsingProviderRedirect
  @Get('login/:provider')
  @ApiOperation({summary: 'Initiate OIDC login (Google, Microsoft)'})
  @ApiParam({name: 'provider', enum: ['google', 'microsoft']})
  @ApiQuery({name: 'redirect_to', description: 'Callback url when success (ex: "https://example.com/callback"'})
  @ApiOkResponse({description: 'Redirect to provider login page'})
  @UseGuards(DynamicOidcGuard)
  async loginUsingProviderRedirect(): Promise<void> {
    // passport handles the redirect
  }
  //#endregion

  //#region loginUsingProviderCallback
  @Get('oidc/:provider/callback')
  @ApiOperation({summary: 'Handle OIDC callback and issue token'})
  @ApiParam({name: 'provider', enum: ['google', 'microsoft']})
  @ApiQuery({name: 'code', schema: swaggerGenerator.string()})
  @ApiFoundResponse({
    description: [
      'Redirected to "redirect_to" received in flow with "code" to get session',
      '(ex: "https://example.com/callback?code={{code}}") or return with error',
      '(ex: "https://example.com/callback?error=unauthorized")',
    ].join(' '),
  })
  @UseGuards(DynamicOidcGuard)
  async loginUsingProviderCallback(
    @Req() req: Request,
    @GetSession() session: TSession,
    @Res() res: Response
  ): Promise<void> {
    const redirectTo = req.query.state as string;
    try {
      const code = await this.authService.createCode(session);
      return res.redirect(`${decodeURIComponent(redirectTo)}?code=${code}`);
    } catch {
      return res.redirect(`${decodeURIComponent(redirectTo)}?error=unauthorized`);
    }
  }
  //#endregion

  //#region logoff
  @Post('logoff')
  @ApiOperation({summary: 'Logoff and invalidate session'})
  @ApiBearerAuth()
  @ApiNoContentResponse({description: 'Logoff successful'})
  @ApiUnauthorizedResponse({description: 'Invalid or missing token'})
  @UseGuards(JwtAuthGuard)
  async logoff(@GetSession() session: TSession): Promise<void> {
    await this.authService.logoff(session);
  }
  //#endregion
}

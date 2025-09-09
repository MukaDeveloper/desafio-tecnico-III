import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@application/auth/services/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginDto } from '@application/auth/models/auth.dto';
import { AuthTokenDto } from '@application/auth/models/auth-token.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('Bearer')
@ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
@ApiBadRequestResponse({ description: 'Erro de validação.' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso.', type: AuthTokenDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  login(@Body() authLoginDto: AuthLoginDto): Promise<ResponseMessageDto<AuthTokenDto | null>> {
    return this.authService.login(authLoginDto);
  }
}

import { JwtAuthGuard } from '@application/auth/guards/jwt-auth.guard';
import { UserSystemDto } from '@application/user-system/models/user-system.dto';
import { UserSystemService } from '@application/user-system/services/user-system.service';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('user-system')
@ApiTags('Usuários')
@ApiBearerAuth('Bearer')
@ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
@ApiUnauthorizedResponse({ description: 'Não autorizado.' })
@ApiBadRequestResponse({ description: 'Erro de validação.' })
@UseGuards(JwtAuthGuard)
export class UserSystemController {
  constructor(private readonly userSystemService: UserSystemService) {}

  @Get('paginated')
  @ApiOkResponse({ description: 'Detalhes do Customer.', type: UserSystemDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findAllPaginated(@Query() pagination: PaginationQueryDto): Promise<ResponseMessageDto<UserSystemDto[] | null>> {
    return await this.userSystemService.findAllPaginated(pagination);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Detalhes do Customer.', type: UserSystemDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findOne(@Param('id') id: string): Promise<ResponseMessageDto<UserSystemDto | null>> {
    return await this.userSystemService.findOne(id);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de Customers.', type: [UserSystemDto] })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findAll(): Promise<ResponseMessageDto<UserSystemDto[] | null>> {
    return await this.userSystemService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Criado com sucesso.', type: UserSystemDto })
  async create(@Body() createDto: UserSystemDto): Promise<UserSystemDto | null> {
    const result = await this.userSystemService.create(createDto);
    return result.data;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Atualizado com sucesso.', type: UserSystemDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async update(@Param('id') id: string, @Body() updateDto: UserSystemDto): Promise<UserSystemDto | null> {
    const result = await this.userSystemService.update(id, updateDto);
    return result.data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async delete(@Param('id') id: string) {
    await this.userSystemService.delete(id);
  }
}

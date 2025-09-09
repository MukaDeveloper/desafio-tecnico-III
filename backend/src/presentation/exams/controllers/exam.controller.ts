import { JwtAuthGuard } from '@application/auth/guards/jwt-auth.guard';
import { ExamDto } from '@application/exam/models/exam.dto';
import { ExamService } from '@application/exam/services/exam.service';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
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

@Controller('exames')
@ApiTags('Exames')
@ApiBearerAuth('Bearer')
@ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
@ApiUnauthorizedResponse({ description: 'Não autorizado.' })
@ApiBadRequestResponse({ description: 'Erro de validação.' })
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'Detalhes do Customer.', type: ExamDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findOne(@Param('id') id: string): Promise<ResponseMessageDto<ExamDto | null>> {
    return await this.examService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Lista de Customers.', type: [ExamDto] })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findAll(): Promise<ResponseMessageDto<ExamDto[] | null>> {
    return await this.examService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Criado com sucesso.', type: ExamDto })
  async create(@Body() createDto: ExamDto): Promise<ExamDto | null> {
    const result = await this.examService.create(createDto);
    return result.data;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Atualizado com sucesso.', type: ExamDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async update(@Param('id') id: string, @Body() updateDto: ExamDto): Promise<ExamDto | null> {
    const result = await this.examService.update(id, updateDto);
    return result.data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async delete(@Param('id') id: string) {
    await this.examService.delete(id);
  }
}

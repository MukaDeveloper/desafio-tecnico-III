import { JwtAuthGuard } from '@application/auth/guards/jwt-auth.guard';
import { PatientDto } from '@application/patient/models/patient.dto';
import { PatientService } from '@application/patient/services/patient.service';
import { PaginationQueryDto } from '@domain/commons/models/pagination-query.dto';
import { ResponseMessageDto } from '@domain/commons/models/response-message.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
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

@Controller('pacientes')
@ApiTags('Paciente')
@ApiBearerAuth('Bearer')
@ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
@ApiUnauthorizedResponse({ description: 'Não autorizado.' })
@ApiBadRequestResponse({ description: 'Erro de validação.' })
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @ApiOkResponse({ description: 'Detalhes do Customer.', type: PatientDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findAllPaginated(@Query() pagination: PaginationQueryDto): Promise<ResponseMessageDto<PatientDto[] | null>> {
    return await this.patientService.findAllPaginated(pagination);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Detalhes do Customer.', type: PatientDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async findOne(@Param('id') id: string): Promise<ResponseMessageDto<PatientDto | null>> {
    return await this.patientService.findOne(id);
  }

  // @Get()
  // @ApiOkResponse({ description: 'Lista de Customers.', type: [PatientDto] })
  // @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  // async findAll(): Promise<ResponseMessageDto<PatientDto[] | null>> {
  //   return await this.patientService.findAll();
  // }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Criado com sucesso.', type: PatientDto })
  async create(@Body() createDto: PatientDto): Promise<PatientDto | null> {
    const result = await this.patientService.create(createDto);
    return result.data;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Atualizado com sucesso.', type: PatientDto })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async update(@Param('id') id: string, @Body() updateDto: PatientDto): Promise<PatientDto | null> {
    const result = await this.patientService.update(id, updateDto);
    return result.data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Nenhum Customer encontrado.' })
  async delete(@Param('id') id: string) {
    await this.patientService.delete(id);
  }
}

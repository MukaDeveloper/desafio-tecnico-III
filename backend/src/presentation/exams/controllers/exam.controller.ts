import { Controller } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Controller('exames')
@ApiTags('Exam')
@ApiBearerAuth('Bearer')
@ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
@ApiUnauthorizedResponse({ description: 'Não autorizado.' })
@ApiBadRequestResponse({ description: 'Erro de validação.' })
export class ExamController {
    constructor() {}
}
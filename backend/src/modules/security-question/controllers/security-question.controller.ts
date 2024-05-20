import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Delete,
  Get,
  Header,
} from '@nestjs/common';

import { SecurityQuestionService } from '../services';
import { AuthenticationGuard, RoleGuard } from '../../authentication/guards';
import { SecurityQuestionDto, ValidateSecurityQuestionDto } from '../dto';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { RolesEnum } from '../../user/enums';

@UseGuards(AuthenticationGuard, RoleGuard)
@Controller('security-question')
export class SecurityQuestionController {
  constructor(
    private readonly securityQuestionService: SecurityQuestionService,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  public async getQuestions(): Promise<string[]> {
    return this.securityQuestionService.getQuestions();
  }

  @Get('/question')
  @Header('Content-Type', 'application/json')
  public async getUserSecurityQuestion(): Promise<void> {}

  @Post('validate')
  @Header('Content-Type', 'application/json')
  public async validateAnswer(
    @Body() dto: ValidateSecurityQuestionDto,
    @Req() request,
    @Res() response,
  ): Promise<void> {}

  @Post('define')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async defineSecurityQuestion(
    @Body() dto: SecurityQuestionDto,
  ): Promise<void> {}

  @Delete('undefine')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async unDefineSecurityQuestion(): Promise<void> {}
}

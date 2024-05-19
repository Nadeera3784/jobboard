import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { ConfigurableModuleClass } from './status.module-definition';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  controllers: [StatusController],
  imports: [TerminusModule],
})
export class StatusModule extends ConfigurableModuleClass {}

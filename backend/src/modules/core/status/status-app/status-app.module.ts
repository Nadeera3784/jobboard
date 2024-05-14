import { Module } from '@nestjs/common';
import { InnerStatusModule } from './status/inner.status.module';

@Module({
  imports: [InnerStatusModule],
})
export class StatusSideApplicationModule {}

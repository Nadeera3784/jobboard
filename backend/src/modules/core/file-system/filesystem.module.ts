import { Global, Module } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import { createConfigurableDynamicRootModule } from './dynamic.service';
import { FILE_SYSTEM_MODULE_OPTIONS_TOKEN } from './filesystem.constants';
import { FileSystemModuleOptions } from './interfaces';

@Global()
@Module({
  providers: [FilesystemService],
  exports: [FilesystemService],
})
export class FileSystemModule extends createConfigurableDynamicRootModule<
  FileSystemModule,
  FileSystemModuleOptions
>(FILE_SYSTEM_MODULE_OPTIONS_TOKEN) {}

import { Controller, Get, Inject } from '@nestjs/common';
import { MongooseHealthIndicator } from '@nestjs/terminus';
import * as OS from 'node:os';
import { debugPort, version } from 'node:process';
import * as Handlebars from 'handlebars';

import { StatusModuleOptions } from './dto/status-module-options.dto';
import { MODULE_OPTIONS_TOKEN } from './status.module-definition';

@Controller('status')
export class StatusController {
  private startup: Date;
  private render: any;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private statusModuleOptions: StatusModuleOptions,
    private mongoIndicator: MongooseHealthIndicator,
  ) {
    this.startup = new Date();
    this.render = Handlebars.compile(
      '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>System Status</title> <style>body{font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4;}h1{color: #333;}.section{margin-bottom: 20px;}.section h2{color: #666;}.info{background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px;}</style></head><body> <h1>System Status</h1> <div class="section"> <h2>Status</h2> <div class="info"> <p>App Status: {{app_status}}</p><p>Database Status: {{database_status}}</p></div></div><div class="section"> <h2>Time</h2> <div class="info"> <p>Startup: <span>{{time.startup}}</span></p><p>Timezone: <span>{{time.timezone}}</span></p><p>Now: <span>{{time.now}}</span></p><p>UTC: <span>{{time.UTC}}</span></p></div></div><div class="section"> <h2>Project</h2> <div class="info"> <p>Name: <span>{{project.name}}</span></p><p>Version: <span>{{project.version}}</span></p><p>Environment: <span>{{project.environment}}</span></p></div></div><div class="section"> <h2>Node</h2> <div class="info"> <p>Versions: <span>{{node.versions}}</span></p><p>Port: <span>{{node.port}}</span></p><p>Debug Port: <span>{{node.debugPort}}</span></p></div></div><div class="section"> <h2>System</h2> <div class="info"> <p>Architecture: <span>{{system.arch}}</span></p><p>Platform: <span>{{system.platform}}</span></p><p>Release: <span>{{system.release}}</span></p><p>Free Memory: <span>{{system.freeMemory}}</span></p><p>Total Memory: <span>{{system.totalMemory}}</span></p><p>Load Average: <span>{{system.loadAverage}}</span></p></div></div></body></html>',
      { strict: true },
    );
  }

  @Get()
  public async status() {
    const data = await this.getStatusData();
    return this.statusModuleOptions.type == 'json' ? data : this.render(data);
  }

  private async getStatusData() {
    return {
      app_status: 'Up',
      database_status: this.statusModuleOptions.databaseCheck
        ? JSON.stringify(await this.mongoIndicator.pingCheck('mongodb'))
        : 'disabled',
      time: {
        startup: this.startup.toLocaleString(),
        timezone: this.statusModuleOptions.timeZone ?? process.env.TZ,
        now: new Date().toLocaleString(),
        UTC: new Date(),
      },
      project: {
        name: this.statusModuleOptions.name,
        version: this.statusModuleOptions.version,
        environment: this.statusModuleOptions.environment,
      },

      node: {
        versions: version,
        port: Number(this.statusModuleOptions.port),
        debugPort: debugPort && Number(debugPort),
      },
      system: {
        arch: OS.arch(),
        platform: OS.platform(),
        release: OS.release(),
        freeMemory: `${Math.round(OS.freemem() / Math.pow(1024, 2))} MB`,
        totalMemory: `${Math.round(OS.totalmem() / Math.pow(1024, 2))} MB`,
        loadAverage: OS.loadavg(),
      },
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService, HealthCheck,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator
  ) { }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check - Database, Disk, Heap, RSS' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @Get('uptime')
  @ApiOperation({ summary: 'How long app is running' })
  getUptime() {
    const seconds = process.uptime();
    return {
      uptime: {
        seconds: seconds.toFixed(2),
        minutes: (seconds / 60).toFixed(2),
        hours: (seconds / 3600).toFixed(2),
        days: (seconds / 86400).toFixed(2),
      },
    };
  }
}


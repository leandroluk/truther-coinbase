import {ConsoleLogger, Inject, Injectable, Scope} from '@nestjs/common';
import {INQUIRER} from '@nestjs/core';

@Injectable({scope: Scope.TRANSIENT})
export class LoggerService extends ConsoleLogger {
  static appName = '';

  constructor(@Inject(INQUIRER) context: string | object = '') {
    super(typeof context === 'object' ? context.constructor.name : context);
  }

  override formatPid(): string {
    return `[${LoggerService.appName}] `;
  }

  static setAppName(appName: string): void {
    LoggerService.appName = appName;
  }
}

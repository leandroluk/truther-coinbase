import config from '@repo/config-jest/nest';

config.collectCoverageFrom!.push('!src/entities/*.ts');
config.collectCoverageFrom!.push('!src/migrations/*.ts');
config.collectCoverageFrom!.push('!src/views/*.ts');

export default config;

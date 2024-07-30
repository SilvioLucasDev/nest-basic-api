import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from './orm-cli-config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => dataSourceOption,
    }),
  ],
})
export class DatabaseModule {}

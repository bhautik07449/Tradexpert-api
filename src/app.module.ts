import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BuyersModule } from './buyers/buyers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { BuyerInteractionsModule } from './buyer-interactions/buyer-interactions.module';
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('DB_SYNC_REQUIRED') === 'true',
        autoLoadEntities: true,
        logging: ["error"],
        migrationsRun: false
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed. ORM config loading failed for transactional support in api module.');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    BuyersModule,
    SuppliersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule, 
    BuyerInteractionsModule, MeasurementsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConsoleLogger
  ],
})

export class AppModule {
  constructor(private dataSource: DataSource) { }
}

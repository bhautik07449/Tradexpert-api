import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BuyersModule } from './buyers/buyers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { UploadController } from './upload.controller';
import { CurrencyModule } from './currency/currency.module';
import { PagesModule } from './pages/pages.module';
import { EmailtemplateModule } from './emailtemplate/emailtemplate.module';
import { BlogCategoryModule } from './blogCategory/blogcategory.module';
import { BlogModule } from './blog/blog.module';
import { TeamModule } from './team/team.module';
import { ClientModule } from './client/client.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { TradetypeModule } from './tradetype/tradetype.module';
import { TradeofferModule } from './tradeoffer/tradeoffer.module';
import { OfferRequestModule } from './offerRequest/offerrequest.module';
import { HomebannerModule } from './homebanner/homebanner.module';
import { CertificationsliderModule } from './certificationslider/certificationslider.module';
import { GalleryModule } from './gallery/gallery.module';
import { FaqModule } from './faq/faq.module';
import { GeneralSettingsModule } from './generalsetting/generalsetting.module';
import { SocialSettingsModule } from './socialsetting/socialsetting.module';
import { QuotationModule } from './quotation/quotation.module';
import { RequestsamplesModule } from './requestsamples/requestsamples.module';
import { ContactModule } from './contact/contact.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { ProductModule } from './product/product.module';
import { DRMModule } from './drm/dmr.module';
import { CreditAccountModule } from './creditaccount/creditaccount.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AbcModule } from './abc/abc.module';
import { AbctypeModule } from './abcType/abctype.module';
import { QualityPolicyModule } from './qualitypolicy/qualitypolicy.module';
import { EventsModule } from './events/events.module';
import { PresencesModule } from './presences/presences.module';
import { AnalyticalModule } from './analytical/analytical.module';


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
        ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        extra: {
          family: 4
        },
        autoLoadEntities: true,
        logging: ["error"],
        migrationsRun: false
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error(
            'Invalid options passed. ORM config loading failed for transactional support in api module.',
          );
        }

        const existing = getDataSourceByName('default');
        if (existing) {
          return existing;
        }

        const dataSource = new DataSource(options);
        await dataSource.initialize();

        addTransactionalDataSource(dataSource);

        return dataSource;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    BuyersModule,
    SuppliersModule,
    ProductModule,
    CategoriesModule,
    BrandsModule,
    MeasurementsModule,
    CurrencyModule, PagesModule, QualityPolicyModule,
    EmailtemplateModule, BlogCategoryModule,
    BlogModule, TeamModule, ClientModule, TestimonialModule,
    TradetypeModule, TradeofferModule, OfferRequestModule,
    HomebannerModule, CertificationsliderModule, GalleryModule, FaqModule,
    GeneralSettingsModule, SocialSettingsModule,
    QuotationModule, RequestsamplesModule, ContactModule, InquiryModule,
    DRMModule, DashboardModule, CreditAccountModule, NewsletterModule,
    CloudinaryModule, AbcModule, AbctypeModule, EventsModule, PresencesModule, AnalyticalModule

  ],
  controllers: [AppController, UploadController],
  providers: [
    AppService,
    ConsoleLogger
  ],
})

export class AppModule {
  constructor(private dataSource: DataSource) { }
}

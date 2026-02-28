import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerInteractionsModule } from 'src/buyer-interactions/buyer-interactions.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductApplication } from './entities/product-application.entity';
import { ProductCommercialAspect } from './entities/product-commercial-aspect.entity';
import { ProductCertification } from './entities/product-certification.entity';
import { ProductShipment } from './entities/product-shipment.entity';
import { ProductSpecification } from './entities/product-specification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductApplication, ProductCertification, ProductCommercialAspect, ProductImage, ProductShipment, ProductSpecification]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }

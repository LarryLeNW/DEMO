import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdminCategoriesController,
  AdminInventoryController,
  AdminProductsController,
  AdminVariantsController,
  CategoriesController,
  ProductsController,
} from './catalog.controllers.js';
import { CategoriesService } from './categories.service.js';
import { Category } from './entities/category.entity.js';
import { InventoryItem } from './entities/inventory-item.entity.js';
import { InventoryMovement } from './entities/inventory-movement.entity.js';
import { ProductImage } from './entities/product-image.entity.js';
import { ProductVariant } from './entities/product-variant.entity.js';
import { Product } from './entities/product.entity.js';
import { InventoryService } from './inventory.service.js';
import { ProductsService } from './products.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductImage,
      ProductVariant,
      InventoryItem,
      InventoryMovement,
    ]),
  ],
  controllers: [
    CategoriesController,
    ProductsController,
    AdminCategoriesController,
    AdminProductsController,
    AdminVariantsController,
    AdminInventoryController,
  ],
  providers: [CategoriesService, ProductsService, InventoryService],
  exports: [CategoriesService, ProductsService, InventoryService],
})
export class CatalogModule {}

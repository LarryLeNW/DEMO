import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { ProductStatus } from '../catalog.enums.js';

export enum ProductSort {
  Newest = 'newest',
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  BestSelling = 'best_selling',
  Featured = 'featured',
}

export class QueryProductsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Category slug or nested path; includes child categories',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @ApiPropertyOptional({ description: 'Matches name / short description' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ enum: ProductSort, default: ProductSort.Featured })
  @IsOptional()
  @IsEnum(ProductSort)
  sort: ProductSort = ProductSort.Featured;

  @ApiPropertyOptional({
    description: 'Only products carrying this badge, e.g. "Sale"',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  badge?: string;

  @ApiPropertyOptional({
    type: [Number],
    description: 'Explicit ids (keeps the given order)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids?: number[];
}

export class QueryAdminProductsDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Category id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}

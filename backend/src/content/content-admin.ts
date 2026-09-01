import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Repository } from 'typeorm';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { Role } from '../common/enums/role.enum.js';
import { paginate } from '../common/utils/pagination.js';
import {
  ContentBlockType,
  ContentPlacement,
  PublishStatus,
} from './content.enums.js';
import { ContentBlock } from './entities/content-block.entity.js';
import { Page } from './entities/page.entity.js';
import { Post as BlogPost } from './entities/post.entity.js';

// ------------------------------------------------------------------------ DTOs

export class CreateContentBlockDto {
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(255) title: string;
  @ApiProperty({ enum: ContentBlockType })
  @IsEnum(ContentBlockType)
  type: ContentBlockType;
  @ApiPropertyOptional({ enum: ContentPlacement })
  @IsOptional()
  @IsEnum(ContentPlacement)
  placement?: ContentPlacement;
  @ApiPropertyOptional() @IsOptional() @IsString() body?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imageUrl?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  mobileImageUrl?: string;
  @ApiPropertyOptional({ description: 'Absolute or site-relative link' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  linkUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startsAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endsAt?: string;
}

export class UpdateContentBlockDto extends PartialType(CreateContentBlockDto) {}

export class QueryContentDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}

/** The hero/sale banners the storefront used to hard-code; seeded once so admins can manage them. */
const DEFAULT_BANNERS: Partial<ContentBlock>[] = [
  {
    title: 'ChatGPT Plus',
    placement: ContentPlacement.Home,
    imageUrl:
      'https://khotaikhoan.net/wp-content/uploads/2026/05/chatgpt-plus-banner.webp',
    linkUrl: '/tai-khoan-chatgpt-plus',
    sortOrder: 0,
  },
  {
    title: 'Claude AI Pro Max',
    placement: ContentPlacement.Home,
    imageUrl:
      'https://khotaikhoan.net/wp-content/uploads/2026/05/claude-ai-pro-max-banner.webp',
    linkUrl: '/tai-khoan-claude-ai',
    sortOrder: 1,
  },
  {
    title: 'Google AI Pro',
    placement: ContentPlacement.Home,
    imageUrl:
      'https://khotaikhoan.net/wp-content/uploads/2026/05/google-ai-pro-banner.webp',
    linkUrl: '/tai-khoan-google-ai-pro',
    sortOrder: 2,
  },
  {
    title: 'Mega Sale',
    placement: ContentPlacement.Home,
    imageUrl:
      'https://khotaikhoan.net/wp-content/uploads/2026/07/mega-sale-banner-20260720.jpg',
    linkUrl: '/ung-dung-phan-mem-khac/cong-cu-ai',
    sortOrder: 3,
  },
  {
    title: 'Flash Sale',
    placement: ContentPlacement.Home,
    imageUrl:
      'https://khotaikhoan.net/wp-content/uploads/2026/06/Sale-banner3.jpg',
    linkUrl: '/ung-dung-phan-mem-khac/cong-cu-ai',
    sortOrder: 4,
  },
];

// --------------------------------------------------------------------- service

@Injectable()
export class ContentAdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ContentAdminService.name);

  constructor(
    @InjectRepository(ContentBlock)
    private readonly blocks: Repository<ContentBlock>,
    @InjectRepository(BlogPost) private readonly posts: Repository<BlogPost>,
    @InjectRepository(Page) private readonly pages: Repository<Page>,
  ) {}

  async onApplicationBootstrap() {
    if ((await this.blocks.count()) === 0) {
      await this.blocks.save(
        DEFAULT_BANNERS.map((banner) =>
          this.blocks.create({
            ...banner,
            type: ContentBlockType.Banner,
            status: PublishStatus.Published,
            publishedAt: new Date(),
          }),
        ),
      );
      this.logger.log(`Seeded ${DEFAULT_BANNERS.length} home banners`);
    }
  }

  async listBlocks(query: QueryContentDto) {
    const qb = this.blocks
      .createQueryBuilder('block')
      .leftJoinAndSelect('block.updatedBy', 'updatedBy')
      .orderBy('block.placement', 'ASC')
      .addOrderBy('block.sortOrder', 'ASC');
    if (query.status)
      qb.andWhere('block.status = :status', { status: query.status });
    if (query.search)
      qb.andWhere('block.title LIKE :search', {
        search: `%${query.search.trim()}%`,
      });
    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();
    return paginate(items, total, query);
  }

  async createBlock(dto: CreateContentBlockDto, userId: number) {
    return this.blocks.save(
      this.blocks.create({
        title: dto.title,
        type: dto.type,
        placement: dto.placement ?? ContentPlacement.Home,
        body: dto.body ?? null,
        imageUrl: dto.imageUrl ?? null,
        mobileImageUrl: dto.mobileImageUrl ?? null,
        linkUrl: dto.linkUrl ?? null,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? PublishStatus.Draft,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        publishedAt: dto.status === PublishStatus.Published ? new Date() : null,
        updatedById: userId,
      }),
    );
  }

  async updateBlock(id: number, dto: UpdateContentBlockDto, userId: number) {
    const block = await this.blocks.findOneBy({ id });
    if (!block) throw new NotFoundException(`Không tìm thấy khối nội dung #${id}`);
    const { startsAt, endsAt, ...rest } = dto;
    Object.assign(block, rest, {
      ...(startsAt !== undefined
        ? { startsAt: startsAt ? new Date(startsAt) : null }
        : {}),
      ...(endsAt !== undefined
        ? { endsAt: endsAt ? new Date(endsAt) : null }
        : {}),
      updatedById: userId,
    });
    if (dto.status === PublishStatus.Published && !block.publishedAt)
      block.publishedAt = new Date();
    return this.blocks.save(block);
  }

  async removeBlock(id: number) {
    const block = await this.blocks.findOneBy({ id });
    if (!block) throw new NotFoundException(`Không tìm thấy khối nội dung #${id}`);
    await this.blocks.softDelete({ id });
  }

  async listPosts(query: QueryContentDto) {
    const qb = this.posts
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.updatedAt', 'DESC');
    if (query.status)
      qb.andWhere('post.status = :status', { status: query.status });
    if (query.search)
      qb.andWhere('post.title LIKE :search', {
        search: `%${query.search.trim()}%`,
      });
    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();
    return paginate(
      items.map((post) => ({ ...post, contentHtml: undefined })),
      total,
      query,
    );
  }

  async listPages(query: QueryContentDto) {
    const qb = this.pages
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.updatedBy', 'updatedBy')
      .orderBy('page.updatedAt', 'DESC');
    if (query.status)
      qb.andWhere('page.status = :status', { status: query.status });
    if (query.search)
      qb.andWhere('page.title LIKE :search', {
        search: `%${query.search.trim()}%`,
      });
    const [items, total] = await qb
      .skip(query.skip)
      .take(query.limit)
      .getManyAndCount();
    return paginate(
      items.map((page) => ({ ...page, contentHtml: undefined })),
      total,
      query,
    );
  }

  async setPostStatus(id: number, status: PublishStatus) {
    const post = await this.posts.findOneBy({ id });
    if (!post) throw new NotFoundException(`Không tìm thấy bài viết #${id}`);
    post.status = status;
    if (status === PublishStatus.Published && !post.publishedAt)
      post.publishedAt = new Date();
    return this.posts.save(post);
  }

  async setPageStatus(id: number, status: PublishStatus, userId: number) {
    const page = await this.pages.findOneBy({ id });
    if (!page) throw new NotFoundException(`Không tìm thấy trang #${id}`);
    page.status = status;
    page.updatedById = userId;
    if (status === PublishStatus.Published && !page.publishedAt)
      page.publishedAt = new Date();
    return this.pages.save(page);
  }
}

// ------------------------------------------------------------------ controller

@ApiTags('admin/content')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('admin/content')
export class AdminContentController {
  constructor(private readonly content: ContentAdminService) {}

  @Get('blocks')
  @ApiOperation({ summary: 'Banners, announcements, help articles' })
  listBlocks(@Query() query: QueryContentDto) {
    return this.content.listBlocks(query);
  }

  @Post('blocks')
  createBlock(
    @Body() dto: CreateContentBlockDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.content.createBlock(dto, userId);
  }

  @Patch('blocks/:id')
  updateBlock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContentBlockDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.content.updateBlock(id, dto, userId);
  }

  @Delete('blocks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBlock(@Param('id', ParseIntPipe) id: number) {
    await this.content.removeBlock(id);
  }

  @Get('posts')
  listPosts(@Query() query: QueryContentDto) {
    return this.content.listPosts(query);
  }

  @Patch('posts/:id/status/:status')
  @ApiQuery({ name: 'status', enum: PublishStatus })
  setPostStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: PublishStatus,
  ) {
    return this.content.setPostStatus(id, status);
  }

  @Get('pages')
  listPages(@Query() query: QueryContentDto) {
    return this.content.listPages(query);
  }

  @Patch('pages/:id/status/:status')
  setPageStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: PublishStatus,
    @CurrentUser('id') userId: number,
  ) {
    return this.content.setPageStatus(id, status, userId);
  }
}

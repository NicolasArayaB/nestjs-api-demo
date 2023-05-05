import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkByIdDto } from './dto';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../../src/auth/decorator';
import { JwtGuard } from '../../src/auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService,) { }

  @Get()
  getBookmarks(@GetUser('sub') userId: number,) {
    return this.bookmarkService.getBookmarks(userId)
  }

  @Get(':id')
  getBookmarkById(@GetUser('sub') userId: number, @Param('id', ParseIntPipe) bookmarkId: number,) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId)
  }

  @Post()
  createBookmark(@GetUser('sub') userId: number, @Body() dto: CreateBookmarkDto,) {
    return this.bookmarkService.createBookmark(userId, dto)
  }

  @Patch(':id')
  editBookmarkById(@GetUser('sub') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkByIdDto,) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(@GetUser('sub') userId: number, @Param('id', ParseIntPipe) bookmarkId: number,) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
  }
}

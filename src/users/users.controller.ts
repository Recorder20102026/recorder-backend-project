import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users, optionally filtered by name, email, or id' })
  @ApiOkResponse({ type: [UserEntity] })
  @ApiBadRequestResponse({ description: 'Unknown or invalid query parameter' })
  findAll(@Query() filters: UserFiltersDto): Promise<UserEntity[]> {
    return this.usersService.findAll(filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ type: UserEntity })
  @ApiBadRequestResponse({ description: 'Body must contain only name and email' })
  create(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace a user name and email' })
  @ApiParam({ name: 'id', example: '0d5d5bf4-7c47-49a9-8852-fdb77fa5f8a3' })
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({ description: 'Body must contain only name and email' })
  @ApiNotFoundResponse({ description: 'User ID was not found' })
  replace(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.replace(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user name, email, or both' })
  @ApiParam({ name: 'id', example: '0d5d5bf4-7c47-49a9-8852-fdb77fa5f8a3' })
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({
    description: 'Provide at least one of name or email, with no other fields',
  })
  @ApiNotFoundResponse({ description: 'User ID was not found' })
  patch(
    @Param('id') id: string,
    @Body() user: PatchUserDto,
  ): Promise<UserEntity> {
    if (user.name === undefined && user.email === undefined) {
      throw new BadRequestException(
        'At least one of name or email must be provided',
      );
    }

    return this.usersService.patch(id, user);
  }
}

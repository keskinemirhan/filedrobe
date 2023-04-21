import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Equals,
} from 'class-validator';
import { Attributes, NewResourceObject, ResourceObject } from 'ts-json-api';

//SEND
export class SendUserResourceObj implements ResourceObject {
  type: 'user';
  id: string;
  attributes?: SendUserAttributes;
}

export class SendUserAttributes implements Attributes {
  [key: string]: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
}

//CREATE
export class CreateUserResourceObj implements NewResourceObject {
  type: 'user';
  attributes: CreateUserAttributes;
}

export class CreateUserAttributes implements Attributes {
  [key: string]: string;
  @Expose()
  @IsEmail()
  @MaxLength(320)
  @MinLength(6)
  email: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  @MinLength(8)
  password: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  @MinLength(4)
  username: string;
}

//UPDATE
export class UpdateUserResourceObj implements NewResourceObject {
  @Equals('user')
  type: string;
  id: string;
  attributes?: Attributes;
}

export class UpdateUserAttributes implements Attributes {
  [key: string]: string;
  @Expose()
  @IsEmail()
  @MaxLength(320)
  @MinLength(6)
  email?: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  @MinLength(8)
  password?: string;

  @Expose()
  @IsString()
  @MaxLength(256)
  @MinLength(4)
  username?: string;
}

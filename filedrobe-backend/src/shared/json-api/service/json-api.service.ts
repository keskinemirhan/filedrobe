import { BadRequestException, Injectable } from '@nestjs/common';
import { resourceTypes } from './resource-types/resource-types';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class JsonApiService {
  types = resourceTypes;
  validateJSON(body: any) {
    if (!body.data)
      throw new BadRequestException('invalid format should be {data : obj}');
    const data = body.data;
    if (!data.type)
      throw new BadRequestException(
        'invalid format should be {data : { type : string }}',
      );
    if (!this.doesTypeExist(body.data.type))
      throw new BadRequestException('non-existent type');
  }

  createJSON(type: string, data: any, included: boolean) {
    const typeName = type;
    const resourceId = data.id;
    const resourceObj = new (this.getResourceObjClass(typeName, 'GET'))();
    const attributes = plainToInstance(
      this.getAttributesClass(typeName, 'GET'),
      data,
      { excludeExtraneousValues: true },
    );
    if (true)
      Object.assign(resourceObj, {
        id: resourceId,
        type: typeName,
        attributes,
      });
    else Object.assign(resourceObj, { id: resourceId, type: typeName });
    return resourceObj;
  }

  doesTypeConform(body: any, typeName: string, method: string) {
    const resultRes =
      body.data instanceof this.getResourceObjClass(typeName, method);
    if (!resultRes) return false;

    const resultAttr =
      body.data.attributes instanceof this.getAttributesClass(typeName, method);
    if (!resultAttr) return false;
    return true;
  }

  doesTypeExist(typeName: string): boolean {
    return this.types.some((type) => type.name === typeName);
  }
  getAttributesClass(typeName: string, method: string) {
    const result = this.types.find((data) => data.name === typeName);
    return result.attributes[method];
  }
  getResourceObjClass(typeName: string, method: string) {
    const result = this.types.find((data) => data.name === typeName);
    return result.resourceObj[method];
  }
}

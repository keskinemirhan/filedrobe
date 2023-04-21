import {
  CreateUserAttributes,
  CreateUserResourceObj,
  SendUserAttributes,
  SendUserResourceObj,
  UpdateUserAttributes,
  UpdateUserResourceObj,
} from './user.obj';

export const userResourceType = {
  name: 'user',
  resourceObj: {
    POST: CreateUserResourceObj,
    PATCH: UpdateUserResourceObj,
    GET: SendUserResourceObj,
  },
  attributes: {
    POST: CreateUserAttributes,
    PATCH: UpdateUserAttributes,
    GET: SendUserAttributes,
  },
};

export const resourceTypes = [userResourceType];

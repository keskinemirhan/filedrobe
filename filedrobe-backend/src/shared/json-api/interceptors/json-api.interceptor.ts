import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { JsonApiService } from '../service/json-api.service';

@Injectable()
export class JsonApiInterceptor implements NestInterceptor {
  constructor(private jsonApiService: JsonApiService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const method = context.switchToHttp().getRequest<Request>().method;

    if (method === 'POST' || method === 'PATCH') {
      this.jsonApiService.validateJSON(
        context.switchToHttp().getRequest().body,
      );
    }

    //@ts-ignore
    const typeName = context.getClass().typeName;

    console.log(typeName);
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Array) {
          const resourceObjArray = [];
          data.forEach((resource) => {
            resourceObjArray.push(
              this.jsonApiService.createJSON(
                typeName,
                resource,
                true, //for now
              ),
            );
          });
          return { data: resourceObjArray };
        } else
          return this.jsonApiService.createJSON(
            typeName,
            data,
            true, //for now
          );
      }),
    );
  }
}

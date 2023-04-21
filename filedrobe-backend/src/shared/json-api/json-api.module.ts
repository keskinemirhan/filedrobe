import { Module } from '@nestjs/common';
import { JsonApiService } from './service/json-api.service';
import { JsonApiInterceptor } from './interceptors/json-api.interceptor';

@Module({
  controllers: [],
  imports: [],
  exports: [JsonApiInterceptor, JsonApiService],
  providers: [JsonApiService, JsonApiInterceptor],
})
export class JsonApiModule {}

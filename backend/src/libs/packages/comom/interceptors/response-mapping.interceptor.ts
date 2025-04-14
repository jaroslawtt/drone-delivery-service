import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EXCLUDE_FROM_RESPONSE_MAPPING_KEY } from "../constants.js";

@Injectable()
class ResponseMappingInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const shouldExcludeFromMapping = Reflect.getMetadata(
      EXCLUDE_FROM_RESPONSE_MAPPING_KEY,
      context.getHandler(),
    );

    if (shouldExcludeFromMapping) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return { payload: data };
      }),
    );
  }
}

export { ResponseMappingInterceptor };

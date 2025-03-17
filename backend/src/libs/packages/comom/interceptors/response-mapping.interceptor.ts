import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
class ResponseMappingInterceptor implements NestInterceptor {
  public intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        return { payload: data };
      }),
    );
  }
}

export { ResponseMappingInterceptor };

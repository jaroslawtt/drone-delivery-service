import { applyDecorators, SetMetadata } from "@nestjs/common";
import { EXCLUDE_FROM_RESPONSE_MAPPING_KEY } from "../constants.js";

const ExcludeFromResponseMapping = () => {
  return applyDecorators(SetMetadata(EXCLUDE_FROM_RESPONSE_MAPPING_KEY, true));
};

export { ExcludeFromResponseMapping };

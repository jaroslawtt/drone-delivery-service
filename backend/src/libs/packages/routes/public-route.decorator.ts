import { SetMetadata } from "@nestjs/common";

const PublicRoute = () => SetMetadata("isPublic", true);

export { PublicRoute };

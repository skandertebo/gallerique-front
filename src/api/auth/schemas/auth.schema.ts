import { UserSchema } from "./user.schema";

export interface AuthSchema {
  access_token: string;
  user: UserSchema;
}

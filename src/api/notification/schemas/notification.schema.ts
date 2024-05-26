import { GenericSchema } from "../../generic/generic.schema";

export interface NotificationSchema extends GenericSchema {
  title: string;
  description: string;
  createdAt: string;
}

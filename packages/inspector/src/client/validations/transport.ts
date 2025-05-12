import {
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import { nanoid } from "nanoid";
import z from "zod";

export const SUBMIT_BUTTON_KEY = "__submit_btn";

export enum DocumentSubmitType {
  CONNECT = "connect",
  SAVE_AND_CONNECT = "save and connect",
}

const extraPropValidation = z.object({
  name: z.string().default(nanoid(6)).optional(),
  [SUBMIT_BUTTON_KEY]: z.nativeEnum(DocumentSubmitType).optional(),
});

export const configTransportSchema = z.union([
  stdioTransportSchema.merge(extraPropValidation),
  remoteTransportSchema.merge(extraPropValidation),
]);

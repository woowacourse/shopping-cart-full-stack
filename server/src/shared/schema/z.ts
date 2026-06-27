import type { Infer, ZodType } from "./core.js";
import { ZodBoolean, ZodNumber, ZodString } from "./primitives.js";
import { ZodObject, type ZodShape } from "./object.js";
import { ZodArray } from "./array.js";

export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  boolean: () => new ZodBoolean(),
  object: <Shape extends ZodShape>(shape: Shape) => new ZodObject(shape),
  array: <Element extends ZodType<unknown>>(element: Element) => new ZodArray(element),
};

export namespace z {
  export type infer<S extends ZodType<unknown>> = Infer<S>;
}

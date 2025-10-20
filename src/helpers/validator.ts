import { TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

/**
 * Validate data against a TypeBox schema
 */
export function validate<T>(schema: TSchema, data: unknown): T {
  const errors = [...Value.Errors(schema, data)];

  if (errors.length > 0) {
    const errorMessages = errors.map(
      (error) => `${error.path}: ${error.message}`
    );
    throw new Error(`Validation failed: ${errorMessages.join(", ")}`);
  }

  return data as T;
}

/**
 * Check if data is valid against a schema
 */
export function isValid(schema: TSchema, data: unknown): boolean {
  return Value.Check(schema, data);
}

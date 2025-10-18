import { BadRequestException, type PipeTransform } from '@nestjs/common';
import z, { ZodError, type ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(z.treeifyError(error));
      }

      throw new BadRequestException('Validation failed');
    }
  }
}

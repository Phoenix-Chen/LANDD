import { PipeTransform, Injectable, BadRequestException, } from '@nestjs/common';
import { isMACAddress } from 'class-validator';

@Injectable()
export class isMacAddressValidationPipe implements PipeTransform {
  async transform(value: string) {
    if (isMACAddress(value)) {
        return value;
    }
    throw new BadRequestException('Invalid MAC address');
  }
}

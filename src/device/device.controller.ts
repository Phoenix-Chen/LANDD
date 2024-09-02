import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { GetDevicesQueryDto, PatchDeviceDto } from './dto/patch-device.dto';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import { isMacAddressValidationPipe } from './pipe';
import { NotFoundException } from '@nestjs/common';


@Controller('device')
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);

  constructor(private deviceService: DeviceService) {}

  @Get()
  async getAll(
    @Query() query: GetDevicesQueryDto,
  ): Promise<Device[]> {
    return await this.deviceService.findAll(query);
  }

  @Patch(':macAddress')
  async patchOne(
    @Param('macAddress', isMacAddressValidationPipe ) macAddress: string,
    @Body() patchDeviceDto: PatchDeviceDto,
  ): Promise<Device> {
    let device;
    try {
      device = await this.deviceService.findOneByOrFail(macAddress);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(`could not find device with mac address ${macAddress}`);
    }
    return await this.deviceService.patchOne(device, patchDeviceDto);
  }
}

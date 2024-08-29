import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Device } from './device.entity';
import { GetDevicesQueryDto, PatchDeviceDto, UpdateOrCreateDto } from './dto/patch-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('DEVICE_REPOSITORY')
    private deviceRespository: Repository<Device>,
  ) {}

  async findAll(query: GetDevicesQueryDto): Promise<Device[]> {
    return await this.deviceRespository.find({
      where: Object.assign(
        {
          online: query.online
        },
        query.macAddress_in && query.macAddress_in.length > 0 ? { macAddress: In(query.macAddress_in) } : null,
      ),
    });
  }

  async findOneByOrFail(macAddress: string): Promise<Device> {
    return await this.deviceRespository.findOneByOrFail({ macAddress });
  }

  async patchOne(
    device: Device,
    deviceDto: PatchDeviceDto,
  ): Promise<Device> {
    return await this.deviceRespository.save({
      ...device,
      ...deviceDto,
    });
  }

  // Bulk update or create based on primary key: macAddress
  async bulkUpdateOrCreate(
    devices: UpdateOrCreateDto[],
  ) {
    return await this.deviceRespository.save(devices);
  }
}

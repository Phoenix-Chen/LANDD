import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity('device')
export class Device {
  @PrimaryColumn({
    unique: true,
    length: 17,
  })
  macAddress: string;

  @Column({
    length: 225,
    nullable: true,
  })
  name: string;

  @Column({ length: 15 })
  ip: string;

  @Column()
  online: boolean;
}

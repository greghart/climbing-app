import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

export default class Timestamps {

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

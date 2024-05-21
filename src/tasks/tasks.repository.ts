import { InjectDataSource } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DataSource, Repository } from 'typeorm';

export class TaskRepository {
  private repository: Repository<Task>;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    this.repository = this.dataSource.getRepository(Task);
  }
}

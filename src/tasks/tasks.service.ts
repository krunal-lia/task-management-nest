import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTask(id: string): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex >= 0) {
      return this.tasks[taskIndex];
    } else {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
    } else {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex >= 0) {
      this.tasks[taskIndex].status = updateTaskStatusDto.status;
      return this.tasks[taskIndex];
    } else {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLocaleLowerCase().includes(search) ||
          task.description.toLocaleLowerCase().includes(search)
        ) {
          return true;
        }

        return false;
      });
    }
    return tasks;
  }
}

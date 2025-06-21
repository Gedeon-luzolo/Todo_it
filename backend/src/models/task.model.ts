import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db";
import type {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
  TasksResponse,
} from "../types/task.types";

export class TaskModel {
  private static tableName = "tasks";

  static async findAll(filters?: TaskFilters): Promise<TasksResponse> {
    let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const values: any[] = [];

    if (filters?.status) {
      query += " AND status = ?";
      values.push(filters.status);
    }

    if (filters?.search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    const [tasks] = await pool.execute<RowDataPacket[]>(query, values);
    const [totalResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM ${this.tableName}`
    );

    return {
      tasks: tasks as Task[],
      total: totalResult[0].total,
    };
  }

  static async findById(id: string): Promise<Task | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return (rows[0] as Task) || null;
  }

  static async create(task: CreateTaskDTO): Promise<Task> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (title, description, status) VALUES (?, ?, ?)`,
      [task.title, task.description, task.status]
    );

    const [newTask] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [result.insertId]
    );

    return newTask[0] as Task;
  }

  static async update(id: string, task: UpdateTaskDTO): Promise<Task | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (task.title !== undefined) {
      updates.push("title = ?");
      values.push(task.title);
    }
    if (task.description !== undefined) {
      updates.push("description = ?");
      values.push(task.description);
    }
    if (task.status !== undefined) {
      updates.push("status = ?");
      values.push(task.status);
    }

    if (updates.length === 0) return null;

    values.push(id);
    await pool.execute(
      `UPDATE ${this.tableName} SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

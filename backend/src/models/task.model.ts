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

  private static mapTaskFromDB(row: RowDataPacket): Task {
    let tags: string[] = [];
    try {
      tags = JSON.parse(row.tags || "[]");
    } catch {
      tags = Array.isArray(row.tags)
        ? row.tags
        : row.tags?.split(",").filter(Boolean) || [];
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      tags,
      dueDate: row.due_date ? new Date(row.due_date) : null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  static async findAll(filters?: TaskFilters): Promise<TasksResponse> {
    let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const values: any[] = [];

    if (filters?.status) {
      query += " AND status = ?";
      values.push(filters.status);
    }

    if (filters?.tags && filters.tags.length > 0) {
      // Recherche de tâches qui ont au moins un des tags spécifiés
      const tagConditions = filters.tags
        .map(() => "JSON_CONTAINS(tags, JSON_ARRAY(?))")
        .join(" OR ");
      query += ` AND (${tagConditions})`;
      values.push(...filters.tags);
    }

    if (filters?.startDate) {
      query += " AND due_date >= ?";
      values.push(filters.startDate);
    }

    if (filters?.endDate) {
      query += " AND due_date <= ?";
      values.push(filters.endDate);
    }

    if (filters?.search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    // Tri par date d'échéance
    query += " ORDER BY due_date ASC";

    const [tasks] = await pool.execute<RowDataPacket[]>(query, values);
    const [totalResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM ${this.tableName}`
    );

    return {
      tasks: tasks.map(this.mapTaskFromDB),
      total: totalResult[0].total,
    };
  }

  static async findById(id: string): Promise<Task | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows[0] ? this.mapTaskFromDB(rows[0]) : null;
  }

  static async create(task: CreateTaskDTO) {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (
        title, description, status, 
        tags, due_date
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        task.title,
        task.description,
        task.status,
        JSON.stringify(task.tags),
        task.dueDate,
      ]
    );

    return this.findById(result.insertId.toString());
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

    if (task.tags !== undefined) {
      updates.push("tags = ?");
      values.push(JSON.stringify(task.tags));
    }
    if (task.dueDate !== undefined) {
      updates.push("due_date = ?");
      values.push(task.dueDate);
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

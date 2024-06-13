import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ModelService <T> {

    protected abstract getAll(): Promise<T[]>;

    protected abstract create(input: any): Promise<T>;
  
    protected abstract getById(id: string): Promise<T | null>;
  
    protected abstract update(id: string, updateInput: any): Promise<T | null>;
  
    protected abstract delete(id: string): Promise<{ deletedCount?: number }>;
  
}

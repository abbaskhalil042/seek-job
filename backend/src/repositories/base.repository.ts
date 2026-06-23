import {
  Document,
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { PaginatedResult, PaginationOptions } from '../types';
import { buildPaginatedResult } from '../utils/pagination';

/**
 * Generic data-access layer. Every concrete repository extends this so the
 * service layer never touches Mongoose models directly.
 */
export abstract class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(payload: Partial<T>): Promise<T> {
    return this.model.create(payload);
  }

  async findById(
    id: string,
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | (PopulateOptions | string)[],
  ): Promise<T | null> {
    const query = this.model.findById(id, projection);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | (PopulateOptions | string)[],
  ): Promise<T | null> {
    const query = this.model.findOne(filter, projection);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    options: QueryOptions = {},
    populate?: PopulateOptions | (PopulateOptions | string)[],
  ): Promise<T[]> {
    const query = this.model.find(filter, null, options);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true, runValidators: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    return (await this.model.exists(filter)) !== null;
  }

  /** Run an arbitrary aggregation pipeline. */
  async aggregate<R = Record<string, unknown>>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate<R>(pipeline).exec();
  }

  /** Generic offset pagination helper shared by all repositories. */
  async paginate(
    filter: FilterQuery<T>,
    { page, limit, sort }: PaginationOptions,
    populate?: PopulateOptions | (PopulateOptions | string)[],
    projection?: ProjectionType<T>,
  ): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * limit;
    const query = this.model
      .find(filter, projection)
      .sort(sort || '-createdAt')
      .skip(skip)
      .limit(limit);
    if (populate) query.populate(populate);

    const [items, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  }
}

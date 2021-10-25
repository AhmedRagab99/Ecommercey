import { Model, Mongoose } from "mongoose";
import { IRead } from "./interfaces/IRead";
import { IWrite } from "./interfaces/IWrite";
import { ObjectId } from "mongoose";

export abstract class BaseRepository<TEntity, TModel extends Document>
  implements IRead<TEntity>, IWrite<TEntity>
{
  constructor(protected _model: Model<TModel>) {}

  public async findAll(): Promise<TEntity[]> {
    const models = await this._model.find({});

    return models.map((model) => this.toEntity(model));
  }
  public async find(item: any): Promise<TEntity[]> {
    const models = await this._model.find(item);
    return models.map((model) => this.toEntity(model));
  }

  public async findOne(item: any): Promise<TEntity | undefined> {
    const model = await this._model.findOne(item);
    console.log(model);

    if (!model) {
      return undefined;
    }
    return this.toEntity(model);
  }

  public async findById(id: string): Promise<TEntity | undefined> {
    const model = await this._model.findById(id);

    if (!model) {
      return undefined;
    }
    return this.toEntity(model);
  }
  public async save(item: TEntity): Promise<TEntity> {
    const model = await new this._model(item).save();

    return this.toEntity(model);
  }

  // public async saveItems(item:T)

  public async update(
    id: ObjectId,
    item: TEntity
  ): Promise<TEntity | undefined> {
    const model = await this._model.findByIdAndUpdate(id, item);
    if (!model) {
      return undefined;
    }
    return this.toEntity(model);
  }

  public async updateOne(
    id: ObjectId,
    item: TEntity
  ): Promise<TEntity | undefined> {
    const model = await this._model.findById(id);
    const updatedModel = await model?.updateOne(item);
    if (!updatedModel) {
      return undefined;
    }
    return this.toEntity(updatedModel);
  }

  public async delete(id: string): Promise<void> {
    await this._model.findByIdAndRemove(id);
  }

  protected abstract toEntity(item: TModel): TEntity;
}

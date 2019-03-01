import { BaseModel, schemaOptions } from "src/shared/base.model";
import { prop, ModelType } from "typegoose";

export class User extends BaseModel<User> {
    @prop({
        required: [true, 'Username is required'],
        minlength: [6, 'Must be at least 6 characters'],
        unique: true
    })
    username: string;
    @prop({
        required: [true, 'Username is required'],
        minlength: [6, 'Must be at least 6 characters']
    })
    password: string;

    @prop() avatarUrl: string;
    @prop() language?: string;
    _id: any;

    static get model(): ModelType<User> {
        return new User().getModelForClass(User, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
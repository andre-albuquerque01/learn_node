import { randomUUID } from "crypto"
import { UniqueEntityID } from "./unique-entity-id"

export class Entity<Props> {
    private _id: UniqueEntityID
    protected prosp: any

    get id() {
        return this._id
    }

    constructor(props: Props, id?: string) {
        this.prosp = props
        this._id = new UniqueEntityID(id)
    }
}
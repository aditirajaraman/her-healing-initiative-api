/*
    Use RangeHandler Design Pattern Later
*/
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();

export class UniqueIdGenerator {
    constructor() {
    }

    public getUniqueId(): string {
        return uuid;
    }
}
/*
    Use RangeHandler Design Pattern Later
*/
const uuid = require('uuid');
export class UniqueIdGenerator {
    constructor() {
    }

    public getUniqueId(): string {
        return uuid.v4();
    }
}
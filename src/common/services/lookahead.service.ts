// Usage example:
// const lookAheadService = new LookAheadService<Country>(countryRepository);
// const results = await lookAheadService.search(['name', 'code'], 'Uni', 5);   
// This will search for countries where the name or code contains 'Uni' and return up to 5 results.
// Note: Ensure that the fields you pass to the search method are valid keys of the entity T.
// The ILike operator is used for case-insensitive matching in PostgreSQL. Adjust accordingly for other databases.
// Also, make sure to handle any potential errors and edge cases as per your application's requirements.
// This service can be easily extended or modified to include additional features like pagination, sorting, etc.

import { FindOptionsWhere, ILike, Repository, ObjectLiteral } from 'typeorm';

export class LookAheadService<T extends ObjectLiteral> {
    constructor(private readonly repo: Repository<T>) { }

    async search(fields: (keyof T)[], query: string, limit = 10): Promise<T[]> {
        const where = fields.map(field => ({
            [field]: ILike(`%${query}%`)
        })) as FindOptionsWhere<T>[];
        console.log("LookAheadService > where = " + JSON.stringify(where));
        return this.repo.find({ where, take: limit });
    }
}


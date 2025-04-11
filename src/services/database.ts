import { Connection, Request, TYPES, ConnectionConfiguration } from 'tedious';
import { dbConfig } from '../config/database';

export interface PetData {
  id: string;
  name: string;
  type: string;
  birthDate: string | null;
  description: string;
  images: string[];
  createdAt: number;
  userId: string;
}

interface TediousRow {
  [key: string]: {
    value: any;
  };
}

class DatabaseService {
  private getConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      const connection = new Connection(dbConfig as ConnectionConfiguration);
      
      connection.on('connect', function(err?: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve(connection);
      });

      connection.connect();
    });
  }

  private executeQuery(query: string, params: { type: any; value: any }[] = []): Promise<TediousRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await this.getConnection();
        const request = new Request(
          query,
          function(error: Error | null | undefined, rowCount?: number, rows?: TediousRow[]) {
            connection.close();
            if (error) {
              reject(error);
              return;
            }
            resolve(rows || []);
          }
        );

        // Adicionar parâmetros à query
        params.forEach((param, index) => {
          request.addParameter(`param${index}`, param.type, param.value);
        });

        connection.execSql(request);
      } catch (error) {
        reject(error);
      }
    });
  }

  async createPet(pet: PetData): Promise<string> {
    const query = `
      INSERT INTO Pets (id, name, type, birthDate, description, images, createdAt, userId)
      VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6, @param7)
    `;

    const params = [
      { type: TYPES.VarChar, value: pet.id },
      { type: TYPES.VarChar, value: pet.name },
      { type: TYPES.VarChar, value: pet.type },
      { type: TYPES.VarChar, value: pet.birthDate },
      { type: TYPES.VarChar, value: pet.description },
      { type: TYPES.VarChar, value: JSON.stringify(pet.images) },
      { type: TYPES.BigInt, value: pet.createdAt },
      { type: TYPES.VarChar, value: pet.userId }
    ];

    await this.executeQuery(query, params);
    return pet.id;
  }

  async getPetById(id: string): Promise<PetData | null> {
    const query = 'SELECT * FROM Pets WHERE id = @param0';
    const params = [{ type: TYPES.VarChar, value: id }];

    const rows = await this.executeQuery(query, params);
    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id.value,
      name: row.name.value,
      type: row.type.value,
      birthDate: row.birthDate.value,
      description: row.description.value,
      images: JSON.parse(row.images.value),
      createdAt: Number(row.createdAt.value),
      userId: row.userId.value
    };
  }

  async getAllPets(): Promise<PetData[]> {
    const query = 'SELECT * FROM Pets ORDER BY createdAt DESC';
    const rows = await this.executeQuery(query);

    return rows.map(row => ({
      id: row.id.value,
      name: row.name.value,
      type: row.type.value,
      birthDate: row.birthDate.value,
      description: row.description.value,
      images: JSON.parse(row.images.value),
      createdAt: Number(row.createdAt.value),
      userId: row.userId.value
    }));
  }

  async getUserPets(userId: string): Promise<PetData[]> {
    const query = 'SELECT * FROM Pets WHERE userId = @param0 ORDER BY createdAt DESC';
    const params = [{ type: TYPES.VarChar, value: userId }];

    const rows = await this.executeQuery(query, params);
    return rows.map(row => ({
      id: row.id.value,
      name: row.name.value,
      type: row.type.value,
      birthDate: row.birthDate.value,
      description: row.description.value,
      images: JSON.parse(row.images.value),
      createdAt: Number(row.createdAt.value),
      userId: row.userId.value
    }));
  }

  async deletePet(id: string): Promise<boolean> {
    const query = 'DELETE FROM Pets WHERE id = @param0';
    const params = [{ type: TYPES.VarChar, value: id }];

    const result = await this.executeQuery(query, params);
    return result.length > 0;
  }
}

export const databaseService = new DatabaseService();

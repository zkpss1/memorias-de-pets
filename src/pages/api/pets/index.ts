import { NextApiRequest, NextApiResponse } from 'next';
import { databaseService } from '../../../services/database';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const petData = req.body;
        const id = uuidv4();
        const pet = {
          ...petData,
          id,
          createdAt: Date.now()
        };

        await databaseService.createPet(pet);
        res.status(201).json({ id });
      } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ error: 'Failed to create pet' });
      }
      break;

    case 'GET':
      try {
        const { userId } = req.query;
        const pets = userId 
          ? await databaseService.getUserPets(userId as string)
          : await databaseService.getAllPets();
        res.status(200).json(pets);
      } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ error: 'Failed to fetch pets' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

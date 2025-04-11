import { NextApiRequest, NextApiResponse } from 'next';
import { databaseService } from '../../../services/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const pet = await databaseService.getPetById(id as string);
        if (!pet) {
          res.status(404).json({ error: 'Pet not found' });
          return;
        }
        res.status(200).json(pet);
      } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({ error: 'Failed to fetch pet' });
      }
      break;

    case 'DELETE':
      try {
        const success = await databaseService.deletePet(id as string);
        if (!success) {
          res.status(404).json({ error: 'Pet not found' });
          return;
        }
        res.status(200).json({ message: 'Pet deleted successfully' });
      } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ error: 'Failed to delete pet' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

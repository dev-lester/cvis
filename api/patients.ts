import { VercelRequest, VercelResponse } from '@vercel/node';
import * as fs from 'fs';
import * as path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const filePath = path.join(__dirname, '..', 'db.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(jsonData);
  res.status(200).json(data);
}

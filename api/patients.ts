import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  const filePath = path.join(process.cwd(), 'mock-data', 'db.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);

  res.status(200).json(data);
}

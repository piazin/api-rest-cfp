import { connect, connection } from 'mongoose';
import config from '../../../config';

import categoryService from '../category.service';
const category = new categoryService();

beforeAll(async () => {
  await connect(config.db.url);
});

afterAll(async () => {
  await connection.close();
});

describe('Category Service', () => {
  test('create new category', async () => {
    const data = await category.create({
      title: 'Investimentos',
      iconName: 'finance',
      type: 'income',
    });
    expect(data).toBeTruthy();
  });
});

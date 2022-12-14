import { connect, connection } from 'mongoose';
import config from '../../config';
import { userService } from './user.service';
const user = new userService();

beforeAll(async () => {
  await connect(config.db.url);
});

afterAll(async () => {
  await connection.close();
});

describe('user service', () => {
  it('find one user by id', async () => {
    var user_id: string = '63a305816e3e7773800901c2';
    const data: any = await user.findOneUserByID(user_id);
    expect(data.email).toBe(data.email);
  });

  it('sign user', async () => {
    var data = await user.signInUser('suporte2@slpart.com.br', 'Piazin25$');
    expect(data).toBeTruthy();
  });
});

import { Contact as ContactMapping } from './mapping.js';

class Contact {
  async getAllRequest() {
    const requests = await ContactMapping.findAll();
    return requests;
  }

  async getOneRequest(id) {
    const request = await ContactMapping.findByPk(id);
    return request;
  }

  async createRequest(data) {
    const { name, surname, phone, email, comment } = data;

    if (!name) throw new Error('Вы забыли заполнить имя');
    if (!surname) throw new Error('Вы забыли заполнить фамилию');
    if (!email) throw new Error('Вы забыли заполнить почту');
    if (!comment) throw new Error('Вы забыли заполнить комментарии');

    const check = await ContactMapping.findOne({
      where: {
        comment,
      },
    });

    if (check) {
      throw new Error('Вы уже оставляли такую заявку, измените комментарии');
    }

    const request = await ContactMapping.create({
      name,
      surname,
      phone,
      email,
      comment,
    });

    return request;
  }

  async deleteRequest(id) {
    const check = await ContactMapping.findByPk(id);

    if (!check) {
      throw new Error('Такой заявки не сущетсвует');
    }

    await check.destroy();
    return check;
  }
}

export default new Contact();

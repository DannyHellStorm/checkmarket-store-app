import {
  Service as ServiceMapping,
  ServiceRequest as ServiceRequestMapping,
} from './mapping.js';
import FileService from '../services/File.js';

class Service {
  async getAllServices() {
    const services = await ServiceMapping.findAll();
    return services;
  }

  async getOne(id) {
    const service = await ServiceMapping.findByPk(id);
    return service;
  }

  async createService(name, img) {
    const image = FileService.save(img) ?? '';

    const check = await ServiceMapping.findOne({
      where: {
        name,
      },
    });

    if (check) {
      throw new Error('Такая услуга уже сущетсвует');
    }

    const service = await ServiceMapping.create({ name, image });
    return service;
  }

  async updateService(id, data, img) {
    const service = await ServiceMapping.findByPk(id);

    if (!service) {
      throw new Error('Такая услуга не сущетсвует');
    }

    const file = FileService.save(img);

    if (file && service.image) {
      FileService.delete(service.image);
    }

    const { name = service.name, image = file ? file : service.image } = data;

    await service.update({
      name,
      image,
    });
    await service.reload();
    return service;
  }

  async deleteService(id) {
    const check = await ServiceMapping.findByPk(id);

    if (!check) {
      throw new Error('Такая услуга не сущетсвует');
    }

    if (check.image) {
      FileService.delete(check.image);
    }

    await check.destroy();
    return check;
  }

  async sendRequest(data, serviceId) {
    const { name, surname, phone, email } = data;

    if (!name) throw new Error('Вы забыли заполнить имя');
    if (!surname) throw new Error('Вы забыли заполнить фамилию');
    if (!email) throw new Error('Вы забыли заполнить почту');

    await ServiceRequestMapping.create({
      name,
      surname,
      phone,
      email,
      serviceId,
    });

    const request = await ServiceRequestMapping.findOne({
      where: {
        serviceId,
      },
      include: [
        {
          model: ServiceMapping,
          as: 'service',
          attributes: ['id', 'name'],
        },
      ],
    });

    return request;
  }
}

export default new Service();

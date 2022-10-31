import ServiceModel from '../model/Service.js';
import AppError from '../error/AppError.js';

class Service {
  /*
  method: GET
  desc: get all services
  */
  async getAllServices(req, res, next) {
    try {
      const services = await ServiceModel.getAllServices();
      res.json(services);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get one service
  */
  async getOneService(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id сервиса');
      }
      const service = await ServiceModel.getOne(req.params.id);
      res.json(service);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create service
  */
  async createService(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const service = await ServiceModel.createService(
        req.body.name,
        req.files?.image
      );
      res.json(service);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update service
  */
  async updateService(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id сервиса');
      }

      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const service = await ServiceModel.updateService(
        req.params.id,
        req.body,
        req.files?.image
      );
      res.json(service);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete service
  */
  async deleteService(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id сервиса');
      }

      const service = await ServiceModel.deleteService(req.params.id);
      res.json(service);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create request to service
  */
  async sendRequest(req, res, next) {
    try {
      const { name, surname, phone, email } = req.body;
      const { serviceId } = req.params;

      const request = await ServiceModel.sendRequest(
        {
          name,
          surname,
          phone,
          email,
        },
        serviceId
      );
      res.json(request);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Service();

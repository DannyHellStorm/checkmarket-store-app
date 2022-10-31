import ContactModel from '../model/Contact.js';
import AppError from '../error/AppError.js';

class Contact {
  /*
  method: GET
  desc: get all requests
  */
  async getAllRequests(req, res, next) {
    try {
      const requests = await ContactModel.getAllRequest();
      res.json(requests);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get one request
  */
  async getOneRequest(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id заявки');
      }
      const request = await ContactModel.getOneRequest(req.params.id);
      res.json(request);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create request
  */
  async createRequest(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const request = await ContactModel.createRequest(
        req.body,
        req.files?.image
      );
      res.json(request);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete request
  */
  async deleteRequest(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id заявки');
      }

      const request = await ContactModel.deleteRequest(req.params.id);
      res.json(request);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Contact();

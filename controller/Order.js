import OrderModel from '../model/Order.js';
import BasketModel from '../model/Basket.js';
import AppError from '../error/AppError.js';

class Order {
  /* 
  method: POST
  desc: create new order
  */
  async create(req, res, next) {
    try {
      const {
        payment_method,
        delivery_method,
        city,
        address,
        name,
        surname,
        phone,
        comment,
      } = req.body;

      if (!name) throw new Error('Не указано имя покупателя');
      if (!surname) throw new Error('Не указано имя покупателя');
      if (!phone) throw new Error('Не указан телефон покупателя');
      if (!address) throw new Error('Не указан адрес доставки');

      let items;

      if (!req.signedCookies.basketId) throw new Error('Ваша корзина пуста');

      const basket = await BasketModel.getOne(
        parseInt(req.signedCookies.basketId)
      );

      if (basket.products.length === 0) throw new Error('Ваша корзина пуста');

      items = basket.products;

      const order = await OrderModel.create({
        payment_method,
        delivery_method,
        city,
        address,
        name,
        surname,
        phone,
        comment,
        items,
      });

      await BasketModel.clear(parseInt(req.signedCookies.basketId));
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /* 
  method: GET
  desc: get all orders
  */
  async getAll(req, res, next) {
    try {
      const { name, surname } = req.body;
      const orders = await OrderModel.getAll(name, surname);
      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /* 
  method: GET
  desc: get one order
  */
  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id заказа');
      }

      const order = await OrderModel.getOne(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /* 
  method: DELETE
  desc: delete one order
  */
  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id заказа');
      }
      const order = await OrderModel.delete(req.params.id);
      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Order();

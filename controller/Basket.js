import BasketModel from '../model/Basket.js';
import ProductModel from '../model/Product.js';
import AppError from '../error/AppError.js';

const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

class Basket {
  /*
  method: GET
  desc: get basket
  */
  async getOne(req, res, next) {
    try {
      let basket;
      if (req.signedCookies.basketId) {
        basket = await BasketModel.getOne(parseInt(req.signedCookies.basketId));
      } else {
        basket = await BasketModel.create();
      }
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: append some product into the basket
  */
  async append(req, res, next) {
    try {
      const { productId, quantity } = req.params;
      let basketId;

      if (!req.signedCookies.basketId) {
        let created = await BasketModel.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }

      const basket = await BasketModel.append(basketId, productId, quantity);
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: increment count of products
  */
  async increment(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketModel.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketModel.increment(basketId, productId, quantity);
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: decrement count of products
  */
  async decrement(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketModel.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { productId, quantity } = req.params;
      const basket = await BasketModel.decrement(basketId, productId, quantity);
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: remove products from basket
  */
  async remove(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketModel.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketModel.remove(basketId, req.params.productId);
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: clear basket
  */
  async clear(req, res, next) {
    try {
      let basketId;
      if (!req.signedCookies.basketId) {
        let created = await BasketModel.create();
        basketId = created.id;
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const basket = await BasketModel.clear(basketId);
      res.cookie('basketId', basket.id, { maxAge, signed });
      res.json(basket);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Basket();

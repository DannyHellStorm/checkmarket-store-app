import ProductModel from '../model/Product.js';
import AppError from '../error/AppError.js';

class Product {
  /*
  method: GET
  desc: get one products
  */
  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id товара');
      }

      const product = await ProductModel.getOne(id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get all products with filters
  */
  async getAll(req, res, next) {
    try {
      let { limit, page, categoryId, in_order, in_sale, in_stock, in_price } =
        req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = {
        categoryId,
        limit,
        page,
        in_order,
        in_sale,
        in_stock,
        in_price,
      };

      const products = await ProductModel.getAll(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get all products by price
  */
  async getAllByPrice(req, res, next) {
    try {
      let { limit, page, price_desc, price_asc } = req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = { limit, page, price_desc, price_asc };
      const products = await ProductModel.getProductByPrice(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get all products by stock or order
  */
  async getAllByStock(req, res, next) {
    try {
      let { limit, page, in_stock, in_order } = req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = { limit, page, in_stock, in_order };
      const products = await ProductModel.getProductByStock(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get all products by stock or order
  */
  async getAllBySale(req, res, next) {
    try {
      let { limit, page, in_sale } = req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = { limit, page, in_sale };
      const products = await ProductModel.getProductBySale(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get all products by stock or order
  */
  async getSortingProduct(req, res, next) {
    try {
      let { limit, page, in_popular, in_default, new_date } = req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = { limit, page, in_popular, in_default, new_date };
      const products = await ProductModel.getSorting(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: search products by name
  */
  async searchProduct(req, res, next) {
    try {
      const { key } = req.params;
      const result = await ProductModel.search(key);
      res.json(result);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create product
  */
  async create(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }
      const product = await ProductModel.create(req.body, req.files?.image);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Product();

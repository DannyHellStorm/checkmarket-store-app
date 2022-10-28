import CategoryModel from '../model/Category.js';
import AppError from '../error/AppError.js';
import pkg from 'slugify';

class Category {
  /*
  method: GET
  desc: get all categories
  */
  async getAll(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();
      res.json(categories);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create category
  */
  async create(req, res, next) {
    try {
      const categoryObj = {
        name: req.body.name,
        slug: pkg(req.body.name),
      };

      const category = await CategoryModel.create(categoryObj);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update category
  */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id категории');
      }

      const categoryObj = {
        name: req.body.name,
      };

      if (req.body.name) {
        categoryObj.slug = pkg(req.body.name);
      }

      const category = await CategoryModel.update(id, categoryObj);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete category
  */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error('Не указан id категории');
      }

      const category = await CategoryModel.delete(id);
      res.json(category);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Category();

import BlogModel from '../model/Blog.js';
import AppError from '../error/AppError.js';

class Blog {
  /*
  method: GET
  desc: get all posts
  */
  async getAllPosts(req, res, next) {
    try {
      let { limit, page, type } = req.query;

      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;

      const options = { limit, page, type };
      const posts = await BlogModel.getAllPosts(options);
      res.json(posts);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: GET
  desc: get one post
  */
  async getOnePost(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id сервиса');
      }
      const post = await BlogModel.getOnePost(req.params.id, req.query.type);
      res.json(post);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: POST
  desc: create post
  */
  async createPost(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const post = await BlogModel.createPost(req.body, req.files?.image);
      res.json(post);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: PUT
  desc: update post
  */
  async updatePost(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id поста');
      }

      if (Object.keys(req.body).length === 0) {
        throw new Error('Нет данных для создания');
      }

      const post = await BlogModel.updatePost(
        req.params.id,
        req.body,
        req.files?.image
      );

      res.json(post);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  /*
  method: DELETE
  desc: delete post
  */
  async deletePost(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error('Не указан id поста');
      }

      const post = await BlogModel.deletePost(req.params.id);
      res.json(post);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Blog();

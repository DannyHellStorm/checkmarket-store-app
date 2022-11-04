import { Blog as BlogMapping } from './mapping.js';
import FileService from '../services/File.js';

class Blog {
  async getAllPosts(options) {
    const { limit, page, type } = options;
    const offset = (page - 1) * limit;
    let posts;

    if (type) {
      posts = await BlogMapping.findAndCountAll({
        limit,
        offset,
        where: {
          type,
        },
      });
    } else {
      posts = await BlogMapping.findAndCountAll({
        limit,
        offset,
      });
    }

    return posts;
  }

  async getOnePost(id, type) {
    let post;
    if (type) {
      post = await BlogMapping.findOne({
        where: {
          id,
          type,
        },
      });
    } else {
      post = await BlogMapping.findByPk(id);
    }

    return post;
  }

  async createPost(data, img) {
    const image = FileService.save(img) ?? '';
    const { type, title, description } = data;

    const check = await BlogMapping.findOne({
      where: {
        title,
      },
    });

    if (check) {
      throw new Error('Такой пост уже сущетсвует');
    }

    const post = await BlogMapping.create({
      type,
      title,
      description,
      image,
    });

    return post;
  }

  async updatePost(id, data, img) {
    const post = await BlogMapping.findByPk(id);

    if (!post) {
      throw new Error('Такой пост не сущетсвует');
    }

    const file = FileService.save(img);

    if (file && post.image) {
      FileService.delete(post.image);
    }

    const {
      title = post.title,
      type = post.type,
      description = post.description,
      image = file ? file : post.image,
    } = data;

    await post.update({
      title,
      type,
      description,
      image,
    });

    await post.reload();
    return post;
  }

  async deletePost(id) {
    const check = await BlogMapping.findByPk(id);

    if (!check) {
      throw new Error('Такой пост не сущетсвует');
    }

    await check.destroy();
    return check;
  }
}

export default new Blog();

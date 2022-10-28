import { Category as CategoryMapping } from './mapping.js';

class Category {
  async getAll() {
    const categories = await CategoryMapping.findAll({
      order: [['name', 'ASC']],
    });

    return categories;
  }

  async create(data) {
    const { name, slug } = data;
    const exist = await CategoryMapping.findOne({
      where: { name },
    });

    if (exist) {
      throw new Error('Такая категория уже есть');
    }

    const category = await CategoryMapping.create({ name, slug });
    return category;
  }

  async update(id, data) {
    const category = await CategoryMapping.findByPk(id);

    if (!category) {
      throw new Error('Категория не найдена в БД');
    }

    const { name = category.name } = data;
    const { slug = category.slug } = data;
    await category.update({ name, slug });
    return category;
  }

  async delete(id) {
    const category = await CategoryMapping.findByPk(id);

    if (!category) {
      throw new Error('Категория не найдена в БД');
    }

    await category.destroy();
    return category;
  }
}

export default new Category();

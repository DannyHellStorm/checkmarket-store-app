import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
  Category as CategoryMapping,
} from './mapping.js';

import FileService from '../services/File.js';
import Sequelize from 'sequelize';

const op = Sequelize.Op;

class Product {
  async getOne(id) {
    const product = await ProductMapping.findByPk(id, {
      include: [
        { model: ProductPropMapping, as: 'props' },
        { model: CategoryMapping, as: 'category' },
      ],
    });

    if (!product) {
      throw new Error('Товар не найден в БД');
    }

    return product;
  }

  async getAll(options) {
    const { categoryId, limit, page } = options;
    const offset = (page - 1) * limit;
    const where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: CategoryMapping, as: 'category' }],
      order: [['title', 'ASC']],
    });

    return products;
  }

  async search(key) {
    const result = await ProductMapping.findAll({
      order: [['id', 'ASC']],
      where: {
        title: {
          [op.iLike]: '%' + key + '%',
        },
      },
    });

    if (!result) {
      throw new Error('Товар не найден в БД');
    }

    return result;
  }

  async create(data, img) {
    // поскольку image не допускает null, задаем пустую строку
    const image = FileService.save(img) ?? '';
    const {
      title,
      price,
      categoryId = null,
      in_stock,
      in_order,
      in_sale,
      description,
    } = data;

    const product = await ProductMapping.create({
      title,
      price,
      image,
      categoryId,
      in_stock,
      in_order,
      in_sale,
      description,
    });

    if (data.props) {
      const props = JSON.parse(data.props);
      for (let prop of props) {
        await ProductPropMapping.create({
          name: prop.name,
          value: prop.value,
          productId: product.id,
        });
      }
    }

    const created = await ProductMapping.findByPk(product.id, {
      include: [{ model: ProductPropMapping, as: 'props' }],
    });
    return created;
  }
}

export default new Product();

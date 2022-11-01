import {
  Product as ProductMapping,
  ProductProp as ProductPropMapping,
  OrderItem as OrderItemMapping,
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
    const { categoryId, in_price, in_stock, in_order, in_sale, limit, page } =
      options;

    const offset = (page - 1) * limit;

    if (categoryId) {
      let defaultProducts;

      if (in_stock) {
        if (in_sale === 'true') {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_stock,
              in_sale: {
                [op.not]: null,
              },
            },
          });
        } else if (in_sale === 'false') {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_stock,
              in_sale: {
                [op.is]: null,
              },
            },
          });
        } else {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_stock,
            },
          });
        }
      } else if (in_order) {
        if (in_sale === 'true') {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_order,
              in_sale: {
                [op.not]: null,
              },
            },
          });
        } else if (in_sale === 'false') {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_order,
              in_sale: {
                [op.is]: null,
              },
            },
          });
        } else {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_order,
            },
          });
        }
      } else if (in_sale) {
        if (in_sale === 'true') {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_sale: {
                [op.not]: null,
              },
            },
          });
        } else {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
              in_sale: {
                [op.is]: null,
              },
            },
          });
        }
      } else if (in_price) {
        if (in_price === 'asc') {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
            },
            order: [['price', 'DESC']],
          });
        } else {
          defaultProducts = await ProductMapping.findAndCountAll({
            limit,
            offset,
            where: {
              categoryId,
            },
            order: [['price', 'ASC']],
          });
        }
      } else {
        defaultProducts = await ProductMapping.findAndCountAll({
          limit,
          offset,
          where: {
            categoryId,
          },
        });
      }

      return defaultProducts;
    }
  }

  async getProductByPrice(options) {
    const { limit, page, price_desc, price_asc } = options;
    const offset = (page - 1) * limit;
    let order;

    if (price_desc) {
      order = [['price', 'ASC']];
    }

    if (price_asc) {
      order = [['price', 'DESC']];
    }

    const products = await ProductMapping.findAndCountAll({
      limit,
      offset,
      order,
    });

    return products;
  }

  async getProductByStock(options) {
    const { limit, page, in_stock, in_order } = options;
    const offset = (page - 1) * limit;
    let where = {};

    if (in_order) {
      where.in_order = in_order;
    } else if (in_stock) {
      where.in_stock = in_stock;
    }

    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
      order: [['title', 'ASC']],
    });

    return products;
  }

  async getProductBySale(options) {
    const { limit, page, in_sale } = options;
    const offset = (page - 1) * limit;
    let where = {};

    if (in_sale) {
      where.in_sale = {
        [op.not]: null,
      };
    } else {
      where.in_sale = {
        [op.is]: null,
      };
    }

    const products = await ProductMapping.findAndCountAll({
      where,
      limit,
      offset,
      order: [['title', 'ASC']],
    });

    return products;
  }

  async getSorting(options) {
    const { limit, page, in_popular, new_date, in_default } = options;
    const offset = (page - 1) * limit;

    if (in_popular) {
      const getBestSelling = await OrderItemMapping.findAndCountAll({
        group: ['order_item.productId', 'product.id'],
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('productId')), 'totalOrders'],
        ],
        include: [
          {
            model: ProductMapping,
          },
        ],
        order: [[Sequelize.col('totalOrders'), 'DESC']],
        limit,
        offset,
      });

      return getBestSelling;
    }

    if (new_date) {
      const getNewProduct = await ProductMapping.findAndCountAll({
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
      });

      return getNewProduct;
    }

    if (in_default) {
      const getDefaultProduct = await ProductMapping.findAndCountAll({
        limit,
        offset,
        order: [['title', 'DESC']],
      });

      return getDefaultProduct;
    }
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

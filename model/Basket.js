import {
  Basket as BasketMapping,
  Product as ProductMapping,
  BasketProduct as BasketProductMapping,
} from './mapping.js';
import AppError from '../error/AppError.js';

const basketDTO = (basket) => {
  const data = {};

  data.id = basket.id;
  data.products = [];
  data.total = [];
  if (basket.products) {
    data.products = basket.products.map((item) => {
      return {
        id: item.id,
        title: item.title,
        in_stock: item.in_stock,
        in_order: item.in_order,
        price: item.price,
        quantity: item.basket_product.quantity,
        amount: parseInt(item.price * item.basket_product.quantity),
      };
    });

    data.total = basket.products.reduce(
      (sum, item) => sum + item.price * item.basket_product.quantity,
      0
    );
  }
  return data;
};

class Basket {
  async getOne(basketId) {
    let basket = await BasketMapping.findByPk(basketId, {
      attributes: ['id'],
      include: [
        {
          model: ProductMapping,
          attributes: ['id', 'title', 'price', 'in_stock', 'in_order'],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    return basketDTO(basket);
  }

  async create() {
    const basket = await BasketMapping.create();
    return basketDTO(basket);
  }

  async append(basketId, productId, quantity) {
    let basket = await BasketMapping.findByPk(basketId, {
      attributes: ['id'],
      include: [
        {
          model: ProductMapping,
          attributes: ['id', 'title', 'price', 'in_stock', 'in_order'],
        },
      ],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });

    if (basket_product) {
      await basket_product.increment('quantity', { by: quantity });
    } else {
      await BasketProductMapping.create({ basketId, productId, quantity });
    }

    await basket.reload();
    return basketDTO(basket);
  }

  async increment(basketId, productId, quantity) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });

    if (basket_product) {
      await basket_product.increment('quantity', { by: quantity });
      await basket.reload();
    }
    return basketDTO(basket);
  }

  async decrement(basketId, productId, quantity) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });

    if (basket_product) {
      if (basket_product.quantity > quantity) {
        await basket_product.decrement('quantity', { by: quantity });
      } else {
        await basket_product.destroy();
      }

      await basket.reload();
    }

    return basketDTO(basket);
  }

  async remove(basketId, productId) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });

    if (!basket) {
      basket = await BasketMapping.create();
    }

    const basket_product = await BasketProductMapping.findOne({
      where: { basketId, productId },
    });

    if (basket_product) {
      await basket_product.destroy();
      await basket.reload();
    }

    return basketDTO(basket);
  }

  async clear(basketId) {
    let basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });

    if (basket) {
      await BasketProductMapping.destroy({ where: { basketId } });
    } else {
      basket = await Basket.create();
    }

    return basketDTO(basket);
  }

  async delete(basketId) {
    const basket = await BasketMapping.findByPk(basketId, {
      include: [{ model: ProductMapping, as: 'products' }],
    });
    if (!basket) {
      throw new Error('Корзина не найдена в БД');
    }
    await basket.destroy();
    return basketDTO(basket);
  }
}

export default new Basket();

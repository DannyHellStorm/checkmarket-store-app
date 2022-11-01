import {
  Order as OrderMapping,
  OrderItem as OrderItemMapping,
  Product as ProductMapping,
} from './mapping.js';

class Order {
  async getAll(name = null, surname = null) {
    const options = {};

    const order = await OrderMapping.findAll({
      where: {},
      include: [
        {
          model: OrderItemMapping,
          as: 'items',
          attributes: ['quantity', 'totalPrice'],
          include: [
            {
              model: ProductMapping,
              attributes: ['in_stock', 'in_order', 'title'],
            },
          ],
        },
      ],
    });

    return order;
  }

  async getOne(id) {
    const options = {
      where: { id },
      include: [
        {
          model: OrderItemMapping,
          as: 'items',
          attributes: ['quantity', 'totalPrice'],
          include: [
            {
              model: ProductMapping,
              attributes: ['in_stock', 'in_order', 'title'],
            },
          ],
        },
      ],
    };

    const order = await OrderMapping.findOne(options);

    if (!order) {
      throw new Error('Заказ не найден в БД');
    }

    return order;
  }

  async create(data) {
    const items = data.items;
    const amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const {
      name,
      surname,
      payment_method,
      delivery_method,
      city,
      address,
      phone,
      comment,
    } = data;

    const order = await OrderMapping.create({
      name,
      surname,
      amount,
      payment_method,
      delivery_method,
      city,
      address,
      phone,
      comment,
    });

    for (let item of items) {
      await OrderItemMapping.create({
        totalPrice: parseInt(item.price * item.quantity),
        quantity: item.quantity,
        orderId: order.id,
        productId: item.id,
      });
    }

    const created = await OrderMapping.findByPk(order.id, {
      include: [
        {
          model: OrderItemMapping,
          as: 'items',
          attributes: ['quantity', 'totalPrice'],
          include: [
            {
              model: ProductMapping,
              attributes: ['in_stock', 'in_order', 'title'],
            },
          ],
        },
      ],
    });

    return created;
  }

  async delete(id) {
    let order = await OrderMapping.findByPk(id, {
      include: [
        {
          model: OrderItemMapping,
          as: 'items',
          attributes: ['quantity', 'totalPrice'],
          include: [
            {
              model: ProductMapping,
              attributes: ['in_stock', 'in_order', 'title'],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new Error('Заказ не найден в БД');
    }

    await order.destroy();
    return order;
  }
}

export default new Order();

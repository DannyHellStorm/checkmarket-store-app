import {
  Order as OrderMapping,
  OrderItem as OrderItemMapping,
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
          attributes: [
            'title',
            'in_stock',
            'in_order',
            'quantity',
            'totalPrice',
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
          attributes: [
            'title',
            'in_stock',
            'in_order',
            'quantity',
            'totalPrice',
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
        title: item.title,
        totalPrice: parseInt(item.price * item.quantity),
        in_stock: item.in_stock,
        in_order: item.in_order,
        quantity: item.quantity,
        orderId: order.id,
      });
    }

    const created = await OrderMapping.findByPk(order.id, {
      include: [
        {
          model: OrderItemMapping,
          as: 'items',
          attributes: [
            'title',
            'in_stock',
            'in_order',
            'quantity',
            'totalPrice',
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
          attributes: [
            'title',
            'in_stock',
            'in_order',
            'quantity',
            'totalPrice',
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

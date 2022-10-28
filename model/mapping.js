import sequelize from '../sequelize.js';
import database from 'sequelize';

const { DataTypes } = database;

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  in_stock: { type: DataTypes.BOOLEAN },
  in_order: { type: DataTypes.BOOLEAN },
  in_sale: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT },
});

const ProductProp = sequelize.define('product_prop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
});

Product.hasMany(ProductProp, { as: 'props', onDelete: 'CASCADE' });
ProductProp.belongsTo(Product);

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

Basket.belongsToMany(Product, { through: BasketProduct, onDelete: 'CASCADE' });
Product.belongsToMany(Basket, { through: BasketProduct, onDelete: 'CASCADE' });

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);
Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
});

Category.hasMany(Product, { onDelete: 'RESTRICT' });
Product.belongsTo(Category);

const Service = sequelize.define('service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ServiceRequest = sequelize.define('service_request', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false },
});

Service.hasMany(ServiceRequest, { as: 'services', onDelete: 'CASCADE' });
ServiceRequest.belongsTo(Service);

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  payment_method: {
    type: DataTypes.ENUM,
    values: ['Наличными', 'Безналичный расчет'],
    allowNull: false,
  },
  delivery_method: {
    type: DataTypes.ENUM('Самовывоз', 'Доставка'),
    allowNull: false,
  },
  city: {
    type: DataTypes.ENUM(
      'Акмолинская область',
      'Актюбинская область',
      'Алматинская область',
      'Жамбылская область',
      'Туркестанская область',
      'Актау',
      'Алматы',
      'Атырау',
      'Байконур',
      'Караганда',
      'Павлодар',
      'Петропавловск'
    ),
    allowNull: false,
  },
  address: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.STRING },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  prettyCreatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      const value = this.getDataValue('createdAt');
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      const hours = value.getHours();
      const minutes = value.getMinutes();
      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
    },
  },
  prettyUpdatedAt: {
    type: DataTypes.VIRTUAL,
    get() {
      const value = this.getDataValue('updatedAt');
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      const hours = value.getHours();
      const minutes = value.getMinutes();
      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
    },
  },
});

const OrderItem = sequelize.define('order_item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  in_stock: { type: DataTypes.BOOLEAN },
  in_order: { type: DataTypes.BOOLEAN },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

Order.hasMany(OrderItem, { as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

const Contact = sequelize.define('identify_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.STRING, allowNull: false },
});

const Blog = sequelize.define('blog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('Новости', 'Статьи') },
  title: { type: DataTypes.STRING, allowNull: false },
  desciption: { type: DataTypes.TEXT },
});

export {
  Product,
  ProductProp,
  Basket,
  BasketProduct,
  Category,
  Service,
  ServiceRequest,
  Order,
  OrderItem,
  Contact,
  Blog,
};

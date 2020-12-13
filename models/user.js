const getDB = require("../util/database").getdb;

const mongoDb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  addToCart(product) {
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() == product._id.toString();
    });

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatdCart = {
      items: updatedCartItems,
    };
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatdCart } }
      );
  }

  getCart() {
    const db = getDB();
    const cartProductIds = this.cart.items.map((product) => {
      return product.productId;
    });

    return db
      .collection("products")
      .find({ _id: { $in: cartProductIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() == product._id.toString();
            }).quantity,
          };
        });
      });
  }

  save() {
    const db = getDB();
    return db
      .collection("users")
      .insertOne(this)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(userId) {
    const db = getDB();

    return db
      .collection("users")
      .find({ _id: new mongoDb.ObjectId(userId) })
      .next()
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = User;

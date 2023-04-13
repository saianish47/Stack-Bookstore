import { db } from "./connect.js";
import { v4 as uuidv4 } from 'uuid';
import validators from "./validator.js";


async function getCategory(field, value) {
    const categoriesCollection = await db.collection('category');
    const category = await categoriesCollection.findOne({ [field]: value });

    if (!category || category.length === 0) {

        return null;
    }

    return category;
}

async function getBook(field, value) {
    const bookCollection = await db.collection('book');
    const book = await bookCollection.find({ [field]: value }).toArray();

    if (!book || book.length === 0) {

        return null;
    }

    return book;
}

async function getRandom(field, value, limit) {
    const bookCollection = await db.collection('book');

    let category_name;
    if (field === 'name') {
        category_name = getCategory('name', value)
        value = category_name.category_id
    }

    const books = await bookCollection.aggregate([
        { $match: { [field]: value } },
        { $sample: { size: limit } }
    ]).toArray();

    if (!books || books.length === 0) {

        return null;
    }

    return books;
}

async function getCart(uid) {
    const cartCollection = await db.collection('cart');
    try {
        const result = await cartCollection.find({ "uid": uid }).toArray();
        if (!result || result.length === 0) {
            return null;
        }
        return result;
    }
    catch (e) {
        console.log(e);
    }
}

async function updateCart(uid, book_id, quantity, action = "None") {
    let code = 200;
    let status;
    // console.log(quantity);
    try {
        const cartCollection = await db.collection('cart');
        let filter;
        let update;

        switch (action) {
            case "PUSH":
                filter = { uid: uid };
                update = { $push: { cart: { "book_id": book_id, "quantity": quantity } } };
                break;
            case "PULL":
                filter = { uid: uid };
                update = { $pull: { cart: { book_id: book_id } } };
                break;
            default:
                filter = { uid: uid, "cart.book_id": book_id };
                update = { $inc: { "cart.$.quantity": quantity } };
                break;
        }
        const result = await cartCollection.updateOne(filter, update);
        if (result.modifiedCount === 1) {
            code = 200;
            status = "OK";
        } else {
            code = 500;
            status = "Error adding to cart";
        }
    } catch (e) {
        console.log(e);
        return [500, "Error adding item to cart"];
    }
    return [code, status];
}

async function addToCart(cart, uid) {
    let code = 200;
    let status;
    const cartCollection = await db.collection('cart');
    const { book_id } = cart;
    try {
        const existingCart = await getCart(uid);
        if (!existingCart) {
            // create a new cart document for the given uid
            const newCart = { uid: uid, cart: [cart] };
            await cartCollection.insertOne(newCart);
        } else {
            // check if the book_id already exists in the cart
            const existingCartItem = existingCart[0].cart.find(item => item.book_id === book_id);
            if (existingCartItem) {
                [code, status] = await updateCart(uid, book_id, 1);
            } else {
                [code, status] = await updateCart(uid, book_id, 1, "PUSH");
            }
        }
    } catch (error) {
        console.log(error);
        return [500, "Error adding to cart"]
    }
    return [code, status];
}

async function deleteFromCart(cart, uid) {
    let code = 200;
    let status;
    // const cartCollection = await db.collection('cart');
    const { book_id } = cart;
    try {
        const existingCart = await getCart(uid);
        if (!existingCart) {
            // create a new cart document for the given uid
            code = 500;
            status = "Cart doesnt exist for the customer";
        } else {
            // check if the book_id already exists in the cart
            const existingCartItem = existingCart[0].cart.find(item => item.book_id === book_id);
            if (existingCartItem) {
                if (existingCartItem.quantity === 1) {
                    [code, status] = await updateCart(uid, book_id, -1, "PULL");
                }
                else {
                    [code, status] = await updateCart(uid, book_id, -1);
                }
            } else {
                // add the new item to the cart array
                code = 500;
                status = "Book doesnt exist in cart";
            }
        }
    } catch (error) {
        console.log(error);
        return [500, "Error deleting from cart"];
    }
    return [code, status];
}

async function clearCart(uid){
    const cartCollection = await db.collection('cart');
    try {
        const result = await cartCollection.deleteOne({ uid: uid });
        if (result.deletedCount === 1) {
            return [200, "Success"]
        }
        else{
            return [500, "Error deleting"]
        }
    }
    catch (e) {
        console.log(e);
    }
}

async function generateCart(uid) {
    const cartCol = await getCart(uid);

    if (!cartCol){
        return [400, ""];
    }
    let itemArray = [];

    for (const item of cartCol[0].cart) {
        try {
            const { book_id, quantity } = item;
            const book = await getBook('book_id', parseInt(book_id));
            if (!book || book.length === 0) {
                return [500, "Cant find book"];
            }
            itemArray.push({
                "book": book[0],
                quantity: quantity
            });
        } catch (error) {
            console.error(error);
        }
    }

    const cart = {
        "itemArray": itemArray
    }
    return [200, cart]
}


function generateIds(uid) {
    const uniqueCustomerId = uid ? uid : uuidv4().replace(/-/g, '').slice(0, 16);
    const uniqueOrderId = uuidv4().replace(/-/g, '').slice(0, 16);
    return [uniqueCustomerId, uniqueOrderId];
}
function generateConfirmationNumber() {
    return Math.floor(Math.random() * 1000000000);
}

function createOrder(req, uid) {
    const [customerId, orderId] = generateIds(uid);
    const amount = req.amount;
    const dateCreated = Date.now();
    const confirmationNumber = generateConfirmationNumber();
    const cart = req.cart.itemArray;
    const customer = req.customerForm;

    const Order = {
        orderId: orderId,
        amount: amount,
        dateCreated: dateCreated,
        confirmationNumber: confirmationNumber,
        customerId: customerId,
    }

    const OrderDetails = {
        order: Order,
        customer: customer,
        cart: cart
    }

    const [valid, response] = validators.validateCustomer(customer);
    if (valid) {
        return [200, OrderDetails];
    }
    else {
        return [500, response];
    }

}
export default {
    getCategory,
    getBook,
    getRandom,
    createOrder,
    addToCart,
    deleteFromCart,
    generateCart,
    clearCart
}
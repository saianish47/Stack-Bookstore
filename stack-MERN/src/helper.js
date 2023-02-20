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
    if (field === 'name'){
        category_name = getCategory('name' , value)
        value = category_name.category_id
    }

    const books = await bookCollection.aggregate([
        { $match: { [field]: value  } },
        { $sample: { size: limit } }
    ]).toArray();

    if (!books || books.length === 0) {

        return null;
    }

    return books;
}


function generateIds(){
    const uniqueCustomerId = uuidv4().replace(/-/g, '').slice(0, 16);
    const uniqueOrderId = uuidv4().replace(/-/g, '').slice(0, 16);
    return [uniqueCustomerId, uniqueOrderId];
}
function generateConfirmationNumber() {
    return Math.floor(Math.random() * 1000000000);
  }

function createOrder(req){
    const [customerId, orderId] = generateIds();
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
    if (valid){
        return [200, OrderDetails];
    }
    else{
        return [500, response];
    }

}
export default {
    getCategory,
    getBook,
    getRandom,
    createOrder
}
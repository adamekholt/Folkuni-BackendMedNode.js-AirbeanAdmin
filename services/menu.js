import Product from '../models/product.js';

export async function getMenu() {
    try {
        const menu = await Product.find();
        return menu;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}

export async function getProduct(prodId) {
    try {
        const product = await Product.findOne({ prodId : prodId });
        return product;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}

export async function createProduct(productData) {
    try {
        const { title, desc, price } = productData;
        
        if (!title || !desc || !price) {
            throw new Error('Missing required fields');
        }

        const product = new Product({
            prodId: Math.random().toString(36).substring(2, 10),
            title,
            desc,
            price,
            createdAt: new Date()
        });

        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw error;
    }
}

export async function updateProduct(prodId, productData) {
    try {
        const { title, desc, price } = productData;
        
        if (!title || !desc || !price) {
            throw new Error('Missing required fields');
        }

        const product = await Product.findOne({ prodId });
        if (!product) {
            throw new Error('Product not found');
        }

        product.title = title;
        product.desc = desc;
        product.price = price;
        product.modifiedAt = new Date();

        const updatedProduct = await product.save();
        return updatedProduct;
    } catch (error) {
        throw error;
    }
}
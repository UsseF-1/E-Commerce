const request = require("supertest");
const app = require("../../app");
const User = require("../../models/users.Model");
const Category = require("../../models/categories.model");
const Product = require("../../models/products.model");
const { generateAccessToken } = require("../../utils/generateToken");
const roles = require("../../utils/usersRoles");

describe("Product Integration Tests", () => {
    let seller1, seller1Token;
    let seller2, seller2Token;
    let clientUser, clientToken;
    let category;
    let seller2Product;

    beforeEach(async () => {
        seller1 = await User.create({
            firstName: "Seller",
            lastName: "One",
            email: "seller1@test.com",
            password: "password123",
            role: roles.SELLER,
            phone: "01000000001"
        });
        seller1Token = generateAccessToken(seller1);

        seller2 = await User.create({
            firstName: "Seller",
            lastName: "Two",
            email: "seller2@test.com",
            password: "password123",
            role: roles.SELLER,
            phone: "01000000002"
        });
        seller2Token = generateAccessToken(seller2);

        clientUser = await User.create({
            firstName: "Customer",
            lastName: "Client",
            email: "client@test.com",
            password: "password123",
            role: roles.CLIENT,
            phone: "01000000003"
        });
        clientToken = generateAccessToken(clientUser);

        category = await Category.create({
            categoryName: "Laptops",
            description: "Laptops and computers category"
        });

        seller2Product = await Product.create({
            productName: "Seller2 MacBook Pro",
            description: "Original MacBook Pro belonging to Seller 2",
            price: 1500,
            stock: 3,
            category: category._id,
            seller: seller2._id,
            status: "ACTIVE"
        });
    });

    describe("Security & Ownership Protection", () => {
        
        test("should prevent Seller 1 from deleting a product owned by Seller 2 (403)", async () => {
            const response = await request(app)
                .delete(`/api/products/${seller2Product._id}`)
                .set("Authorization", `Bearer ${seller1Token}`);

            expect(response.status).toBe(403);

            const productStillExists = await Product.findById(seller2Product._id);
            expect(productStillExists).not.toBeNull();
        });

        test("should prevent Seller 1 from updating a product owned by Seller 2 (403)", async () => {
            const response = await request(app)
                .put(`/api/products/${seller2Product._id}`)
                .set("Authorization", `Bearer ${seller1Token}`)
                .send({ price: 10 }); 

            expect(response.status).toBe(403);

            const unchangedProduct = await Product.findById(seller2Product._id);
            expect(unchangedProduct.price).toBe(1500);
        });

        test("should ensure product is always assigned to the token owner (ignore spoofed seller in body)", async () => {
            const response = await request(app)
                .post("/api/products")
                .set("Authorization", `Bearer ${seller1Token}`)
                .send({
                    productName: "Gaming Mouse RGB",
                    description: "High precision gaming mouse",
                    price: 40,
                    stock: 20,
                    category: category._id.toString(),
                    seller: seller2._id.toString()
                });

            expect(response.status).toBe(201);

            const savedProduct = await Product.findOne({ productName: "Gaming Mouse RGB" });
            expect(savedProduct.seller.toString()).toBe(seller1._id.toString());
            expect(savedProduct.seller.toString()).not.toBe(seller2._id.toString());
        });

        test("should reject Client from creating a product", async () => {
            const response = await request(app)
                .post("/api/products")
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    productName: "Fake Client Product",
                    description: "Trying to add product as client",
                    price: 50,
                    stock: 10,
                    category: category._id.toString()
                });

            expect([401, 403]).toContain(response.status);
        });

        test("should reject Client from deleting any product", async () => {
            const response = await request(app)
                .delete(`/api/products/${seller2Product._id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect([401, 403]).toContain(response.status);
        });
    });

    describe("Product CRUD Operations", () => {
        
        test("should allow Seller to create a new product", async () => {
            const newProductData = {
                productName: "Dell XPS 15",
                description: "Powerful developer laptop with 32GB RAM",
                price: 1800,
                stock: 5,
                category: category._id.toString()
            };

            const response = await request(app)
                .post("/api/products")
                .set("Authorization", `Bearer ${seller1Token}`)
                .send(newProductData);

            expect(response.status).toBe(201);
            expect(response.body.Status).toBe("SUCCESS");
            expect(response.body.data.productData.productName).toBe(newProductData.productName);
        });

        test("should allow any guest to view all active products", async () => {
            const response = await request(app).get("/api/products");

            expect(response.status).toBe(200);
            expect(response.body.Status).toBe("SUCCESS");
            expect(Array.isArray(response.body.data.productsData)).toBe(true);
            expect(response.body.data.productsData.length).toBeGreaterThanOrEqual(1);
        });

        test("should return single product details by ID", async () => {
            const response = await request(app).get(`/api/products/${seller2Product._id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.productData.productName).toBe(seller2Product.productName);
        });

        test("should return 404 if product ID does not exist", async () => {
            const fakeId = "65a000000000000000000099";
            const response = await request(app).get(`/api/products/${fakeId}`);

            expect(response.status).toBe(404);
        });

        test("should allow Seller 2 to update their own product", async () => {
            const response = await request(app)
                .put(`/api/products/${seller2Product._id}`)
                .set("Authorization", `Bearer ${seller2Token}`)
                .send({
                    price: 1400,
                    stock: 7
                });

            expect(response.status).toBe(200);

            const updated = await Product.findById(seller2Product._id);
            expect(updated.price).toBe(1400);
            expect(updated.stock).toBe(7);
        });

        test("should allow Seller 2 to delete their own product", async () => {
            const response = await request(app)
                .delete(`/api/products/${seller2Product._id}`)
                .set("Authorization", `Bearer ${seller2Token}`);

            expect(response.status).toBe(200);

            const deleted = await Product.findById(seller2Product._id);
            expect(deleted).toBeNull();
        });
    });
});
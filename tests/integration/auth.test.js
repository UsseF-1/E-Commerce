const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/users.Model");
const RefreshSession = require("../../models/refreshSession.model");

const { hashRefreshToken } = require("../../utils/generateToken");

describe("POST /api/auth/register", () => {

    const validUser = {
        firstName: "TEST",
        lastName: "TEST",
        email: "TEST@TEST.com",
        password: "TEST123",
        role: "CLIENT",
        phone: "01234567890"
    };

    describe("Successful registration", () => {

        test("should register a user and return tokens", async () => {
            const response = await request(app).post("/api/auth/register").send(validUser);

            expect(response.status).toBe(201);
            expect(response.body.status).toBe("SUCCESS");

            expect(response.body.data.user).toMatchObject({
                firstName: validUser.firstName,
                lastName: validUser.lastName,
                email: validUser.email,
                role: "CLIENT",
                phone: validUser.phone
            });

            expect(response.body.data.accessToken).toEqual(
                expect.any(String)
            );

            expect(response.body.data.refreshToken).toEqual(
                expect.any(String)
            );

            expect(response.body.data.user.password).toBeUndefined();

            const savedUser = await User.findOne({
                email: validUser.email
            });

            expect(savedUser).not.toBeNull();

            expect(savedUser.password).not.toBe(validUser.password);

            const passwordMatches = await bcrypt.compare(
                validUser.password,
                savedUser.password
            );

            expect(passwordMatches).toBe(true);

            const decoded = jwt.verify(
                response.body.data.accessToken,
                process.env.JWT_ACCESS_SECRET
            );

            expect(decoded.id).toBe(savedUser._id.toString());
            expect(decoded.role).toBe("CLIENT");

            const refreshToken = response.body.data.refreshToken;

            const session = await RefreshSession.findOne({
                userId: savedUser._id
            }).select("+tokenHash");

            expect(session).not.toBeNull();
            expect(session.tokenHash).toBe(
                hashRefreshToken(refreshToken)
            );
            expect(session.tokenHash).not.toBe(refreshToken);
        });

    });

    describe("Registration errors", () => {

        test("should return 409 if email already exists", async () => {
            await request(app)
                .post("/api/auth/register")
                .send(validUser);

            const response = await request(app)
                .post("/api/auth/register")
                .send(validUser);

            expect(response.status).toBe(409);

            const usersCount = await User.countDocuments({
                email: validUser.email
            });

            expect(usersCount).toBe(1);
        });

        test("should return 400 if required fields are missing", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    firstName: validUser.firstName,
                    email: validUser.email
                });

            expect(response.status).toBe(400);
        });

        test("should reject an invalid role", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    ...validUser,
                    role: "SUPER_ADMIN"
                });

            expect(response.status).toBe(400);

            const user = await User.findOne({
                email: validUser.email
            });

            expect(user).toBeNull();
        });

    });

});

describe("POST /api/auth/login", () => {

    const userData = {
        email: "test@test.com",
        password: "TEST123!"
    }

    describe("Successful Login", () => {

        test("Should retrun 200 and token", async () => {

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            await User.create({
                firstName: "TEST",
                lastName: "TEST",
                email: userData.email,
                password: hashedPassword,
                role: "CLIENT",
                phone: "01234567890"
            })

            const response = await request(app).post("/api/auth/login").send(userData)

            expect(response.status).toBe(200)
            expect(response.body.status).toBe("SUCCESS")
            expect(response.body.data.user.firstName).toBe("TEST")
            expect(response.body.data.user.lastName).toBe("TEST")
            expect(response.body.data.user.email).toBe(userData.email)
            expect(response.body.data.user.role).toBe("CLIENT")
            expect(response.body.data.accessToken).toEqual(
                expect.any(String)
            );
        })
    })

    describe("Failed Login", () => {

        const userData = {
            email: "test@test.com",
            password: "TEST123!"
        }

        test("should return 400 if password is missing", async () => {
            const response = await request(app).post("/api/auth/login").send({email: userData.email});

            expect(response.status).toBe(400);
        });

        test("should retrun 400 if email is missing", async () => {
            const response = await request(app).post("/api/auth/login").send({password: userData.password});

            expect(response.status).toBe(400);
        })

        test("Should return 401 if Invalid", async () => {
            const response = await request(app).post("/api/auth/login")
            .send({email: "test@gmail.com" , password: userData.password});

            expect(response.status).toBe(401)
            expect(response.body.message).toBe("Invalid email or password")
        })

        test("Should return 401 if Invalid password", async () => {
            const response = await request(app).post("/api/auth/login")
            .send({email: userData.email , password: "123"});
            
            // console.log(response.status)
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("Invalid email or password")
        })

    })

})
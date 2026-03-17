const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const config = require('../config');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;

async function register({ first_name, last_name, phone, email, password }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });

  if (existing) {
    if (existing.email === email) {
      throw ApiError.conflict('An account with this email already exists');
    }
    throw ApiError.conflict('An account with this phone number already exists');
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { first_name, last_name, phone, email, password_hash, role: 'user' },
    select: { id: true, first_name: true, last_name: true, email: true, phone: true, role: true, created_at: true },
  });

  const token = generateToken(user);
  return { user, token };
}

async function login({ email, phone, password }) {
  const where = email ? { email } : { phone };
  const user = await prisma.user.findUnique({ where });

  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
}

async function adminLogin({ username, password }) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || user.role !== 'admin') {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    token,
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
}

module.exports = { register, login, adminLogin };

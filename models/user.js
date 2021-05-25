"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** User functions */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, about, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username, 
        password,
        first_name AS "firstName", 
        last_name AS "lastName",
        about,
        is_admin AS "isAdmin"
      FROM users
      WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({
    username,
    password,
    firstName,
    lastName,
    about,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
             (username,
              password,
              first_name,
              last_name,
              about,
              is_admin)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING username, 
              first_name AS "firstName", 
              last_name AS "lastName", 
              about, 
              is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, about, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;

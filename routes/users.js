"use strict";

/** users routes */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureAdmin, ensureAdminOrSelf } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAddSchema = require("../schema/userAdd.json");
const userUpdateSchema = require("../schema/userUpdate.json");

const router = new express.Router();

/** POST /  => { user, token }
 *
 * Adds a new user, for admins only
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, about, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAddSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 * { users: [ {username, firstName, lastName, email, jobs: [jobId, ...] }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs: [jobId, jobId, ...] }
 *
 * Authorization required: admin or user being accessed
 **/

router.get("/:username", ensureAdminOrSelf, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { data } => { user }
 *
 * Data can include:
 *   { firstName, lastName, about, password }
 *
 * If password, only used for verification
 *
 * Returns { username, firstName, lastName, about, isAdmin }
 *
 * Authorization required: admin or user being updated
 **/

router.patch("/:username", ensureAdminOrSelf, async function (req, res, next) {
  try {
    const data = req.body;
    const validator = jsonschema.validate(data, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    // if password provided (can require on front end if not admin)
    if (data.password) {
      await User.authenticate(req.params.username, req.body.password);
      delete data.password;
    }

    const user = await User.update(req.params.username, data);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or user being deleted
 **/

router.delete("/:username", ensureAdminOrSelf, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

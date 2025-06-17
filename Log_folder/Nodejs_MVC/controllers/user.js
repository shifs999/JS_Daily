const User = require("../models/user")

async function getAllUsers(req, res){
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function getUserById(req, res){
  const user_id = await User.findById(req.params.id);
  return res.json(user_id);
}

async function DeleteUserById(req, res){
  await User.findByIdAndDelete(req.params.id)
  return res.json({ status: "success", id });
}

async function CreateUser(req, res){
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  });
  return res.status(201).json({ msg: "success", id: result._id});
}

module.exports = {getAllUsers, getUserById, DeleteUserById, CreateUser};
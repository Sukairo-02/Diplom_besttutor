const User = require('../../models/User');
const Teacher = require('../../models/Teacher');
const Role = require('../../models/Roles');
const Token = require('../../models/Token');
const Validation = require('../../models/Validation');
const Resetpass = require('../../models/Resetpass');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('config');
const secret = config.get('server.secret');
const transporter = require('../mailtransporter/transporter');

class schoolController {

    

}

module.exports = new schoolController();

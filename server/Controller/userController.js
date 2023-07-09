const { User } = require("../Model/userModel");
const { isValidEmail, isValidPwd, isValidName } = require("../Util/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  console.log("req.body ", req.body);
  try {
    if (Object.keys(req.body).length === 0) {
      console.log("req.body");
      return res.status(401).send({
        stauts: false,
        massage: "All Credientials Are Required.. !!",
      });
    }

    // .......................All Credientials Are Required....................
    if (!name || !email || !password) {
      console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "All Credientials Are Required.. !!",
      });
    }
    //.......................error inside name.......................
    if (!isValidName(name)) {
      console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "Only String valid !!",
      });
    }

    //  .......................error inside email .......................
    if (!isValidEmail(email)) {
      console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "email is not valid !!",
      });
    }

    // ....................... error inside password .......................
    if (!isValidPwd(password)) {
      console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "password is not valid !!",
      });
    }

    // ....................find user  ..................................
    const checkPassword = await User.findOne({ email });
    // console.log("chec" ,checkPassword);

    //  .......................chack user if alreay register ........
    if (checkPassword) {
      return res.status(201).json({
        stauts: false,
        massage: "already register!!",
      });
    } else {
      // .......................create password strong ......
      const hasmapPassword = await bcrypt.hash(password, 10);
      console.log("hasjhg ", hasmapPassword);
      const response = new User({
        name,
        password: hasmapPassword,
        email,
      });

      await response.save();
      return res.status(201).json({
        stauts: true,
        massage: "register succesfully!!",
        response,
      });
    }
  } catch (error) {
    return res.status(401).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

//  Login Section ....

exports.login = async (req, res) => {
  const { email, password, id } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).json({
        stauts: false,
        massage: "Fill All Credientials",
      });
    }
    //  .......................error inside email .......................
    if (!isValidEmail(email)) {
      //   console.log("email is not valid");
      return res.status(401).send({
        stauts: false,
        massage: "email is not valid !!",
      });
    }

    // ....................... error inside password .......................
    if (!isValidPwd(password)) {
      //   console.log("all are required");
      return res.status(401).send({
        stauts: false,
        massage: "password is not valid !!",
      });
    }

    //.................find user ....................
    const findUser = await User.findOne({ email });
    console.log("user", findUser);

    // ................. check user.........................
    if (!findUser) {
      return res.status(401).json({
        stauts: false,
        massage: "User Not Found Please Register !!",
      });
    } else {
      //  ............... check passowrd  ............
      const matchPasswrod = await bcrypt.compare(password, findUser.password);
      //   console.log("matchPasswrod", matchPasswrod);
      // ..........................Match Password......................
      if (!matchPasswrod) {
        return res.status(401).json({
          stauts: false,
          massage: "Password and Email Not Match!!",
        });
      } else {
        // ...........................create Token..................................
        const token = await jwt.sign({ id: findUser._id }, "dsjglsdkjhgkldjfg");
        console.log("token", token);
        return res.status(201).json({
          stauts: true,
          massage: "Login Successfully !!",
          token,
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      stauts: false,
      massage: "Something Wrong !!",
      error,
    });
  }
};

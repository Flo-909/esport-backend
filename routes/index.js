const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const mongoose = require("mongoose");
const userModel = require("../models/users");
const campaignModel = require("../models/campaigns");
const multer = require("multer");
const nodemailer = require("nodemailer");
const request = require("sync-request");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dugu0nhcg",
  api_key: "158255786999153",
  api_secret: "L3H4OhxjKr04ILNd50Xi2j5sDBY",
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

let mailOptions = {
  from: "lerouzic.florian1@@gmail.com",
  to: "lerouzic.florian1@@gmail.com",
  subject: "Nodemailer Project",
  text: "Hi from your nodemailer project",
};

router.get("/", async function (req, res, next) {
  res.render("index", { title: "Esport Backend" });
});

router.post("/sign-up/brand", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });

  if (data != null) {
    error.push("User Already Exist");
  }

  if (
    req.body.firstNameFromFront == "" ||
    req.body.lastNameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == "" ||
    req.body.companyFromFront == ""
  ) {
    error.push("Empty Field");
  }

  if (error.length === 0) {
    let salt = uid2(32);
    let newUser = new userModel({
      company: req.body.companyFromFront,
      firstName: req.body.firstNameFromFront,
      lastName: req.body.lastNameFromFront,
      email: req.body.emailFromFront,
      password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
      phone: req.body.phoneFromFront,
      role: "brand",
    });
    saveUser = await newUser.save();
    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }
  res.json({ result, saveUser, error, token });
});
router.post("/sign-up/influencer", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });
  if (data != null) {
    error.push("User Already Exist");
  }
  if (
    req.body.firstNameFromFront == "" ||
    req.body.lastNameFromFront == "" ||
    req.body.userNameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == "" ||
    req.body.bioFromFront == "" ||
    req.body.favoriteGameFromFront == "" ||
    req.body.numberFollower == "" ||
    req.body.urlSocialNetworkFromFront == ""
  ) {
    error.push("Empty Field");
  }
  if (error.length === 0) {
    let salt = uid2(32);
    let newUser = new userModel({
      userName: req.body.userNameFromFront,
      firstName: req.body.firstNameFromFront,
      lastName: req.body.lastNameFromFront,
      email: req.body.emailFromFront,
      bio: req.body.bioFromFront,
      password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
      phone: req.body.phoneFromFront,
      role: "influenceur",
      numberFollower: req.body.numberFollowerFromFront,
      favoriteGame: req.body.favoriteGameFromFront,
      urlSocialNetwork: req.body.urlSocialNetworkFromFront,
    });
    saveUser = await newUser.save();
    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }
  res.json({ result, saveUser, error, token });
});

router.post("/sign-in", async function (req, res, next) {
  let result = false;
  let user = null;
  let error = [];
  let token = null;

  if (req.body.emailFromFront == "" || req.body.passwordFromFront == "") {
    error.push("Empty Field");
  }

  if (error.length == 0) {
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    });

    if (user) {
      const passwordEncrypt = SHA256(
        req.body.passwordFromFront + user.salt
      ).toString(encBase64);
      if (passwordEncrypt == user.password) {
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push("Incorrect Password ");
      }
    } else {
      error.push("Incorrect Email");
    }
  }
  res.json({ result, user, error, token });
});

router.post("/addcampaign", async function (req, res, next) {
  let error = [];

  if (
    req.body.nameCampaignFromFront == "" ||
    req.body.descriptionFromFront == "" ||
    req.body.audienceMinFromFront == "" ||
    req.body.audienceMaxFromFront == ""
  ) {
    error.push("Empty Field");
    res.json({ error });
  } else {
    const user = await userModel.findOne({ token: req.body.token });
    const campaign = new campaignModel({
      campaignName: req.body.nameCampaignFromFront,
      dateStart: req.body.dateStartFromFront,
      dateEnd: req.body.dateEndFromFront,
      status: "Created",
      description: req.body.descriptionFromFront,
      audienceCriteriaMin: req.body.audienceMinFromFront,
      audienceCriteriaMax: req.body.audienceMaxFromFront,
      uploadedDoc: req.body.uploadDocFromFront,
      brand_id: user._id,
    });
    const campaignSave = await campaign.save();
    let insertId = await userModel.findOneAndUpdate(
      { token: req.body.token },
      { campaign_id: campaignSave._id }
    );
    res.json({ campaignSave });
  }
});

router.get("/get-campaign-details/:id", async function (req, res, next) {
  const returnCampaign = await campaignModel.findOne({ _id: req.params.id });
  res.json({ returnCampaign });
});

router.get("/mycampaign", async function (req, res, next) {
  const company = await userModel.findOne({ token: req.query.companyToken });
  const myCampaign = await campaignModel.find({ brand_id: company._id });
  res.json({ myCampaign, company });
});

router.post("/campaign-apply", async function (req, res, next) {
  let influencer = await userModel.findOne({ token: req.body.token });
  let updatedCampaign = await campaignModel.findOneAndUpdate(
    { _id: req.body.id },
    { influencer_id: influencer._id, status: "Waiting" }
  );
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
  res.json({ updatedCampaign });
});

router.get("/get-influencer-request-list", async function (req, res, next) {
  let brand = await userModel.findOne({ token: req.query.brandToken });
  var returnCampaignDetail = await campaignModel.findOne({
    brand_id: brand.id,
  });
  let influenceur = await userModel.findOne({
    _id: returnCampaignDetail.influencer_id,
  });
  res.json({ returnCampaignDetail, influenceur });
});

router.post("/update-request-acc", async function (req, res, next) {
  let brand = await userModel.findOne({ token: req.body.token });
  let update = await campaignModel.findOneAndUpdate(
    { brand_id: brand.id },
    { status: "Accepted" }
  );
  res.json({ update });
});

router.post("/update-request-ref", async function (req, res, next) {
  let brand = await userModel.findOne({ token: req.body.token });
  let update = await campaignModel.findOneAndUpdate(
    { brand_id: brand.id },
    { status: "Refused" }
  );
  res.json({ update });
});

router.get("/get-campaign", async function (req, res, next) {
  const campaignListItem = await campaignModel.find({ status: "Created" });
  res.json({ campaignListItem });
});

router.get("/influencerdetails", async function (req, res, next) {
  const influencerProfil = await userModel.findOne({
    token: req.query.influencerToken,
  });
  res.json({ influencerProfil });
});

router.get("/get-request-list-influencer", async function (req, res, next) {
  let influencer = await userModel.findOne({
    token: req.query.influencerToken,
  });
  const returnCampaignDetail = await campaignModel.find({
    influencer_id: influencer.id,
  });
  let brand = await userModel.findOne({ _id: returnCampaignDetail.brand_id });

  res.json({ returnCampaignDetail, brand });
});

router.get("/branddetails", async function (req, res, next) {
  const brandProfil = await userModel.findOne({ token: req.query.brandToken });
  res.json({ brandProfil });
});

// const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: "./public/uploads/images",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// const upload = multer({
//   storage,
//   limits: { fileSize: 1000000 },
// });

// const singleUpload = upload.single("image");

// const singleUploadCtrl = (req, res, next) => {
//   singleUpload(req, res, (error) => {
//     console.log("singleUploadCtrl");
//     if (error) {
//       return res.status(422).send({ message: "Image upload fail!" });
//     }
//     next();
//   });
// };

router.post("/image-upload", upload.single("image"), function (req, res) {
  console.log("req.file", req.file, req.files);
  console.log("req.body", req.body);
  try {
    if (!req.file) {
      throw new Error("Image is not presented!");
    }
    console.log(req.file);

    return res.json({ message: "Huraaaay" });
  } catch (e) {
    return res.status(422).send({ message: e.message });
  }
});

// console.log("upload", req.body);
// const resultCloudinary = await cloudinary.uploader.upload(req.body);
// console.log("resultCloudinary", resultCloudinary);

// try {
//   const newImage = new Image({
//     imageUrl: req.body.uploadedDoc,
//   });
//   await newImage.save();
//   res.json(newImage.uploadedDoc);
// } catch (err) {
//   console.error("Something went wrong", err);
// }

// ​
// app.get('/getLatest', async (req, res) => {
//   const getImage = await Image.findOne().sort({ _id: -1 });
//   res.json(getImage.uploadedDoc);
// });

module.exports = router;

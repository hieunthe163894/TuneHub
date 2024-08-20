import dotenv from "dotenv";
import dateFormat from "dateformat";
import crypto from "crypto";
import querystring from "qs";
import vnpay from "../utils/vnpay.js";
import {
  SongRepository,
  UserRepository,
  TransactionRepository,
  ArtistRepository,
  AlbumRepository,
} from "../repository/index.js";
import mongoose from "mongoose";
const purchaseSong = async (req, res) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = process.env.vnp_ReturnUrl;

  var date = new Date();
  var createDate = dateFormat(date, "yyyymmddHHMMss");
  createDate = createDate.replace("mm", "MM");
  console.log(createDate);

  var orderId = dateFormat(date, "HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  const decodedToken = req.decodedToken;
  var orderInfo = `Payment from user ${decodedToken.userId} for track ${req.body.songId} amount ${amount}`;
  var orderType = "190000";
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "en";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  console.log(vnp_Params);
  vnp_Params = vnpay.sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return res.status(200).json({ data: vnpUrl });
};
const donateArtist = async (req, res) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = "http://localhost:9999/api/payment/donateReturn";

  var date = new Date();
  var createDate = dateFormat(date, "yyyymmddHHMMss");
  createDate = createDate.replace("mm", "MM");
  console.log(createDate);

  var orderId = dateFormat(date, "HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  const decodedToken = req.decodedToken;
  var orderInfo = `Donated ${amount} vnd from user ${decodedToken.userId} to artist ${req.body.artistId}`;
  var orderType = "190000";
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "en";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  console.log(vnp_Params);
  vnp_Params = vnpay.sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  console.log(vnpUrl);
  return res.status(200).json({ data: vnpUrl });
};
const purchaseSongReturn = async (req, res) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = vnpay.sortObject(vnp_Params);
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  const paymentInfo = vnp_Params.vnp_OrderInfo.split("+");
  const userId = paymentInfo[3];
  const songId = paymentInfo[6];
  const amount = paymentInfo[8];
  const song = await SongRepository.getSongsById({ songId });
  console.log(vnp_Params);
  if (secureHash === signed) {
    if (vnp_Params.vnp_ResponseCode === "00") {
      const transaction = await TransactionRepository.addTransaction({
        user: userId,
        seller: song.artist,
        amount: amount,
        type: "song",
        goodsId: songId,
      });
      const updatedUser = await UserRepository.addSongPurchased(userId, songId);
      const updatedSong = await SongRepository.addPurchaser(userId, songId);

      console.log("giao dich thanh cong");
      res.redirect(
        302,
        `http://localhost:3000/payment/result/ok/Purchased Successfully, you can now enjoy the full version of ${updatedSong.song_name} by ${updatedSong.artist.artist_name}`
      );
    } else {
      res.redirect(
        302,
        `http://localhost:3000/failed/Something went wrong! Please try again later`
      );
    }
  } else {
    res.redirect(302, "http://localhost:3000/failed/Invalid Signature");
  }
};
const donateReturn = async (req, res) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = vnpay.sortObject(vnp_Params);
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  const paymentInfo = vnp_Params.vnp_OrderInfo.split("+");
  const amount = paymentInfo[1];
  const userId = paymentInfo[5];
  const artistId = paymentInfo[8];
  console.log(vnp_Params);
  if (secureHash === signed) {
    if (vnp_Params.vnp_ResponseCode === "00") {
      const transaction = await TransactionRepository.addTransaction({
        user: userId,
        seller: artistId,
        amount: amount,
        type: "donate",
      });

      console.log("giao dich thanh cong");
      res.redirect(
        302,
        `http://localhost:3000/payment/result/ok/Your donation to the artist has been recorded`
      );
    } else {
      res.redirect(
        302,
        `http://localhost:3000/failed/Something went wrong! Please try again later`
      );
    }
  } else {
    res.redirect(302, "http://localhost:3000/failed/Invalid Signature");
  }
};
const artistKitPayment = async (req, res) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = "http://localhost:9999/api/payment/artistKitReturn";

  var date = new Date();
  var createDate = dateFormat(date, "yyyymmddHHMMss");
  createDate = createDate.replace("mm", "MM");
  console.log(createDate);

  var orderId = dateFormat(date, "HHmmss");
  var amount = 250000;
  var bankCode = req.body.bankCode;
  const decodedToken = req.decodedToken;
  var orderInfo = `Payment from user ${decodedToken.userId} to create artist ${req.body.artistName}`;
  var orderType = "190000";
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "en";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  console.log(vnp_Params);
  vnp_Params = vnpay.sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  return res.status(200).json({ data: vnpUrl });
};
const artistKitReturn = async (req, res) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = vnpay.sortObject(vnp_Params);
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  const paymentInfo = decodeURIComponent(vnp_Params.vnp_OrderInfo).split("+");
  const userId = paymentInfo[3];
  const artistNameParts = paymentInfo.slice(7);
  const artistName = artistNameParts.join(" ");
  console.log(vnp_Params);
  if (secureHash === signed) {
    if (vnp_Params.vnp_ResponseCode === "00") {
      const [newArtist, updatedUser] = await Promise.all([
        ArtistRepository.createArtist(userId, artistName),
        UserRepository.upgradeToArtist(userId),
      ]);
      console.log("giao dich thanh cong");
      res.redirect(
        302,
        `http://localhost:3000/paymentArtistReturn/result/ok/Your account has been promoted to Artist. Artist features can be accessed at Artist in the menu by clicking on your profile picture/${userId}`
      );
    } else {
      res.redirect(
        302,
        `http://localhost:3000/failed/Something went wrong! Please try again later`
      );
    }
  } else {
    res.redirect(302, "http://localhost:3000/failed/Invalid Signature");
  }
};

const purchaseAlbum = async (req, res) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = "http://localhost:9999/api/payment/vnpay_return_album";

  var date = new Date();
  var createDate = dateFormat(date, "yyyymmddHHMMss");
  createDate = createDate.replace("mm", "MM");
  console.log(createDate);

  var orderId = dateFormat(date, "HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  const decodedToken = req.decodedToken;
  var orderInfo = `Payment from user ${decodedToken.userId} for track ${req.body.albumId}`;
  var orderType = "190000";
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "en";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  console.log(vnp_Params);
  vnp_Params = vnpay.sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  return res.status(200).json({ data: vnpUrl });
};

const purchaseAlbumReturn = async (req, res) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = vnpay.sortObject(vnp_Params);
  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  const paymentInfo = vnp_Params.vnp_OrderInfo.split("+");
  const userId = paymentInfo[3];
  const albumId = paymentInfo[6];
  console.log(vnp_Params);
  if (secureHash === signed) {
    if (vnp_Params.vnp_ResponseCode === "00") {
      const transaction = await AlbumRepository.buyAlbumByUser({
        albumId,
        userId: new mongoose.Types.ObjectId(userId)
      });

      console.log("giao dich thanh cong");
      res.redirect(
        302,
        `http://localhost:3000/payment/result/ok/Purchased Successfully, you can now enjoy the full version of this Album`
      );
    } else {
      res.redirect(
        302,
        `http://localhost:3000/failed/Something went wrong! Please try again later`
      );
    }
  } else {
    res.redirect(302, "http://localhost:3000/failed/Invalid Signature");
  }
};
export default {
  purchaseSong,
  purchaseSongReturn,
  donateArtist,
  donateReturn,
  artistKitPayment,
  artistKitReturn,
  purchaseAlbum,
  purchaseAlbumReturn
};

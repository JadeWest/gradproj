const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const moment = require('moment');

const router = express.Router();
const saltRound = 10;

// Moment
moment().format();
let myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

// 회원가입
router.post('/', (req, res) => {
  let user = {
    PW : req.body.password,
    USER_NM : req.body.userName,
    MAJOR_NM : req.body.majorName,
    STUDENT_NUM_PK : req.body.studentNumber,
    PHONE_NUM : req.body.phoneNumber,
    EMAIL : req.body.email,
    ISSUED_DATE_DT : myDate
  };

  // Password Hashing and save newUser data
  bcrypt.genSalt(saltRound, (err, salt) => {
    if (!user.STUDENT_NUM_PK || !user.PW) {
      console.log("invalid data");
      return res.status(400).send('유효하지 못한 데이터');
    }
    else if (err) {
      console.log(err);
    }
    bcrypt.hash(user.PW, salt, (err, hash) => {
      if (err) {
        throw err;
        console.log(err);
      }
      user.PW = hash;
      db.query('INSERT INTO USER_TB SET ?', user, (err, result) => {
        // 에러
        if (err) {
          console.log('Data insert error: ' + err);
          return res.status(400).json({success: false, message: '회원가입 실패'});
        }
        // 성공
        console.log('New User Data inserted: ' + result);
        return res.status(200).json({success: true, message: '회원가입 성공! 로그인이 가능합니다!'});
      });
    });
  });
});

// 세션변수 생성
router.get('/', (req, res) => {
  sess = req.session;
  return res.json(sess);
});

// 로그인
router.post('/login', (req, res) => {
  const studentNumber = req.body.studentNumber;
  const password = req.body.password;

  db.query("SELECT * FROM user_tb WHERE STUDENT_NUM_PK = ?", studentNumber, (err, result) => {
    if (err) throw err;
    if (result[0]) {
      // Load hash from your password DB.
      if (bcrypt.compareSync(password, result[0].PW)) {
        sess = req.session;
        sess.info = {
          userName: result[0].USER_NM,
          studentNumber: result[0].STUDENT_NUM_PK,
          phoneNum: result[0].PHONE_NUM,
          majorName: result[0].MAJOR_NM,
          email: result[0].EMAIL,
          imgUrl: result[0].PROFILE_IMG_URL
        };
        console.log("login: " + sess.info);
        res.json({success: true, info: sess.info});
      } else {
        console.log("wrong password!");
         res.status(400).json({success: false, error: 'wrong password'});
      }
    } else {
      console.log("error occured");
       res.status(400).json({success: false, error: 'no user data'});
    }
  });
});

// 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy();
  console.log("logout success");
  return res.status(200).json({success: true});
});

module.exports = router;
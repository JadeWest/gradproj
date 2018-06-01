const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/database');
const moment = require('moment');

const router = express.Router();

moment().format();
let myDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

// 학생 포트폴리오 리스트 검색
router.get('/getPortfolioList/:studentNumber', (req, res) => {
  const studentNumber = req.params.studentNumber;

  if (!studentNumber) {
    console.log('학번이 없습니다!');
    return res.status(400).json({success: false, msg: '검색실패'});
  }
  db.query('SELECT * FROM PORTFOLIO_TB WHERE STUDENT_NUM_PK=?', studentNumber, (err, result) => {
    if (err) {
      console.log('학생 포트폴리오 리스트 DB에러: ' + err);
      return res.status(400).json({success: false, msg: '포트폴리오를 찾지 못했습니다.'});
    }
    console.log('학생 포트폴리오 DB로 부터 검색완료 result: ' + result);
    return res.status(200).json({result: result});
  });
})

// 특정 포트폴리오 상세 검색
router.get('/getPortfolioDetail/:portfolioId', (req, res) => {
  const studentNumber = req.body.studentNumber;
  const projectTitle = req.body.projectTitle;
  const portfolioId = req.param.portfolioId;
  
  const data = [studentNumber, projectTitle, portfolioId];

  if(!studentNumber || !projectTitle || !portfolioId) {
    console.log('포트폴리오 상세조회를 위한 데이터가 부족합니다.');
    return res.status(400).json({success: false, msg: '포트폴리오 상세검색 실패!'});
  }
  db.query('SELECT * FROM portfolio_tb where STUDENT_NUM_PK=?, PROJECT_TITLE_NM=?, PORTFOLIO_ID=?', data, (err, result) => {
    if (err) {
      console.log('DB 에러발생: ' + err);
      return res.status(400).json({success: false, msg: '특정 포트폴리오 조회실패 에러발생'});
    }
    console.log('특정 포트폴리오 상세 조회 성공 result: ' + result);
  })
})

// 포트폴리오 생성
router.post('/addPortfolio', (req, res) => {
  const portfolio = {
    PROJECT_TITLE_NM: req.body.projectTitle,  // notnull
    PROJECT_TERM_DT: req.body.projectTerm,  // notnull
    TASK: req.body.task,
    PORTFOLIO_INTRO:  req.body.intro,
    IMG_URL_1:  req.body.imgUrl1,
    IMG_URL_2:  req.body.imgUrl2,
    IMG_URL_3:  req.body.imgUrl3,
    CREATE_DT: myDate,  // notnull
    STUDENT_NUM_PK: req.body.studentNumber  // notnull
  };
  
  console.log(portfolio);

  if (!portfolio.PROJECT_TITLE_NM || !portfolio.PROJECT_TERM_DT || !portfolio.STUDENT_NUM_PK) {
    console.log('데이터에 null이 있습니다.');
    return res.status(400).json({success: false, msg: '입력하지 않은 데이터가 있습니다.'});
  }

  db.query('INSERT INTO PORTFOLIO_TB SET ?', portfolio, (err, result) => {
    if (err) {
      console.log('db.query error에서 에러발생!: ');
      console.log(err);
      return res.status(400).json({success: false, msg: '포트폴리오 생성실패.'});
    }
    console.log('portfolio data INSERT 성공');
    console.log(result);
    return res.status(200).json({success: true, msg: '포트폴리오 생성완료!'});
  });
});

// 특정 포트폴리오 수정
router.put('/updatePortfolio', (req, res) => {
  const portfolioId = req.body.portfolioId;
  const portfolio = {
    PROJECT_TITLE_NM: req.body.projectTitle,  // notnull
    PORJECT_TERM_DT: req.body.projectTerm,  // notnull
    TASK: req.body.task,
    PORTFOLIO_INTRO:  req.body.intro,
    IMG_URL_1:  req.body.imgUrl1,
    IMG_URL_2:  req.body.imgUrl2,
    IMG_URL_3:  req.body.imgUrl3,
    MODIFY_DT: myDate,  // notnull
  };

  const data = [portfolio, portfolioId];
  console.log('요청한 portfolio 데이터: ' + portfolio);
  db.query('UPDATE portfolio_tb SET ? WHERE PORTFOLIO_ID=?', data, (err, result) => {
    if (err) {
      console.log('DB 에러 발생: ' + err);
      return res.status(400).json({success: false, msg: '에러가 발생했습니다!'});
    }
    console.log('DB update성공! result: ' + result);
    return res.status(200).json({success: true, msg: '포트폴리오 수정 성공!'});
  });
});

// 포트폴리오 삭제
router.delete('/deletePortfolio/:portfolioId', (req, res) => {
  const portfolioId = req.param.portfolioId;

  db.query('DELETE FROM USER_TB WHERE PORTFOLIO_ID=?', portfolioId, (err, result) => {
    if (err) {
      console.log('DB 에러 발생: ' + err);
      return res.status(400).json({success: false, msg: '에러가 발생하여 포트폴리오를 삭제하지 못했습니다.'});
    }
    console.log('포트폴리오 삭제 성공: ' + result);
    return res.status(200).json({success: true, msg: '포트폴리오를 삭제하는데 성공했습니다.'});
  });
});

module.exports = router;
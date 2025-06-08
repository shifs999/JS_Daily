const express = require("express");

const { GenerateNewShortURL, GetAnalytics } = require("../controllers/url");
const router = express.Router();

router.post('/', GenerateNewShortURL)

router.get('analytics/:shortId', GetAnalytics)

module.exports = router;
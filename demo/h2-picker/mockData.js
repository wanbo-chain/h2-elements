import {banks, companies} from "./data.js";

MockDataPool.when("POST", "/init.do")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(banks)
  });

MockDataPool.when("GET", "/query.do")
  .responseWith({
    status: 200, body: JSON.stringify(companies)
  });

MockDataPool.when("POST", "/more_banks.do")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200, body: JSON.stringify(companies)
  });
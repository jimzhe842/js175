const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;
const HANDLEBARS = require('handlebars');

const APR = 0.05;

const SOURCE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 1.5rem;
      }
      th {
        text-align: right;
      }
      td {
        text-align: center;
      }
      th,
      td {
        padding: 0.5rem;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>
          <tr>
            <th>Amount:</th>
            <td>
              <a href='/?amount={{amountDecrement}}&duration={{duration}}'>- $100</a>
            </td>
            <td>$ {{amount}}</td>
            <td>
              <a href='/?amount={{amountIncrement}}&duration={{duration}}'>+ $100</a>
            </td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>
              <a href='/?amount={{amount}}&duration={{durationDecrement}}'>- 1 year</a>
            </td>
            <td>{{duration}} years</td>
            <td>
              <a href='/?amount={{amount}}&duration={{durationIncrement}}'>+ 1 year</a>
            </td>
          </tr>
          <tr>
            <th>APR:</th>
            <td colspan='3'>{{apr}}%</td>
          </tr>
          <tr>
            <th>Monthly payment:</th>
            <td colspan='3'>$ {{payment}}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </body>
</html>
`;

const LOAN_OFFER_TEMPLATE = HANDLEBARS.compile(SOURCE);

function render(template, data) {
  let html = template(data);
  return html;
};

const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
  </head>
  <style type="text/css">
    body {
      background: rgba(250, 250, 250);
      font-family: sans-serif;
      color: rgb(50, 50, 50);
    }

    article {
      width: 100%;
      max-width: 40rem;
      margin: 0 auto;
      padding: 1rem 2rem;
    }

    h1 {
      font-size: 2.5rem;
      text-align: center;
    }

    table {
      font-size: 2rem;
    }

    th {
      text-align: right;
    }
  </style>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `
        </tbody>
      </table>
    </article>
  </body>
</html>`;

function getParams(url) {
  let params = new URL(url, `http://localhost:${PORT}`).searchParams;
  return params;
}

function calculateMonthly(amount, duration) {
  let durationInMonths = duration * 12;
  let monthlyAPR = APR / 12;
  let monthly = amount * (monthlyAPR / (1 - Math.pow((1 + monthlyAPR), (-durationInMonths))));
  return monthly;
}

function createLoan(params) {
  let data = {};
  data.amount = Number(params.get('amount'));
  data.amountIncrement = data.amount + 100;
  data.amountDecrement = data.amount - 100;
  data.duration = Number(params.get('duration'));
  data.durationIncrement = data.duration + 1;
  data.durationDecrement = data.duration - 1;
  data.payment = calculateMonthly(data.amount, data.duration).toFixed(2);

  return data;
  // let body = `Amount: ${amount}\nDuration: ${duration} years\nAPR: ${APR * 100}%\nMonthly Payment: $${monthly.toFixed(2)}`;
  // const HTML_TABLE = `
  //         <tr>
  //           <th>Amount:</th>
  //           <td>
  //             <a href='/?amount=${amount - 100}&duration=${duration}'>- $100</a>
  //           </td>
  //           <td>$${amount}</td>
  //         </tr>
  //         <td>
  //           <a href='/?amount=${amount + 100}&duration=${duration}'>+ $100</a>
  //         </td>
  //         <tr>
  //           <th>Duration:</th>
  //           <td>
  //             <a href='/?amount=${amount}&duration=${duration - 1}'>- 1 year</a>
  //           </td>
  //           <td>${duration} years</td>
  //           <td>
  //             <a href='/?amount=${amount}&duration=${duration + 1}'>+ 1 year</a>
  //           </td>
  //         </tr>
  //         <tr>
  //           <th>APR:</th>
  //           <td colspan='3'>${APR * 100}%</td>
  //         </tr>
  //         <tr>
  //           <th>Monthly payment:</th>
  //           <td colspan='3'>$${monthly.toFixed(2)}</td>
  //         </tr>`
  // return `${HTML_START}\n${HTML_TABLE}\n${HTML_END}`;
  
}



const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;
  if (path === 'favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    let params = getParams(path);
    let data = createLoan(params);
    let content = render(LOAN_OFFER_TEMPLATE, data);
    // amount; // duration;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(content);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
})
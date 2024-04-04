const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Validator = require('validatorjs');
const Router = require('koa-router'); 
const app = new Koa();
const router = new Router(); 

app.use(bodyParser());

const validationRules = {
  name: 'required|string',
  email: 'required|email',
  age: 'required|numeric',
};

const validateRequest = async (ctx, next) => {
  const data = ctx.request.body;
  console.log("request body: ", data);
  const validation = new Validator(data, validationRules);

  if (validation.passes()) {
    await next();
  } else {
    ctx.response.status = 400;
    console.log("status: ", ctx.response.status);
    ctx.body = { message: 'Validation failed',
         errors: validation.errors.all() };
  }
};


router.post('/submit-data', validateRequest, async (ctx) => {
  ctx.status = 200;
  console.log("status: ", ctx.status);
  ctx.body = { message: 'Data received successfully' };
});


app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

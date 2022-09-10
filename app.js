const PORT = process.env.PORT || 8080

const BackEndFramework = require('./src/Framework')
const Router = require('./middleware/router-middleware')

const baseData = require('./middleware/base-data')
const jsonBodyParser = require('./middleware/json-body-parser')

const app = new BackEndFramework()
const router = new Router()

app.use(baseData)
app.use(jsonBodyParser)

router.get('/get-message', (ctx) => {
	ctx.body = { message: 'Hello There' }
})



router.get('/get-message/{id}/{di}', (ctx) => {
	ctx.body = { params: ctx.params }
})

router.post('/post', (ctx) => {
	ctx.status = 201
	ctx.body = { message: ctx.reqBody }
})

router.get('/get-nothing', () => {})

router.get('/get-params', (ctx) => {
	ctx.body = ctx.query
})

app.use(router.Middleware())

app.listen(PORT, () => console.log('Server has been started on port', PORT))

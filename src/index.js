import app from './app'
import {Home,storeUser} from './controllers/data.controller'
const { isLoggedIn, isNotLoggedIn }= require('./controllers/auth');
app.listen(app.get('port'))
console.log('Server on port', app.get('port'))

app.get('/', isNotLoggedIn,Home);


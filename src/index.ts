
import morgan from 'morgan'
import cors  from 'cors'
import dotenv  from 'dotenv'
import express,{Express, Router} from 'express'
import { DMVRouter } from './routes';

class Server
{
    app: Express;
    router: Router;
    constructor()
    {
        this.app = express();
        this.router = Router();
        this.configs();
        this.middlewares();
        this.routes();
        this.listen();
    }
    configs(){
      dotenv.config();
      this.app.set('port', 3000);
      this.app.set('json spaces', 2);
    }
    middlewares(){
      this.app.use(morgan('dev'));
      this.app.use(cors());
      this.app.use(express.urlencoded({extended:true}));
      this.app.use(express.json());
    }
    routes(){
      this.app.use("/v1/dmv-api/",new DMVRouter(this.router).router);
    }
    listen()
    {
      this.app.listen(this.app.get('port'),()=>{
        console.log(`Server listening on port ${this.app.get('port')}`);
      });
    }
}
new Server();
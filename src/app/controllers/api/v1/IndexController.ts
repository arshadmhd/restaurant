import {NextFunction, Request, Response} from "express";
import {Controller, Get, JsonController, OnUndefined, Req, Res,} from "routing-controllers";

@Controller()
class IndexController {

    @Get("/*")
    async serveMainPage (@Req() req: Request, @Res() res: Response, next: NextFunction) {
        res.render( "index", { "title": "Express" } );
    }
}
export default IndexController;

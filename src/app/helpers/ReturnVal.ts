export default class ReturnVal {

    success: boolean;
    message: string;
    returnVal: any;

    constructor (success: boolean, message: string, returnVal?: any) {
        this.success = success;
        this.message = message;
        this.returnVal = returnVal;
    }

    static create (success: boolean, message: string, returnVal?:any){
        return new ReturnVal(success, message, returnVal);
    }
}

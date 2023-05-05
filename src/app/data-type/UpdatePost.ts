import {Doc} from "./Doc";
import {User} from "./User";

export class UpdatePost{
  id! : number;
  title: string ="";
  mushroomType:string = "";
  latitude! : number;
  longitude!: number;
  description : string = "";
  base64Img : string ="";
  attachments : Doc[] =[];
  userId : number = -1;
  type: string = "";

}

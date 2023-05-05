import {Doc} from "./Doc";
import {User} from "./User";

export class Post {
  id! : number;
  title: string ="";
  mushroomType:string = "";
  latitude! : number;
  longitude!: number;
  description : string = "";
  base64Img : string ="";
  date: string ="";
  time: string ="";
  attachments : Doc[] =[];
  userId : number = -1;
  type: string = "";

}

import {Doc} from "./Doc";

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
  docs : Doc[] =[];
  userId! : number;
  type: string = "";

}

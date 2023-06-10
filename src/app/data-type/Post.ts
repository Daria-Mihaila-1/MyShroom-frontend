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

  userId : number = -1;
  type: string = "";

}

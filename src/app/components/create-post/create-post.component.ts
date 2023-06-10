import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PostService} from "../../services/post.service";
import {Post} from "../../data-type/Post";
import {UploadPost} from "../../data-type/UploadPost";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UpdatePost} from "../../data-type/UpdatePost";


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  location : google.maps.LatLng | undefined;
  lat = 45.84390812570921
  lng = 24.971530777243718
  center = new google.maps.LatLng(this.lat,this.lng)
  zoom = 6.5
  userId : number = -1;
  ROMANIA_BOUNDS = {
    north: 48.46723046062661,
    south: 43.306942557261806,
    west: 19.987220959549834,
    east: 30.00675167516294,
  };
  myOptions: google.maps.MapOptions = {
    center :{lat:this.lat,lng:this.lng},
    zoom : this.zoom,
    restriction:{latLngBounds:this.ROMANIA_BOUNDS,  strictBounds: true},
    fullscreenControl:false,

  };
  types: string[] | undefined;
  mushroomTypes: string[] | undefined;

  createPostFormGroup = this.formbuilder.group(
    {
      postTitle:['', Validators.required],
      genus : '',
      description:['', Validators.required],
      type: ''
    })
   currentImg: File | undefined;
  base64Img :string = '';
  buttonText : string ="Post";
  dialogTitle: string;
  constructor(private formbuilder: FormBuilder,
              private snackbar : MatSnackBar,
              private postService : PostService,
              public dialogRef: MatDialogRef<CreatePostComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {post:Post}) {

    this.postService.getPostTypes().subscribe(result1 => {
      this.types = result1;
      // Boolean expression? First statement : second statement
      this.types = this.types!.map(value => value.indexOf("_") != -1?
        value.split("_")[0].charAt(0) + value.split("_")[0].substring(1, value.indexOf("_")).toLowerCase()+" " +value.split("_")[1].charAt(0) +value.split("_")[1].substring(1) .toLowerCase()
        :
        value.charAt(0) + value.substring(1).toLowerCase())


    })

    this.postService.getMushroomTypes().subscribe(result2 => {
      this.mushroomTypes = result2;
      this.mushroomTypes = this.mushroomTypes!.map(value => value.charAt(0) + value.substring(1).toLowerCase())

    })

    if (this.data) {
      const existingPost = this.data.post;
      this.buttonText = "Update Post"
      this.dialogTitle = "Update your Post"
      this.initializeForm(existingPost)
    }
    else {
      this.dialogTitle = "Create your own Post"

    }
    if (localStorage.getItem('user'))
    {
      this.userId = parseInt(localStorage.getItem('user')!)
      console.log(this.userId)
    }
  }

  initializeForm(post : Post) {

    this.createPostFormGroup.setValue(
      {
        postTitle: post.title!,
        genus: post.mushroomType!,
        description: post.description!,
        type: post.type!
      }
    )
    this.location = new google.maps.LatLng({lat:post.latitude, lng:post.longitude})

    let content_type = "data:image/jpg;base64"
    this.base64Img = post.base64Img
    const reader = new FileReader();
    let blob = this.base64toBlob(this.base64Img, content_type);
    reader.onload = (e: any) => {
      //will be base64 encoded string of File object
      this.base64Img = e.target.result;
    };

    this.currentImg = new File([blob], "currentImg")

    reader.readAsDataURL(this.currentImg);

  }

  private base64toBlob(base64Data : string, contentType: string): Blob {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }
  validateForm()
  {
    const valuesFromForm = this.createPostFormGroup.value;
    let errors : string = "";
    console.log(this.location)
    if ( (valuesFromForm.postTitle=="" || valuesFromForm.postTitle==null) ||
      (valuesFromForm.description=="" || valuesFromForm.description==null) ||
      (valuesFromForm.genus=="" || valuesFromForm.genus==null) ||
      (valuesFromForm.type=="" || valuesFromForm.type==null))
    {
      errors += "All fields need to be completed\n";
    }
    if (this.location == undefined) {
      errors += "\nA location must be chosen on the map for your post!"
    }
    if (this.base64Img == '') {
      errors+="\nA picture must be uploaded!"
    }
    return errors;

  }
  createOrUpdatePost() {

    const valuesFromForm= this.createPostFormGroup.value;
    let errors= this.validateForm();

    let post_type = ""
    if(valuesFromForm.type?.indexOf(" ") != -1) {
      post_type = valuesFromForm.type?.split(" ")[0].toUpperCase() +"_" + valuesFromForm.type?.split(" ")[1].toUpperCase()
    }
    else {
      post_type = valuesFromForm.type!.toUpperCase()
    }
    console.log(valuesFromForm.genus!.toUpperCase())
    if(errors=="")
    {

      if (this.data){

        const newPost: UpdatePost=
          {
            id : this.data.post!.id,
            title: valuesFromForm.postTitle!,
            mushroomType: valuesFromForm.genus!.toUpperCase(),
            latitude: this.location!.lat(),
            longitude: this.location!.lng(),
            description: valuesFromForm.description!,
            base64Img: this.base64Img.split(",")[1],
            type: post_type,
            userId: parseInt(localStorage.getItem('user')!)

          };

        this.postService.updatePost(newPost).subscribe(result =>
        {
          this.createPostFormGroup.reset();
          this.location = undefined
          this.base64Img = '';
          this.currentImg = undefined;
          this.dialogRef.close(result);
        })
      }
      else {
        const newPost: UploadPost=
          {
            base64Img: this.base64Img.split(",")[1],
            description: valuesFromForm.description!,
            latitude: this.location!.lat(),
            longitude: this.location!.lng(),
            mushroomType: valuesFromForm.genus!.toUpperCase(),
            type: post_type,
            userId: parseInt(localStorage.getItem('user')!),
            title: valuesFromForm.postTitle!

          };
        this.postService.createPost(newPost).subscribe(result => {
          this.createPostFormGroup.reset();
          this.location = undefined
          this.base64Img = '';
          this.currentImg = undefined;
          this.dialogRef.close(result);
        })

      }

    }
    else {
      this.snackbar.open(errors, "Ok", {verticalPosition:"top"})
    }
  }

  setLocation($event: google.maps.MapMouseEvent) {

    if ($event.latLng){
    let selectedLocation = $event.latLng


      if (selectedLocation.lng() <= this.ROMANIA_BOUNDS.east &&
      selectedLocation.lng() >= this.ROMANIA_BOUNDS.west &&
      selectedLocation.lat() <= this.ROMANIA_BOUNDS.north &&
      selectedLocation.lat() >= this.ROMANIA_BOUNDS.south
    ) {
      console.log($event, "\n", $event.latLng)
      this.location = new google.maps.LatLng($event.latLng)
    }
    else {
        this.snackbar.open("You chose a location outside the bounds of Romania \n keep it inside the borders", "Ok", {verticalPosition:"top"})
    }
  }
}
  selectFile(event: any): void {


    console.log("la inceput de selectFile")


    this.currentImg = event.addedFiles[0];

    if (this.currentImg) {

      this.base64Img = '';

      const reader = new FileReader();

      reader.onload = (e: any) => {

        //will be base64 encoded string of File object
        this.base64Img = e.target.result;
      };

      reader.readAsDataURL(this.currentImg);
    }
  }


  onRemove(event: any) {
    console.log(this.currentImg)
    this.currentImg = undefined;
    this.base64Img = ''
  }

  clearForm() {
    this.createPostFormGroup.reset()
  }
}

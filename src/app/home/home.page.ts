import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  public items: any;
  public image: any;
  public picture: any;
  public web: boolean = false;
  public loading: boolean = false;
  public user: any = false;

  constructor(private afAuth: AngularFireAuth, private router: Router, private storage: AngularFireStorage, private db: AngularFirestore, public platform: Platform, private camera: Camera) { 
    this.items = [];
  }

  ngOnInit(){
    this.items = this.db.collection('items').valueChanges();

    if (!this.platform.is('cordova')){
      this.web = true;
    }

    let me = this;
    this.afAuth.auth.onAuthStateChanged(function(userObj) {
      if (userObj) {
        me.user = userObj;
        // User is signed in.
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
      } else {
        me.user = false;
      }
    });
  }
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  viewPicture(item){
    this.router.navigate(['/image', { src: item.src }]);
  }

  deletePicture(item){

    const searchPicture = this.db.collection('items', ref => ref.where('id', '==', item.id).limit(1)).get();
    searchPicture.subscribe(querySnapshot => {
      querySnapshot.forEach(deleteItem => {
        deleteItem.ref.delete().then(() => {
          // Create a reference to the file to delete
          const fileRef = this.storage.ref('/').child(item.fileName);
          // Delete the file
          fileRef.delete().subscribe(() => {
            // File deleted successfully
          });
        })
      });
    });

    return false;
  }

  getPictureWeb(event){
    this.showHideLoading();
    let arquivo = event.srcElement.files[0];
    this.uploadFile(arquivo);
  }

  getPicture(){
    this.showHideLoading();
    
    if (this.platform.is('cordova')) {

      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetHeight: 1024,
        targetWidth: 1024
      }
      
      this.camera.getPicture(options).then((image) => {
        this.uploadFile(this.dataURItoBlob(image));
      }, (error) => {
        console.error("Error: ", error);
      });

    }

  }

  uploadFile(selectedPhoto) {

    let id = this.db.createId();
    let fileName = 'images/'+id+'.png';
    const ref = this.storage.ref(fileName);

    ref.put(selectedPhoto).then((snapshot)=>{
      window['snapshot'] = snapshot.ref;
      snapshot.ref.getDownloadURL().then((url)=>{
        this.saveData(id, fileName, url);
      });
    }, (error)=>{
      this.showHideLoading();
      console.log('Upload FAIL!', error);
    });

  }

  saveData(id, fileName, url){

    let me = this;

    this.db.collection("items").add({
        id: id,
        src: url,
        fileName: fileName
    })
    .then(function(result) {
        //console.log("Document successfully written!", result);
        me.showHideLoading();
    })
    .catch(function(error) {
        //console.error("Error writing document: ", error);
        me.showHideLoading();
    });

  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  showHideLoading(){
    this.loading = !this.loading;
  }

}
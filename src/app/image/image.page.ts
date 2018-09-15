import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  public src: string = '';

  constructor(
    private router: ActivatedRoute, 
    private statusBar: StatusBar
    ) { }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.statusBar.styleLightContent();
    this.src = this.router.snapshot.paramMap.get('src');
  }

  goBack(){
    history.go(-1);
  }

}

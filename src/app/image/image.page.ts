import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  public src: string = '';

  constructor(private router: ActivatedRoute, ) { }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.src = this.router.snapshot.paramMap.get('src');
  }

  goBack(){
    history.go(-1);
  }

}

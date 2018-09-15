import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private splashScreen: SplashScreen,
    private platform: Platform,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault(); 
      //this.statusBar.backgroundColorByHexString('#FFFFFF';
      //this.statusBar.styleBlackOpaque();    
      //this.statusBar.show();
      this.splashScreen.hide();
    });
  }
}

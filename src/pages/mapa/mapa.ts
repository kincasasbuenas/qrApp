import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  lat: number ;
  lng: number ;

  constructor(public navCtrl: NavController, 
              private viewCtrl:ViewController,
              public navParams: NavParams) {
    // this.lat=11.0163374;
    // this.lng=-74.8307705;

    let coordsArray = this.navParams.get("coords").split(",");
    this.lat = Number (coordsArray[0].replace("geo:","") );
    this.lng = Number ( coordsArray[1] );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
  }

  closed(){
    this.viewCtrl.dismiss();
  }
}

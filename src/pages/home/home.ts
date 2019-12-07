import { Component } from '@angular/core';
import { NavController, ToastController, Platform} from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HistorialProvider} from '../../providers/historial/historial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, 
              public toastCtrl: ToastController,
              private platform:Platform,
              private barcodeScanner: BarcodeScanner,
              private _historialService:HistorialProvider) {

  }

  scannear(){
    
    if (!this.platform.is('cordova')) {
      this._historialService.agregar_historial('http://www.google.com.co/');
      return;
    }

    this.barcodeScanner.scan().then(barcodeData => {

      console.log('Barcode data', barcodeData);
      console.log('Result', barcodeData.text);
      console.log('Format', barcodeData.format);
      console.log('Cancelled', barcodeData.cancelled);

      if ( barcodeData.cancelled == false && barcodeData.text != null) {
          this._historialService.agregar_historial(barcodeData.text);
      }

     }).catch(err => {
         console.log('Error', err);
         this.showError("Error: "+ err);
     });
  }

  showError( mensaje:string) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'middle'
    });
    toast.present();
  }

}

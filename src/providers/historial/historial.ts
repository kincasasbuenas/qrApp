import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScanData } from '../../models/scan-data.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { ModalController, Platform, ToastController } from 'ionic-angular';
import { MapaPage } from '../../pages/mapa/mapa';
/*
  Generated class for the HistorialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HistorialProvider {

  private _historial:ScanData [] = [];

  constructor(public http: HttpClientModule,
              private iab: InAppBrowser,
              private contacts: Contacts,
              private platform: Platform,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController) {
    console.log('Hello HistorialProvider Provider');
  }

  cargar_historial(){
    return this._historial;
  }

  agregar_historial( texto:string){
    let data = new ScanData( texto );
    this._historial.unshift(data);
    console.log(this._historial);
    this.abrir_scan(0);
  }

  abrir_scan(index:number) {
    let scan=this._historial[index];
    console.log(scan);
    switch (scan.tipo) {
      case 'http':
        this.iab.create(scan.info, '_system');
        break;
      case 'mapa':
        this.modalCtrl.create(MapaPage, { coords: scan.info }).present();
        break;
      case 'contacto':
        this.crear_contacto(scan.info);
      break;
      case 'email':
        let htmlLink = scan.info;
        htmlLink =  htmlLink.replace('MATMSG:TO','mailto:');
        htmlLink =  htmlLink.replace(';SUB','?subject=');
        htmlLink =  htmlLink.replace(';BODY','&body=');
        htmlLink =  htmlLink.replace(';;','');
        htmlLink =  htmlLink.replace(/ /g,'%20');

        this.iab.create(htmlLink,'_system');

      break;

      default:
        console.error('tipo no soportado');
        break;
    }
  }

  private crear_contacto( texto:string ){
    let campos:any = this.parse_vcard(texto);
    let nombre = campos['fn'];
    let cel = campos.tel[0].value[0];

    if (!this.platform.is('cordova')) {
      console.warn('no puedo crear contacto desde la computadora');
      return;
    }

    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, nombre);
    contact.phoneNumbers = [new ContactField('mobile', cel)];

    contact.save.then(
      ()=> this.show_toast('Contacto'+ nombre + 'creado!'), 
      (error)=> this.show_toast('Error' + error)
       );
  }

  private show_toast(mensaje:string){
    this.toastCtrl.create({
      message:mensaje,
      duration: 2500
    }).present();
  }

  private parse_vcard( input:string ) {

      var Re1 = /^(version|fn|title|org):(.+)$/i;
      var Re2 = /^([^:;]+);([^:]+):(.+)$/;
      var ReKey = /item\d{1,2}\./;
      var fields = {};

      input.split(/\r\n|\r|\n/).forEach(function (line) {
          var results, key;

          if (Re1.test(line)) {
              results = line.match(Re1);
              key = results[1].toLowerCase();
              fields[key] = results[2];
          } else if (Re2.test(line)) {
              results = line.match(Re2);
              key = results[1].replace(ReKey, '').toLowerCase();

              var meta = {};
              results[2].split(';')
                  .map(function (p, i) {
                  var match = p.match(/([a-z]+)=(.*)/i);
                  if (match) {
                      return [match[1], match[2]];
                  } else {
                      return ["TYPE" + (i === 0 ? "" : i), p];
                  }
              })
                  .forEach(function (p) {
                  meta[p[0]] = p[1];
              });

              if (!fields[key]) fields[key] = [];

              fields[key].push({
                  meta: meta,
                  value: results[3].split(';')
              })
          }
      });

      return fields;
  }
}

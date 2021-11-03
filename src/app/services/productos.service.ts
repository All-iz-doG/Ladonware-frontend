import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  API_ENDPOINT = 'http://ladonware.lndo.site/api';

  constructor(private http: HttpClient) { }
  save(productos: Producto){
    const header = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post(this.API_ENDPOINT + '/productos', productos, {headers: header})
  }

  delete(id: number){
    return this.http.delete(this.API_ENDPOINT + '/productos/' + id);
  }

  update(productos: Producto){
    const header = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.put(this.API_ENDPOINT + '/productos/' + productos.id, productos, {headers: header})
  }
}

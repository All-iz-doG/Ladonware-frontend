import { Component, HostListener, ViewChild } from '@angular/core';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { ProductosService } from 'src/app/services/productos.service';
import { HttpClient } from '@angular/common/http';
import { Producto } from 'src/app/interfaces/producto';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss']
})

export class SearchTableComponent {
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  headElements = ['Nombre', 'Categoria', 'Precio', 'Cantdidad', 'Inventario', 'Accion'];
  searchText: string = '';
  previous: string = '';
  producto: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    cantidad: 0,
    imagen: "assets/img/image-not-found.png"
  };
  @ViewChild('basicModal', { static: true }) modal: ModalDirective;

  API_ENDPOINT = 'http://ladonware.lndo.site/api';
  constructor(private productosService: ProductosService, public http: HttpClient) {

  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    this.http.get(this.API_ENDPOINT + '/productos').subscribe((data: any) => {
      for (let i = 0; i <= data.length; i++) {
        if (data[i].cantidad == 0) {
          this.elements.push({
            id: data[i].id.toString(),
            nombre: data[i].nombre,
            descripcion: data[i].descripcion,
            categoria: data[i].categoria,
            precio: data[i].precio,
            cantidad: data[i].cantidad,
            imagen: data[i].imagen,
            inventario: 'Agotado',
            class: 'text-danger'
          });
        }
        else if (data[i].cantidad > 9) {
          this.elements.push({
            id: data[i].id.toString(),
            nombre: data[i].nombre,
            descripcion: data[i].descripcion,
            categoria: data[i].categoria,
            precio: data[i].precio,
            cantidad: data[i].cantidad,
            imagen: data[i].imagen,
            inventario: 'En Stock',
            class: 'text-success'
          });
        }
        else {
          this.elements.push({
            id: data[i].id.toString(),
            nombre: data[i].nombre,
            descripcion: data[i].descripcion,
            categoria: data[i].categoria,
            precio: data[i].precio,
            cantidad: data[i].cantidad,
            imagen: data[i].imagen,
            inventario: 'Limitado',
            class: 'text-warning'
          });
        }

      }
    });
    this.mdbTable.setDataSource(this.elements);
    this.previous = this.mdbTable.getDataSource();
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['id', 'nombre']);
      this.mdbTable.setDataSource(prev);
    }
  }

  addProduct() {
    if (this.producto.id == 0) {
      this.productosService.save(this.producto).subscribe((data: any) => {
        alert('Producto agregado');
        if (data.cantidad == 0) {
          this.elements.push({
            id: data.id.toString(),
            nombre: data.nombre,
            descripcion: data.descripcion,
            categoria: data.categoria,
            precio: data.precio,
            cantidad: data.cantidad,
            imagen: data.imagen,
            inventario: 'Agotado',
            class: 'text-danger'
          });
        }
        else if (data.cantidad > 9) {
          this.elements.push({
            id: data.id.toString(),
            nombre: data.nombre,
            descripcion: data.descripcion,
            categoria: data.categoria,
            precio: data.precio,
            cantidad: data.cantidad,
            imagen: data.imagen,
            inventario: 'En Stock',
            class: 'text-success'
          });
        }
        else {
          this.elements.push({
            id: data.id.toString(),
            nombre: data.nombre,
            descripcion: data.descripcion,
            categoria: data.categoria,
            precio: data.precio,
            cantidad: data.cantidad,
            imagen: data.imagen,
            inventario: 'Limitado',
            class: 'text-warning'
          });
        }
        this.initModal();
        this.modal.hide();

      }, error => {
        alert('Error al agregar el producto');
        console.log(error);
      });
    } else if (this.producto) {
      this.productosService.update(this.producto).subscribe((data: any) => {
        alert('Producto Actualizado')
        this.initModal();
        this.modal.hide();
        window.location.reload();
      }, error => {
        alert('Error al actualizar el producto');
        console.log(error);
      });
    }
    this.mdbTable.setDataSource(this.elements);
    this.previous = this.mdbTable.getDataSource();
  }

  initModal(){
    this.producto.id = 0;
    this.producto.nombre = '';
    this.producto.descripcion = '';
    this.producto.categoria = '';
    this.producto.precio = 0;
    this.producto.cantidad = 0;
    this.producto.imagen = "assets/img/image-not-found.png";
  }

  deleteProduct(id: number) {
    if (confirm('¿Esta seguro de eliminar el producto?')) {
      this.productosService.delete(id).subscribe((data: any) => {
        alert('Producto eliminado');
        delete this.elements[id];
        window.location.reload();
      }, error => {
        alert('Error al eliminar el producto');
        console.log(error);
      });
    } else {
      alert('Producto no eliminado');
    }
  }

  updateProduct(producto: Producto) {
    this.producto = producto;
    this.modal.show();
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { startWith, tap } from 'rxjs/operators';
// import countries from '../../../data.json';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
export interface PeriodicElement {
  name: string;
  id: number;
  state: string;
  zip: string;
  amount: string;
  qty: string;
  item: string;
}

// public ELEMENT_DATA:{name: string,id: number,weight: number,symbol: string}[] = countries;
// const ELEMENT_DATA: PeriodicElement[] = countries;

// const ELEMENT_DATA: PeriodicElement[] = [
//   {"id": 1, "name": 'Hydrogen', "weight": 1.0079, "symbol": 'H'},
//   {"id": 2, "name": 'Helium', "weight": 4.0026, "symbol": 'He'},
//   {"id": 3, "name": 'Lithium', "weight": 6.941, "symbol": 'Li'},
//   {"id": 4, "name": 'Beryllium', "weight": 9.0122, "symbol": 'Be'},
//   {"id": 5, "name": 'Boron', "weight": 10.811, "symbol": 'B'},
//   {"id": 6, "name": 'Carbon', "weight": 12.0107, "symbol": 'C'},
//   {"id": 7, "name": 'Nitrogen', "weight": 14.0067, "symbol": 'N'},
//   {"id": 8, "name": 'Oxygen', 'weight': 15.9994, "symbol": 'O'},
//   {"id": 9, "name": 'Fluorine', 'weight': 18.9984, 'symbol': 'F'},
//   {"id": 10, "name": 'Neon', "weight": 20.1797, "symbol": 'Ne'},
//   {"id": 11, "name": 'Neon', "weight": 20.1797, "symbol": 'Ne'},
// ];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-basic-example',
  templateUrl: './table-basic-example.component.html',
  styleUrls: ['./table-basic-example.component.css']
})
export class TableBasicExampleComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'state', 'zip', 'amount','qty','item','action'];
  dataSource = new MatTableDataSource<any>();
 
 isLoading = true;
  countries:any;
 
 pageNumber: number = 1;
   VOForm: FormGroup;
   isEditableNew: boolean = true;
   constructor(
     private fb: FormBuilder,
     private http: HttpClient,
     private _formBuilder: FormBuilder){}
 
   ngOnInit(): void {
    this.http.get<any>('http://localhost/csv/').subscribe(data => {
      console.log("data= ",data)
           this.countries = data;
   
     this.VOForm = this._formBuilder.group({
       VORows: this._formBuilder.array([])
     });
 
      this.VOForm = this.fb.group({
               VORows: this.fb.array(this.countries.map(val => this.fb.group({
                 id: new FormControl(val.id),
                 name: new FormControl(val.name),
                 state: new FormControl(val.state),
                 zip: new FormControl(val.zip),
                 amount: new FormControl(val.amount),
                 qty: new FormControl(val.qty),
                 item: new FormControl(val.item),
                 action: new FormControl('existingRecord'),
                 isEditable: new FormControl(true),
                 isNewRow: new FormControl(false),
               })
               )) //end of fb array
             }); // end of form group cretation
     this.isLoading = false;
     this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
     this.dataSource.paginator = this.paginator;
 
     const filterPredicate = this.dataSource.filterPredicate;
       this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
         return filterPredicate.call(this.dataSource, data.value, filter);
       }
      });
 
       //Custom filter according to name column
     // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
     //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
   }

  //  public writeJSON(): Observable<any> {
  //   // return this.http.post("./assets/mydata.json");
  //   this.http.post<any>('data.json','').subscribe(data => {
  //      return data;
  //   })

  //   }
 
   @ViewChild(MatPaginator) paginator: MatPaginator;
 
 goToPage() {
     this.paginator.pageIndex = this.pageNumber - 1;
     this.paginator.page.next({
       pageIndex: this.paginator.pageIndex,
       pageSize: this.paginator.pageSize,
       length: this.paginator.length
     });
   }
   ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
     this.paginatorList = document.getElementsByClassName('mat-paginator-range-label');
 
    this.onPaginateChange(this.paginator, this.paginatorList);
 
    this.paginator.page.subscribe(() => { // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
   }
   
    applyFilter(event: Event) {
     //  debugger;
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
   }
 
 
   // @ViewChild('table') table: MatTable<PeriodicElement>;
   AddNewRow() {
     // this.getBasicDetails();
     const control = this.VOForm.get('VORows') as FormArray;
     control.insert(0,this.initiateVOForm());
     this.dataSource = new MatTableDataSource(control.controls)
     // control.controls.unshift(this.initiateVOForm());
     // this.openPanel(panel);
       // this.table.renderRows();
       // this.dataSource.data = this.dataSource.data;
   }
 
   // this function will enabled the select field for editd
   EditSVO(VOFormElement, i) {
 
     // VOFormElement.get('VORows').at(i).get('name').disabled(false)
     VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
     // this.isEditableNew = true;
 
   }
 
   // On click of correct button in table (after click on edit) this method will call
   SaveVO(VOFormElement, i) {
     // alert('SaveVO')
     console.log('test',VOFormElement.get('VORows').value);
    //  writeJSON(VOFormElement.get('VORows').value);
      this.http.post<any>('http://localhost/update/',VOFormElement.get('VORows').value).subscribe(data => {
        return data;
    })
     VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
   }
 
   // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
   CancelSVO(VOFormElement, i) {
     VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
     this.http.post<any>('http://localhost/update/',VOFormElement.get('VORows').value).subscribe(data => {
        return data;
    })
   }
   deleteSVO(VOFormElement, i) { 
    var arr = VOFormElement.get('VORows').value;
    arr.splice(i,1);  
     this.http.post<any>('http://localhost/update/',VOFormElement.get('VORows').value).subscribe(data => {
         
      this.countries = data;
   
      this.VOForm = this._formBuilder.group({
        VORows: this._formBuilder.array([])
      });
  
       this.VOForm = this.fb.group({
                VORows: this.fb.array(this.countries.map(val => this.fb.group({
                  id: new FormControl(val.id),
                  name: new FormControl(val.name),
                  state: new FormControl(val.state),
                  zip: new FormControl(val.zip),
                  amount: new FormControl(val.amount),
                  qty: new FormControl(val.qty),
                  item: new FormControl(val.item),
                  action: new FormControl('existingRecord'),
                  isEditable: new FormControl(true),
                  isNewRow: new FormControl(false),
                })
                )) //end of fb array
              }); // end of form group cretation
      this.isLoading = false;
      this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
      this.dataSource.paginator = this.paginator;
  
      const filterPredicate = this.dataSource.filterPredicate;
        this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
          return filterPredicate.call(this.dataSource, data.value, filter);
        }
    })
   }
 
 
 paginatorList: HTMLCollectionOf<Element>;
 idx: number;
 onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
      setTimeout((idx) => {
          let from = (paginator.pageSize * paginator.pageIndex) + 1;
 
          let to = (paginator.length < paginator.pageSize * (paginator.pageIndex + 1))
              ? paginator.length
              : paginator.pageSize * (paginator.pageIndex + 1);
 
          let toFrom = (paginator.length == 0) ? 0 : `${from} - ${to}`;
          let pageNumber = (paginator.length == 0) ? `0 of 0` : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
          let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;
 
          if (list.length >= 1)
              list[0].innerHTML = rows; 
 
      }, 0, paginator.pageIndex);
 }
 
 
   initiateVOForm(): FormGroup {
     return this.fb.group({
 
       id: new FormControl(this.countries.length+1),
                 name: new FormControl(''),
                 state: new FormControl(''),
                 zip: new FormControl(''),
                 amount: new FormControl(''),
                 qty: new FormControl(''),
                 item: new FormControl(''),
                 action: new FormControl('newRecord'),
                 isEditable: new FormControl(false),
                 isNewRow: new FormControl(true),
     });
   }

}

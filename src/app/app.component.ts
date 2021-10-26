import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/shared/services/web-api-service';
import { rotas } from "src/shared/consts/rotas-const";
import { MatTableDataSource } from '@angular/material/table';
import { Receitas } from 'src/model/receitas-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  providers: [WebApiService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public displayedColumns: string[] = ['Nome', 'Descricao', 'Ingredientes','DataCriacao', 'acao'];

  public dataSource: MatTableDataSource<Receitas>;

  public formulario: FormGroup;

  public descricao: FormControl;

  public ingredientes: FormControl;

  public nome: FormControl;

  constructor(private webApiService: WebApiService) {

  }

  ngOnInit(): void {

    this.createFormControl();
    this.createFormGroup();

    this.listarReceitas()
  }

  createFormGroup(): void {
    this.formulario = new FormGroup({
      nome: this.nome,
      descricao: this.descricao,
      ingredientes: this.ingredientes,

    });
  }

  createFormControl(): void {
    this.nome = new FormControl('', [Validators.required,])
    this.ingredientes = new FormControl('', [Validators.required,])
    this.descricao = new FormControl('', [Validators.required,])

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cadastrar() {
    // this.webApiService.post(rotas)
  }

  listarReceitas() {
    this.webApiService.get(rotas.receita).subscribe(
      result => {
        console.log(result)
        this.dataSource = new MatTableDataSource(result)
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/shared/services/web-api-service';
import { rotas } from "src/shared/consts/rotas-const";
import { MatTableDataSource } from '@angular/material/table';
import { Receita } from 'src/model/receitas-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialog } from './dialog/delete.dialog.component';
import { ChildActivationStart } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EditDialog } from './dialog/edit-dialog.component';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-root',
  providers: [WebApiService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public displayedColumns: string[] = ['Nome', 'Descricao', 'Ingredientes', 'DataCriacao', 'acao'];

  public dataSource: MatTableDataSource<Receita>;

  public receitas: Array<Receita>;

  public formulario: FormGroup;

  public descricao: FormControl;

  public ingredientes: FormControl;

  public nome: FormControl;



  constructor(private webApiService: WebApiService, private dialog: MatDialog) { }

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
    this.webApiService.post(rotas.salvarReceitas, this.obterReceitas()).subscribe(
      result => {
        this.receitas = result;
        this.dataSource = new MatTableDataSource(this.receitas);
      }
    )
  }


  abrirDialogParaExclusao(receita: Receita) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '250px',
      data: { receitaId: receita.Id, nome: receita.Nome }
    });

    dialogRef.afterClosed().subscribe(receitaId => {
      this.receitas = this.receitas.filter(x => x.Id != receitaId);
      this.dataSource = new MatTableDataSource(this.receitas);
    });
  }

  abrirDialogParaEditar(receita: Receita) {
    const dialogRef = this.dialog.open(EditDialog, {
      width: '250px',
      data: receita
    });

    dialogRef.afterClosed().subscribe(result => {

      this.receitas = this.receitas.map(x => x.Id == result.Id ? result : { ...x });

      this.dataSource = new MatTableDataSource(this.receitas);

    });
  }

  obterReceitas() {
    return {

      "Nome": this.nome.value,

      "DataCriacao": moment().format('D/MM/YYYY'),

      "DataAlteracao": "teste",

      "Descricao": this.descricao.value,

      "Ingredientes": this.descricao.value
    }
  }

  listarReceitas() {
    this.webApiService.get(rotas.obterReceita).subscribe(
      result => {
        this.receitas = result;
        this.dataSource = new MatTableDataSource(result)
      }
    );
  }

}

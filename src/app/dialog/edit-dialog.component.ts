import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Receita } from "src/model/receitas-model";
import { rotas } from "src/shared/consts/rotas-const";
import { WebApiService } from "src/shared/services/web-api-service";
import * as moment from "moment";

@Component({
    selector: 'edit.dialog.component',
    templateUrl: 'edit.dialog.component.html',
    providers: [WebApiService]
})
export class EditDialog implements OnInit {

    public novaReceita: Receita;

    private horizontalPosition: MatSnackBarHorizontalPosition = 'end';

    private verticalPosition: MatSnackBarVerticalPosition = 'top';

    public formulario: FormGroup;

    public Descricao: FormControl;

    public Ingredientes: FormControl;

    public Nome: FormControl;


    constructor(
        private webApiService: WebApiService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<EditDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Receita) { 
            this.novaReceita = this.data;
        }

    ngOnInit(): void {
        this.createFormControl();
        this.createFormGroup();
       
        this.formulario.valueChanges.subscribe(result=>{
            this.novaReceita = result;
            this.novaReceita.Id = this.data.Id;
            this.novaReceita.DataCriacao = this.data.DataCriacao
        })
    }

    createFormGroup(): void {
        this.formulario = new FormGroup({
            Nome: this.Nome,
            Descricao: this.Descricao,
            Ingredientes: this.Ingredientes,

        });
    }

    createFormControl(): void {
        this.Nome = new FormControl(this.data.Nome, [Validators.required,])
        this.Ingredientes = new FormControl(this.data.Ingredientes, [Validators.required,])
        this.Descricao = new FormControl(this.data.Descricao, [Validators.required,])
    }

    openSnackBar() {
        this.snackBar.open('Editado com Sucesso!', 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    obterReceita() {
        return {
            "Id": this.data.Id,

            "Nome": this.Nome.value,

            "DataCriacao": this.data.DataCriacao,

            "DataAlteracao": moment().format('D/MM/YYYY'),

            "Descricao": this.Descricao.value,

            "Ingredientes": this.Ingredientes.value,
        }
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    editar() {
        this.webApiService.put(rotas.atualizarReceita, this.obterReceita()).subscribe(
            () => { this.openSnackBar() }
        )
    }

}

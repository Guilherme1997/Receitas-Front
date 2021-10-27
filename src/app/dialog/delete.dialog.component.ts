import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { rotas } from "src/shared/consts/rotas-const";
import { WebApiService } from "src/shared/services/web-api-service";

@Component({
    selector: 'delete.dialog.component',
    templateUrl: 'delete.dialog.component.html',
    providers: [WebApiService]
})
export class DeleteDialog {

    horizontalPosition: MatSnackBarHorizontalPosition = 'end';

    verticalPosition: MatSnackBarVerticalPosition = 'top';


    constructor(
        private webApiService: WebApiService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<DeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    openSnackBar() {
        this.snackBar.open('Excluido com Sucesso!', 'Ok', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    excluir() {
        this.webApiService.delete(rotas.obterReceita, this.data.receitaId).subscribe(
            () => { this.openSnackBar() }
        )
    }

}

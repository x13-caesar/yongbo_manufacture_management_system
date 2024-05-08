import {MatSnackBar} from '@angular/material/snack-bar';

export function autoFadeSnackBar(snackBar: MatSnackBar, text: string, timeout: number) {
  snackBar.open(text, "关闭");
  setTimeout(() => snackBar.dismiss(), timeout);
}

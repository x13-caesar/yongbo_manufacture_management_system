import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Work} from '../../shared/models/work';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';

class DialogData {
  work!: Work;
}

class method {
  method!: string;
  display!: string
}

@Component({
  selector: 'app-complete-work-dialog',
  templateUrl: './complete-work-dialog.component.html',
  styleUrls: ['./complete-work-dialog.component.scss']
})
export class CompleteWorkDialogComponent implements OnInit {
  workCompleteGroup!: FormGroup;
  methodCtrl = new FormControl('', Validators.required);
  methods: method[] = [{method: 'complete_unit', display: '计件'}, {method: 'complete_hour', display: '计时'}]
  isByHour: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CompleteWorkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.workCompleteGroup = this.formBuilder.group({
      complete_unit: new FormControl(0, Validators.required),
      complete_hour: new FormControl(null)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    const return_work: Work = {...this.data.work, ...this.workCompleteGroup.value};
    this.dialogRef.close(return_work)
  }
}

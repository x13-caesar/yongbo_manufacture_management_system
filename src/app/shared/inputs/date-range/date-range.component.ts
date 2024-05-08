import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent {

  @Output() setDateRangeEvent = new EventEmitter<any>();

  dateRange: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.dateRange = this.fb.group({
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required)
    })
  }

  setDateRange() {
    console.log(this.dateRange.value);
    this.setDateRangeEvent.emit(this.dateRange.value);
  }

}

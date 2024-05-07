import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true
})
export class ErrorComponent implements OnInit {
  code!: number;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.code = +this._activatedRoute.snapshot.params['code'] || 404;
  }

}

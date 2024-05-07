import { BooleanInput } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '@dispatch-commons';
import { UserModel } from '@dispatch-commons/models';

@Component({
	selector: 'user',
	templateUrl: './user.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatMenuModule,
		RouterModule,
	]
})
export class UserComponent implements OnInit {
	static ngAcceptInputType_showAvatar: BooleanInput;

	@Input() showAvatar: boolean = true;
	user: UserModel;

	constructor(
		private _router: Router,
		private _sessionService: SessionService
	) {
	}

	ngOnInit(): void {
		this.user = this._sessionService.user;
	}

	signOut(): void {
		this._router.navigate(['/autenticacion/cerrar-sesion']);
	}

}

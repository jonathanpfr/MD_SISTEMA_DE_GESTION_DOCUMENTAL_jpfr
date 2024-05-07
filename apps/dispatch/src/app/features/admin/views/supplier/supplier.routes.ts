import { Route } from "@angular/router";
import { SupplierComponent } from "./supplier.component";
import { SupplierFinancialComponent } from "./views/financial/financial.component";
import { SupplierGeneralComponent } from "./views/general/general.component";
import { SupplierProductsComponent } from "./views/products/products.component";
import { SupplierRegisterComponent } from "./views/register/register.component";

export const routes: Route[] = [
  {
    path: '',
    component: SupplierComponent,
    children: [
      {
        path: '',
        redirectTo: 'datos-generales',
        pathMatch: 'full'
      },
      {
        path: 'datos-generales',
        component: SupplierGeneralComponent
      },
      {
        path: 'datos-financieros',
        component: SupplierFinancialComponent
      },
      {
        path: 'datos-producto',
        component: SupplierProductsComponent
      },
      {
        path: 'registro',
        component: SupplierRegisterComponent
      },
      {
        path: 'registro/:id',
        component: SupplierRegisterComponent
      }
    ]
  }
];
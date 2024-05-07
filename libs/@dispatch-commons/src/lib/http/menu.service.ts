import { Injectable } from "@angular/core";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { Observable, of } from "rxjs";
import { navigation } from "../data/menu";

@Injectable({ providedIn: 'root' })
export class MenuService {

  getMenu(): Observable<FuseNavigationItem[]> {
    return of(navigation);
  }

}
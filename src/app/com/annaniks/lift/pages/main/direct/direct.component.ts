import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss']
})
export class DirectComponent implements OnInit,OnDestroy {

  constructor(private _navbarService: NavbarService) {
    this._navbarService.setNavbarItems([]);
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    
  }

}

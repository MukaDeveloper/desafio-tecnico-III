import { Component, EventEmitter, Input, Output } from '@angular/core';
import { layoutItems, LayoutService } from '../../services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  public sidebarItems: Array<any>;
  public expanded: boolean = true;

  @Input() public isMobile: boolean = false;
  @Output() public toggleDrawer: EventEmitter<void> = new EventEmitter<void>();

  constructor(private layoutService: LayoutService) {
    this.expanded = this.layoutService.expanded;
    this.sidebarItems = layoutItems;
  }

  public handleClick() {
    if (!this.isMobile) return;
    this.toggleDrawer.emit();
  }
}

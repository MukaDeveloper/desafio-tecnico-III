import { Component, EventEmitter, Input, Output } from '@angular/core';
import { layoutItems, LayoutService } from '../../services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '../../shared/utils/base.component';
import { AuthService } from '../../services/auth/auth.service';
import { ERoutes } from '../../shared/utils/routes.enum';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar extends BaseComponent {
  public sidebarItems: Array<any>;
  public expanded: boolean = true;

  @Input() public isMobile: boolean = false;
  @Output() public toggleDrawer: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private layoutService: LayoutService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    super();

    this.expanded = this.layoutService.expanded;
    this.sidebarItems = layoutItems;
  }

  public handleClick() {
    if (!this.isMobile) return;
    this.toggleDrawer.emit();
  }

  public onLogout() {
    this.showDialog({
      title: 'Atenção',
      message: 'Deseja sair da sua conta?',
      actions: [
        { label: 'Não', value: false },
        { label: 'Sim', value: true, focus: true },
      ],
    }).then((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigate([ERoutes.LOGIN], {
          replaceUrl: true,
        });
        window.location.reload();
      }
    });
  }
}

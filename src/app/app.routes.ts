  import { Routes } from '@angular/router';
  import { ClientDashboardComponent } from './client-dashboard.component/client-dashboard.component';
  import { SupportDashboardComponent } from './support-dashboard.component/support-dashboard.component';
  import { AdminDashboardComponent } from './admin-dashboard.component/admin-dashboard.component';
  import { LoginComponent } from './login.component/login.component';
  import { CreateTicketComponent } from './client-dashboard.component/create-ticket/create-ticket';
  import { clientGuard } from './guards/client-guard';
  import { supportGuard } from './guards/support-guard';
  import { adminGuard } from './guards/admin-guard';
  import {TicketDetailComponent} from './client-dashboard.component/ticket-detail/ticket-detail';
  import {AdminUsersComponent} from './admin-dashboard.component/admin-users/admin-users';
  import {AdminTickets} from './admin-dashboard.component/admin-tickets/admin-tickets';
  import {AdminUsersDetailComponent} from './admin-dashboard.component/admin-users/admin-users-detail/admin-users-detail';
  import {AdminTicketsDetail} from './admin-dashboard.component/admin-tickets/admin-tickets-detail/admin-tickets-detail';
  import {SupportTicketDetailComponent} from './support-dashboard.component/ticket-detail/ticket-detail';

  export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'client', component: ClientDashboardComponent, canActivate: [clientGuard] },
    { path: 'support', component: SupportDashboardComponent, canActivate: [supportGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'client/create-ticket', component: CreateTicketComponent, canActivate: [clientGuard] },
    { path: 'client/ticket-detail/:id', component: TicketDetailComponent, canActivate: [clientGuard] },
    { path: "admin/users", component: AdminUsersComponent, canActivate: [adminGuard] },
    { path: "admin/tickets", component: AdminTickets, canActivate: [adminGuard] },
    { path: "admin/ticket-detail/:id", component: AdminTicketsDetail, canActivate: [adminGuard] },
    { path: "admin/user-detail/:id", component: AdminUsersDetailComponent, canActivate: [adminGuard] },
    {path: "support/ticket-detail/:id", component: SupportTicketDetailComponent, canActivate: [supportGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  ];

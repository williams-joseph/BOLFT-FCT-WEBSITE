import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SermonsComponent } from './components/sermons/sermons.component';
import { TestimoniesComponent } from './components/testimonies/testimonies.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Brethren Of Like Faith Tabernacle' },
  { path: 'sermons', component: SermonsComponent, title: 'Sermons | Brethren Of Like Faith Tabernacle' },
  { path: 'testimonies', component: TestimoniesComponent, title: 'Testimonies | Brethren Of Like Faith Tabernacle' },
  { path: 'contact', component: ContactComponent, title: 'Contact Us | Brethren Of Like Faith Tabernacle' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

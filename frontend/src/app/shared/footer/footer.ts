import { Component, OnInit, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  private settingsService = inject(SettingsService);

  storeAddress = computed(() => this.settingsService.getSetting('StoreAddress') || '280 An Duong Vuong, Ward 4, District 5, HCM');
  storeEmail = computed(() => this.settingsService.getSetting('StoreEmail') || 'kat@gmail.com');
  storePhone = computed(() => this.settingsService.getSetting('StorePhone') || '028 3835 2020');
  storeName = computed(() => this.settingsService.getSetting('StoreName') || 'KAT');

  ngOnInit() {
    this.settingsService.fetchPublicSettings().subscribe();
  }
}
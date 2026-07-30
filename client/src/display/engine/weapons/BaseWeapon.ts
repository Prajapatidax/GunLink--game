import { WeaponId, WeaponStats, WEAPON_REGISTRY } from '@gunlink/shared';

export class BaseWeapon {
  public stats: WeaponStats;

  constructor(weaponId: WeaponId) {
    this.stats = WEAPON_REGISTRY[weaponId] || WEAPON_REGISTRY.PISTOL;
  }

  public getDamage(): number {
    return this.stats.damage;
  }

  public getFireRateMs(): number {
    return this.stats.fireRateMs;
  }

  public getMagazineSize(): number {
    return this.stats.magazineSize;
  }

  public getReloadTimeMs(): number {
    return this.stats.reloadTimeMs;
  }

  public getRecoilIntensity(): number {
    return this.stats.recoilIntensity;
  }
}

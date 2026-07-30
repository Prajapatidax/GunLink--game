import React, { Component, ReactNode, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { EnemyTypeId, WeaponId } from '@gunlink/shared';
import { EnemyFallbackRenderer } from './fallbacks/EnemyFallbacks';
import { WeaponFallbackRenderer } from './fallbacks/WeaponFallbacks';
import { ASSET_REGISTRY } from './assetRegistry';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('[ModelLoader] Error loading 3D GLB model, using fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const GLBModelMesh: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} />;
};

// Enemy GLB 3D Model Loader
export const EnemyModelLoader: React.FC<{ typeId: EnemyTypeId; isHit?: boolean }> = ({ typeId, isHit }) => {
  const fallbackMesh = <EnemyFallbackRenderer typeId={typeId} isHit={isHit} />;
  const assetPath = ASSET_REGISTRY.models.enemies[typeId];

  return (
    <ModelErrorBoundary fallback={fallbackMesh}>
      <Suspense fallback={fallbackMesh}>
        <GLBModelMesh url={assetPath} />
      </Suspense>
    </ModelErrorBoundary>
  );
};

// Weapon GLB 3D Model Loader
export const WeaponModelLoader: React.FC<{ weaponId: WeaponId; muzzleFlash?: boolean }> = ({ weaponId, muzzleFlash }) => {
  const fallbackMesh = <WeaponFallbackRenderer weaponId={weaponId} muzzleFlash={muzzleFlash} />;
  const assetPath = ASSET_REGISTRY.models.weapons[weaponId];

  return (
    <ModelErrorBoundary fallback={fallbackMesh}>
      <Suspense fallback={fallbackMesh}>
        <GLBModelMesh url={assetPath} />
      </Suspense>
    </ModelErrorBoundary>
  );
};

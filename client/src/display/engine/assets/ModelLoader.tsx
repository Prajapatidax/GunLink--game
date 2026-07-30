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

// React Error Boundary to catch missing 3D .glb model load exceptions
class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('[ModelLoader] Asset not found or GLB load error, using procedural 3D fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Sub-component that attempts to load GLB file from public assets
const GLBModelMesh: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} />;
};

// Enemy Model Loader
export const EnemyModelLoader: React.FC<{ typeId: EnemyTypeId; isHit?: boolean }> = ({ typeId, isHit }) => {
  const assetPath = ASSET_REGISTRY.models.enemies[typeId];
  const fallbackMesh = <EnemyFallbackRenderer typeId={typeId} isHit={isHit} />;

  return (
    <ModelErrorBoundary fallback={fallbackMesh}>
      <Suspense fallback={fallbackMesh}>
        <GLBModelMesh url={assetPath} />
      </Suspense>
    </ModelErrorBoundary>
  );
};

// Weapon Model Loader
export const WeaponModelLoader: React.FC<{ weaponId: WeaponId; muzzleFlash?: boolean }> = ({ weaponId, muzzleFlash }) => {
  const assetPath = ASSET_REGISTRY.models.weapons[weaponId];
  const fallbackMesh = <WeaponFallbackRenderer weaponId={weaponId} muzzleFlash={muzzleFlash} />;

  return (
    <ModelErrorBoundary fallback={fallbackMesh}>
      <Suspense fallback={fallbackMesh}>
        <GLBModelMesh url={assetPath} />
      </Suspense>
    </ModelErrorBoundary>
  );
};

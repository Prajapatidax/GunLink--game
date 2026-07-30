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
    console.warn('[ModelLoader] GLB model error, rendering procedural 3D fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const SafeGLBModelMesh: React.FC<{ url: string; fallback: ReactNode }> = ({ url, fallback }) => {
  try {
    const { scene } = useGLTF(url);
    if (!scene) return <>{fallback}</>;
    return <primitive object={scene.clone()} />;
  } catch (err) {
    return <>{fallback}</>;
  }
};

// Enemy Model Loader: Renders procedural 3D fallback model by default if GLB is missing
export const EnemyModelLoader: React.FC<{ typeId: EnemyTypeId; isHit?: boolean }> = ({ typeId, isHit }) => {
  const fallbackMesh = <EnemyFallbackRenderer typeId={typeId} isHit={isHit} />;
  const assetPath = ASSET_REGISTRY.models.enemies[typeId];

  // If asset path is default placeholder path, directly render high-quality procedural 3D fallback
  if (!assetPath || assetPath.includes('/assets/models/')) {
    return fallbackMesh;
  }

  return (
    <ModelErrorBoundary fallback={fallbackMesh}>
      <Suspense fallback={fallbackMesh}>
        <SafeGLBModelMesh url={assetPath} fallback={fallbackMesh} />
      </Suspense>
    </ModelErrorBoundary>
  );
};

// Weapon Model Loader: Renders procedural 3D weapon model by default if GLB is missing
export const WeaponModelLoader: React.FC<{ weaponId: WeaponId; muzzleFlash?: boolean }> = ({ weaponId, muzzleFlash }) => {
  const fallbackMesh = <WeaponFallbackRenderer weaponId={weaponId} muzzleFlash={muzzleFlash} />;
  const assetPath = ASSET_REGISTRY.models.weapons[weaponId];

  if (!assetPath || assetPath.includes('/assets/models/')) {
    return fallbackMesh;
  }

  return (
    <ModelErrorBoundary fallback={fallbackMesh}>
      <Suspense fallback={fallbackMesh}>
        <SafeGLBModelMesh url={assetPath} fallback={fallbackMesh} />
      </Suspense>
    </ModelErrorBoundary>
  );
};

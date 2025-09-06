import * as React from 'react';
import { PlasmicCanvasHost } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '@/structo-init';

export default function PlasmicHost() {
  return PLASMIC && <PlasmicCanvasHost />;
}

import * as React from 'react';
import { StructoCanvasHost } from '@structoapp/loader-nextjs';
import { STRUCTO } from '@/structo-init';

export default function StructoHost() {
  return STRUCTO && <StructoCanvasHost />;
}

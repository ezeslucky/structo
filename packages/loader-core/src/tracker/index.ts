
export interface TrackerOptions {
  projectIds: string[];
  platform?: string;
  preview?: boolean;
  nativeFetch?: boolean;
}


export interface TrackerRenderProperties {
  rootProjectId?: string;
  rootComponentId?: string;
  rootComponentName?: string;
  teamIds: string[];
  projectIds: string[];
}


export interface TrackRenderOptions {
  renderCtx?: TrackerRenderProperties;
  variation?: Record<string, string>;
}


export class StructoTracker {
  // Preserve constructor signature for compatibility, but do not retain
  // instance state to avoid unused-property diagnostics.
  constructor(_opts: TrackerOptions) {}

  /**
   * @deprecated No-op.
   */
  public trackRender(_opts?: TrackRenderOptions): void {}

  /**
   * @deprecated No-op.
   */
  public trackFetch(): void {}

  /**
   * @deprecated No-op.
   */
  public trackConversion(_value: number = 0): void {}
}

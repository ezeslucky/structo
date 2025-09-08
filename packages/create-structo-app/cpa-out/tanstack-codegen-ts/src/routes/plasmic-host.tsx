import { createFileRoute } from '@tanstack/react-router'
import { StructoCanvasHost, registerComponent } from '@structoapp/react-web/lib/host';

export const Route = createFileRoute('/structo-host')({
  component: StructoHostRouteComponent,
})




function StructoHostRouteComponent() {
  return <StructoCanvasHost />
}

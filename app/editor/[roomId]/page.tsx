import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceCanvas } from "@/components/editor/workspace-canvas";
import {
  getAccessibleProject,
  getCurrentIdentity,
} from "@/lib/project-access";

type WorkspacePageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { roomId } = await params;
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  return <WorkspaceCanvas />;
}

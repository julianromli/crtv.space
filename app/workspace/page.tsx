"use client";

import WorkspaceTopBar from '@/components/workspace/TopBar';
import WorkspaceLeftSidebar from '@/components/workspace/LeftSidebar';
import WorkspaceRightSidebar from '@/components/workspace/RightSidebar';
import CanvasArea from '@/components/workspace/CanvasArea';

export default function Workspace() {
  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] overflow-hidden">
      <WorkspaceTopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <WorkspaceLeftSidebar />
        <CanvasArea />
        <WorkspaceRightSidebar />
      </div>
    </div>
  );
}

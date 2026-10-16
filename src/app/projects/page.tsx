import Book from "@/components/Book";
import ProjectsWorkbench from "@/components/ProjectsWorkbench";

export const metadata = { title: "Projects — field journal" };

export default function Projects() {
  return (
    <Book>
      <ProjectsWorkbench />
    </Book>
  );
}

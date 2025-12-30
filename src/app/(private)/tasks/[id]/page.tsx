import TaskDetail from "@/myComponents/TaskDetail";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;      
  const taskId = Number(id);

  return <TaskDetail id={taskId} />;
}
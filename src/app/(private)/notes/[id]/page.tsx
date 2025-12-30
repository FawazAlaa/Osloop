import NoteDetail from "@/myComponents/NoteDetail";


export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;        // ✅ unwrap promise
  const NoteId = Number(id);

  return <NoteDetail id={NoteId} />;
}
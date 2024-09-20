import { FileList } from "@/app/filedownload/_components/FileList";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        </div>
        <div className="mt-6">
          <FileList />
        </div>
      </div>
  );
}

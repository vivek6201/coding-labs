import CreateLab from "../../components/CreateLab";

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col gap-y-5 w-full">
      <div className="flex flex-1 justify-between items-center container mt-10 w-full max-h-[50px]">
        <p className="text-xl md:text-2xl font-bold ">Your Labs</p>
        <CreateLab />
      </div>
      <div className="flex min-h-[400px] items-center justify-center">
        {/* here all you created labs will be displayed by fetching from the db */}
        <p>No Labs Created</p>
      </div>
    </div>
  );
}

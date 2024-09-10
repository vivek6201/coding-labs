import CreateLab from "../../components/CreateLab";
import Navbar from "../../components/Navbar";

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col gap-y-5 w-full">
      <div className="flex flex-1 justify-between items-center container mt-10 w-full">
        <p className="text-xl md:text-2xl font-bold ">Your Labs</p>
        <CreateLab />
      </div>
    </div>
  );
}

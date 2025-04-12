import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-red-500 text-9xl">Dashboard</p>

      <div className="flex justify-center items-center gap-4 mt-4">
        <Link
          to="/sign-in"
          className="text-lg text-blue-500 border border-zinc-500 p-3 hover:scale-125 hover:bg-slate-300"
        >
          Sign In
        </Link>
        <Link
          to="/sign-up"
          className="text-lg text-blue-500 border border-zinc-500 p-3 hover:scale-125 hover:bg-slate-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

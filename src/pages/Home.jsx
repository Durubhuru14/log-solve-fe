import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { Footer, GitBadge } from "../components";

const Home = () => {
  return (
    <main className="grid grid-cols-1 grid-rows-1 justify-center items-center text-gray-100 w-screen h-screen font-[Gochi_Hand]">
      <GitBadge />
      <div className="flex flex-col justify-center items-center">
        <img
          src={logo}
          alt="logSolve logo"
          className="w-[310px] md:w-md mb-4 2xl:w-xl"
        />
        <div className="flex gap-4 justify-between items-center md:text-lg xl:text-xl 2xl:text-2xl">
          <Link
            to={"/draw"}
            className="bg-blue-500 p-2 rounded-md cursor-pointer transition-colors hover:bg-blue-700"
          >
            Get Started!
          </Link>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 border border-blue-500 rounded-md p-2 cursor-pointer transition-colors hover:bg-blue-100 hover:text-blue-700"
          >
            New Here?
          </a>
        </div>
        <p className="mt-2 xl:text-lg 2xl:text-xl">
          LogSolve dev insights →{" "}
          <a
            href="#"
            rel="noopener noreferrer"
            className="text-blue-500 underline underline-offset-3"
          >
            YouTube
          </a>
        </p>
      </div>
      <Footer />
    </main>
  );
};
export default Home;

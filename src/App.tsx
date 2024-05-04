import MovieForm from "@/components/form";
import MovieList from "@/components/movie/movie-list";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <section className="w-full h-full flex justify-between items-center flex-wrap md:flex-nowrap">
      <div className="w-full h-full p-5 flex flex-col justify-center items-center">
        <MovieForm />
      </div>
      <Separator orientation="vertical"/>
      <div className="w-full h-full p-5 flex flex-col items-center">
        <MovieList />
      </div>
    </section>
  )
}

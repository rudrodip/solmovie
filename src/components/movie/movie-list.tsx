import { Movie } from "@/lib/models/movie";
import { Star } from "lucide-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { MovieCoordinator } from "@/lib/coordinator/movie-cordinator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function MovieList() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<(Movie | null)[]>([]);
  const { connection } = useConnection();

  useEffect(() => {
    if (!connection) {
      return;
    }

    MovieCoordinator.fetchPage(connection, page, 7, query, query !== "").then(
      (movies) => setMovies(movies)
    );
  }, [connection, page, query]);

  return (
    <section className="w-full flex flex-col gap-3 mt-12">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Movies</h1>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem className="cursor-pointer">
                <PaginationNext onClick={() => setPage((value) => value + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div className="flex items-end w-full gap-3">
        <div className="w-full">
          <Label htmlFor="search">
            Search
          </Label>
          <Input id="search" type="text" placeholder="search" className="w-full" autoFocus />
        </div>
        <Button
          onClick={() => {
            setQuery(
              (document.getElementById("search") as HTMLInputElement).value
            );
            setPage(1);
          }}
          size="icon"
        >
          <Search size={16} />
        </Button>
      </div>
      <div className="flex flex-col gap-3 h-[70vh] overflow-y-scroll">
        {movies.map(
          (movie, index) => movie && <MovieCard key={index} movie={movie} />
        )}
        {movies.length === 0 && (
          <>
            <MovieSkeleton />
            <MovieSkeleton />
            <MovieSkeleton />
            <MovieSkeleton />
            <MovieSkeleton />
            <MovieSkeleton />
            <MovieSkeleton />
          </>
        )}
      </div>
    </section>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="w-full rounded border p-3 bg-accent break-all">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">{movie.title}</h1>
        <h1 className="flex items-center gap-1">
          <Star size={14} />
          <span>{movie.rating}</span>
        </h1>
      </div>
      <p className="text-muted-foreground">{movie.description}</p>
    </div>
  );
}

function MovieSkeleton() {
  return (
    <div className="w-full max-w-lg h-20 rounded border p-3 bg-accent break-all animate-pulse"></div>
  );
}

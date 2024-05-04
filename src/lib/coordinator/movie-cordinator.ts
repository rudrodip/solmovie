import bs58 from "bs58";
import * as web3 from "@solana/web3.js";
import { Movie } from "@/lib/models/movie";
import { MOVIE_REVIEW_PROGRAM_ID } from "@/lib/constants";

export class MovieCoordinator {
  static accounts: web3.PublicKey[] = [];

  static async prefetchAccounts(connection: web3.Connection, search: string) {
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: { offset: 2, length: 18 },
        filters:
          search === ""
            ? []
            : [
                {
                  memcmp: {
                    offset: 6,
                    bytes: bs58.encode(Buffer.from(search)),
                  },
                },
              ],
      }
    );

    const temp = accounts.map((account) => account);
    temp.sort((a, b) => {
      const lengthA =
        a.account.data.length > 4 ? a.account.data.readUInt32LE(0) : 0;
      const lengthB =
        b.account.data.length > 4 ? b.account.data.readUInt32LE(0) : 0;
      const dataA =
        lengthA <= a.account.data.length - 4
          ? a.account.data.subarray(4, 4 + lengthA)
          : Buffer.alloc(0);
      const dataB =
        lengthB <= b.account.data.length - 4
          ? b.account.data.subarray(4, 4 + lengthB)
          : Buffer.alloc(0);
      return dataA.compare(dataB);
    });
    this.accounts = temp.map((account) => account.pubkey);
  }

  static async fetchPage(
    connection: web3.Connection,
    page: number,
    perPage: number,
    search: string,
    reload: boolean = false
  ): Promise<Movie[]> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, search);
    }

    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * perPage,
      page * perPage
    );

    if (paginatedPublicKeys.length === 0) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      paginatedPublicKeys
    );

    const movies = accounts.reduce((accum: Movie[], account) => {
      const movie = Movie.deserialize(account?.data);
      if (!movie) {
        return accum;
      }

      return [...accum, movie];
    }, []);

    return movies;
  }
}

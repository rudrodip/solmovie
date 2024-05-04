import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { Movie } from "@/lib/models/movie";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MOVIE_REVIEW_PROGRAM_ID } from "@/lib/constants";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Movie title must be at least 2 characters.",
  }),
  rating: z.coerce.number().int().min(1).max(5),
  description: z.string().min(10, {
    message: "Movie description must be at least 10 characters.",
  }),
});

export default function MovieForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      rating: 1,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const movie = new Movie(values.title, values.rating, values.description);

    if (!publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    const buffer = movie.serialize();
    const transaction = new web3.Transaction();

    const [pda] = await web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), new TextEncoder().encode(movie.title)],
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      const txid = await sendTransaction(transaction, connection)
      toast.success(`Successfully added the movie: ${values.title}!`)
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the movie.");
      return;
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-lg"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie title</FormLabel>
              <FormControl>
                <Input placeholder="The Dark Knight" {...field} />
              </FormControl>
              <FormDescription>
                Enter the title of the movie you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
              <FormDescription>
                Enter the description of the movie you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input placeholder="enter rating between 1 and 5" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Enter the rating of the movie you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

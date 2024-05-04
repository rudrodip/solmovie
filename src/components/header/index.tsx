import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ThemeToggler } from "@/components/theme/theme-toggler";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full px-3 py-1 flex justify-between items-center bg-secondary border-b">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" width={25} height={25} />
        <h1 className="font-semibold text-2xl">SolMovie</h1>
      </div>
      <div className="flex items-center gap-3">
        <WalletMultiButton />
        <ThemeToggler />
      </div>
    </header>
  )
}
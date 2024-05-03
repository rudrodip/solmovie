import { Button } from "@/components/ui/button"
import { ThemeToggler } from "@/components/theme/theme-toggler"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function Home() {
  return (
    <div>
      <WalletMultiButton />
      <Button>Click me</Button>
      <ThemeToggler />
    </div>
  )
}

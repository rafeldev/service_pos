import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HiMenu } from "react-icons/hi";

export function MenuPopover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HiMenu className="w-7 h-7" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Keyboard shortcuts
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

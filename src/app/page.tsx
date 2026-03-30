import { redirect } from "next/navigation";
import { BLITZ_SAT_ORIGIN } from "@/lib/youtube-redirect";

export default function Home() {
  redirect(BLITZ_SAT_ORIGIN);
}

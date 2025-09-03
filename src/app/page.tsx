import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root path to CurioLearn
  redirect('https://sat.curiolearn.co');
}

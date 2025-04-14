import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData'; 
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store'; 

const PUBLIC_PATHS = ["/login", "/register"]; 

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [, setFavourites] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    async function updateAtoms() {
      setFavourites(await getFavourites());
      setSearchHistory(await getHistory());
    }

    const securePaths = ["/favourites", "/history", "/search", "/artwork"];

    if (!isAuthenticated() && securePaths.some((path) => router.pathname.startsWith(path))) {
      router.push("/login"); 
    } else if (isAuthenticated()) {
      updateAtoms(); 
    }
  }, [router]);

  return children;
}

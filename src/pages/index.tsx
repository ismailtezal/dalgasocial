import { InfiniteDalgaList } from "~/components/InfiniteDalgaList";
import { NewDalgaForm } from "~/components/NewDalgaForm";
import { api } from "~/utils/api";

export default function Home() {

  return <>
    <header className="sticky top-0 text-white pt-2">
      <h1 className="mb-2 px-4 text-lg font-bold">Ana Sayfa</h1>
    </header>
    <NewDalgaForm />
    <RecentDalgas />
  </>
}

function RecentDalgas() {
  const dalgas = api.dalga.infiniteFeed.useInfiniteQuery({}, { getNextPageParam: lastPage => lastPage.nextCursor });

  return <InfiniteDalgaList
    dalgas={dalgas.data?.pages.flatMap((page) => page.dalgas)}
    isError={dalgas.isError}
    isLoading={dalgas.isLoading}
    hasMore={dalgas.hasNextPage}
    fetchNewDalgas={dalgas.fetchNextPage}
  />
}
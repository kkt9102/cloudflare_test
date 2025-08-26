// type Repo = {
//   name: string;
//   stargazers_count: number;
// };

// async function getRepo() {
//   const res = await fetch("https://api.github.com/repos/vercel/next.js", {
//     cache: "no-store",
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   const repo: Repo = await res.json();
//   return repo;
// }

export default async function Page() {
  // const repo = await getRepo();

  return (
    <div>
      <div>Next.js Repo Stars</div>
      {/* <div>{repo.stargazers_count}</div> */}
      <div>
        (This page is server-side rendered at {new Date().toISOString()})
      </div>
    </div>
  );
}

export const runtime = "edge";

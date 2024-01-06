import { CalendarIcon, ChevronRight, LinkIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import Back from "~/components/ui/back";
import { Badge } from "~/components/ui/badge";
import { HeaderMain } from "~/components/ui/header";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

type Props = {
  params: { id: string };
};

export const revalidate = 3600;

const getItem = cache(async (id: string) => {
  const author = await api.author.findById.query(Number(id));

  if (!author) {
    return notFound();
  }

  return author;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getItem(params.id);

  const keywords = [author.name];

  if (author.dynasty) {
    keywords.push(author.dynasty);
  }

  return {
    title: `${author.name}: ${author.dynasty}朝 | AsPoem`,
    description: `${author.introduce} `,
    keywords,
  };
}

export default async function Page({ params }: Props) {
  const author = await getItem(params.id);

  return (
    <>
      <HeaderMain>
        <div className="flex h-16 items-center px-4">
          <Back />

          <Separator orientation="vertical" className="mx-4 h-4" />

          <nav className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">作者</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
            <span>{author.name}</span>
          </nav>
        </div>
      </HeaderMain>

      <article>
        <header className="rounded-box m-auto flex max-w-screen-sm py-8">
          <Avatar className="h-36 w-36">
            <AvatarFallback>
              <span className="text-3xl">{author.name}</span>
            </AvatarFallback>
          </Avatar>

          <div className="ml-16 text-left">
            <h1 className="-mx-2" prose-h1="">
              <span className="text-outline">{author.name}</span>{" "}
              <span className="font-pinyin text-2xl font-normal capitalize !tracking-tighter">
                {author.namePinYin}
              </span>
            </h1>
            <p className="mt-4 line-clamp-3">{author.introduce}</p>
            <div className="mt-8">
              <p className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span className="ml-2">
                  <span className="font-pinyin">{author.birthDate ?? "?"}</span>
                  年<span className="mx-2 text-muted-foreground">~</span>
                  <span className="font-pinyin">{author.deathDate ?? "?"}</span>
                  年
                </span>
              </p>
              <p className="flex items-center">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <Link
                  href={`https://zh.wikipedia.org/wiki/${author.name}`}
                  target="_blank"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  维基百科/{author.name}
                </Link>
              </p>
              <div className="mt-8 space-x-4">
                <Badge>{author.dynasty}朝</Badge>
                <Badge variant={"secondary"}>Tag2</Badge>
                <Badge variant={"secondary"}>Tag3</Badge>
              </div>
            </div>
          </div>
        </header>
      </article>
    </>
  );
}

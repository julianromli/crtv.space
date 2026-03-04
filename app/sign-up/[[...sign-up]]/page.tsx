import { SignUp } from "@clerk/nextjs";

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const rawRedirectUrl = Array.isArray(params.redirect_url) ? params.redirect_url[0] : params.redirect_url;
  const fallbackUrl = "/explore";
  const redirectUrl = typeof rawRedirectUrl === "string" && rawRedirectUrl.startsWith("/") ? rawRedirectUrl : fallbackUrl;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <SignUp fallbackRedirectUrl={fallbackUrl} forceRedirectUrl={redirectUrl} />
    </main>
  );
}

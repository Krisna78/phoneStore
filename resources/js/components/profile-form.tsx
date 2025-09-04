import { useForm, usePage, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Transition } from "@headlessui/react";
import HeadingSmall from "@/components/heading-small";
import DeleteUser from "@/components/delete-user";
import { type SharedData } from "@/types";

type ProfileForm = {
  name: string;
  email: string;
};

export default function ProfileForm({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm<Required<ProfileForm>>({
      name: auth.user.name,
      email: auth.user.email,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route("profile.update"), { preserveScroll: true });
  };

  return (
    <div className="space-y-6">
      <HeadingSmall
        title="Profile information"
        description="Update your name and email address"
      />

      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            autoComplete="name"
          />
          <InputError className="mt-2" message={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            autoComplete="username"
          />
          <InputError className="mt-2" message={errors.email} />
        </div>

        {mustVerifyEmail && auth.user.email_verified_at === null && (
          <p className="text-sm text-muted-foreground">
            Your email is unverified.{" "}
            <Link href={route("verification.send")} method="post" as="button">
              Click here to resend.
            </Link>
          </p>
        )}

        <div className="flex items-center gap-4">
          <Button disabled={processing}>Save</Button>
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-neutral-600">Saved</p>
          </Transition>
        </div>
      </form>

      <DeleteUser />
    </div>
  );
}

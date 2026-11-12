import { sleep } from "@/lib/utils";

/** Password reset isn't implemented yet (needs an email provider). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requestResetStub(_email: string) {
  await sleep(1000);
}

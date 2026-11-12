"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Language } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { EDITOR_THEMES, LANGUAGES } from "@/lib/constants";
import { currentUser } from "@/lib/mock-data/players";
import { signOut, useSession } from "@/lib/services/auth";
import { sleep } from "@/lib/utils";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-line py-8 first:pt-0 last:border-b-0 lg:grid-cols-[280px_1fr]">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-[13.5px] text-muted">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-6 rounded-[12px] border border-line px-4 py-3.5">
      <span>
        <span className="block text-[14px] font-medium">{label}</span>
        <span className="block text-[12.5px] text-muted">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </label>
  );
}

export function Settings() {
  const router = useRouter();
  const session = useSession();
  const [profile, setProfile] = useState({ username: session?.username ?? currentUser.username, bio: currentUser.bio });
  const [lang, setLang] = useState<Language>("javascript");
  const [theme, setTheme] = useState("devbattle");
  const [font, setFont] = useState("14");
  const [notify, setNotify] = useState({ challenges: true, results: true, tournaments: false, weekly: true });
  const [privacy, setPrivacy] = useState({ spectate: true, showOnline: true });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string>();

  const save = async () => {
    if (!/^[a-z0-9_.]{3,18}$/.test(profile.username)) {
      setError("Usernames are 3–18 characters: lowercase letters, numbers, dots and underscores.");
      return;
    }
    setError(undefined);
    setSaving(true);
    await sleep(800);
    setSaving(false);
    toast("Settings saved");
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Your profile, arena preferences and notifications."
        actions={<Button onClick={save} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Save changes</Button>}
      />
      <Card className="p-6 sm:p-8">
        <Section title="Profile" description="How other developers see you on leaderboards and in the arena.">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={profile.username} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} aria-invalid={!!error} aria-describedby="username-hint" />
            <p id="username-hint" className="text-[12.5px] text-muted">{error ?? "Shown on leaderboards and to opponents."}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} maxLength={200} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
            <p className="text-right font-mono text-[11.5px] text-muted">{profile.bio.length}/200</p>
          </div>
        </Section>
        <Section title="Arena" description="Defaults applied whenever a new battle starts.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Default language</Label>
              <Select className="w-full" ariaLabel="Default language" value={lang} onValueChange={(v) => setLang(v as Language)} options={LANGUAGES.map((l) => ({ value: l.value, label: l.label }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Editor theme</Label>
              <Select className="w-full" ariaLabel="Editor theme" value={theme} onValueChange={setTheme} options={EDITOR_THEMES} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Editor font size</Label>
            <Segmented value={font} onChange={setFont} ariaLabel="Font size" options={["12", "13", "14", "16"].map((s) => ({ value: s, label: `${s}px` }))} />
          </div>
        </Section>
        <Section title="Notifications" description="Choose what reaches you while you're away.">
          <Toggle label="Battle challenges" hint="When someone invites you to a private room" checked={notify.challenges} onChange={(v) => setNotify((n) => ({ ...n, challenges: v }))} />
          <Toggle label="Result summaries" hint="AI judge report after every ranked battle" checked={notify.results} onChange={(v) => setNotify((n) => ({ ...n, results: v }))} />
          <Toggle label="Tournament reminders" hint="30 minutes before check-in closes" checked={notify.tournaments} onChange={(v) => setNotify((n) => ({ ...n, tournaments: v }))} />
          <Toggle label="Weekly progress email" hint="Rating change and AI coaching tips, every Monday" checked={notify.weekly} onChange={(v) => setNotify((n) => ({ ...n, weekly: v }))} />
        </Section>
        <Section title="Privacy" description="Control who can watch and find you.">
          <Toggle label="Allow spectators" hint="Others can watch your ranked battles live" checked={privacy.spectate} onChange={(v) => setPrivacy((p) => ({ ...p, spectate: v }))} />
          <Toggle label="Show online status" hint="Friends see when you're available to battle" checked={privacy.showOnline} onChange={(v) => setPrivacy((p) => ({ ...p, showOnline: v }))} />
        </Section>
        <Section title="Account" description="Deleting your account removes your rating, history and achievements.">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => { void signOut().then(() => router.refresh()); toast("Logged out"); router.push("/"); }}>Log out</Button>
            <Button variant="outline" onClick={() => setConfirmDelete(true)}><Trash2 /> Delete account</Button>
          </div>
        </Section>
      </Card>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete your account?"
        description="Your rating, 186 battles and all achievements will be permanently removed. This can't be undone."
        confirmLabel="Delete account"
        cancelLabel="Keep account"
        onConfirm={() => { void signOut().then(() => router.refresh()); toast("Account deleted"); router.push("/"); }}
      />
    </div>
  );
}

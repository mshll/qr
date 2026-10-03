import { useId, useState, type ComponentProps } from "react";
import { ArrowDown01Icon, GpsSignal01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { detectLink, type LinkKind } from "~/lib/qr/encode";
import type { QrData, QrType } from "~/lib/qr/types";

type FieldProps = Omit<ComponentProps<"input">, "onChange" | "value"> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  multiline?: boolean;
};

function TextField({ label, value, onValueChange, multiline, className, ...props }: FieldProps) {
  const id = useId();
  return (
    <div className={className ? `grid gap-2 ${className}` : "grid gap-2"}>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          placeholder={props.placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          className="max-h-60"
        />
      ) : (
        <Input id={id} value={value} onChange={(e) => onValueChange(e.target.value)} {...props} />
      )}
    </div>
  );
}

const linkHints: Record<LinkKind, string> = {
  url: "Opens the link",
  email: "Detected an email address: opens a new email",
  phone: "Detected a phone number: starts a call",
  text: "Shows as plain text",
};

interface FormProps<K extends QrType> {
  value: QrData[K];
  onChange: (value: QrData[K]) => void;
}

function UrlForm({ value, onChange }: FormProps<"url">) {
  const id = useId();
  const detected = detectLink(value.value);
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="sr-only">
        Link or text
      </Label>
      <Input
        id={id}
        value={value.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder="Paste a link, email or phone number"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="url"
        className="h-11 text-base md:h-11 md:text-[15px]"
      />
      <p className="min-h-4 text-[12px] text-subtle" aria-live="polite">
        {detected.payload
          ? `${linkHints[detected.kind]}${detected.kind === "url" ? `: ${detected.payload}` : ""}`
          : ""}
      </p>
    </div>
  );
}

function TextForm({ value, onChange }: FormProps<"text">) {
  return (
    <TextField
      label="Text"
      multiline
      value={value.value}
      onValueChange={(v) => onChange({ value: v })}
      placeholder="Any text, up to a few hundred characters scans best"
    />
  );
}

function WifiForm({ value, onChange }: FormProps<"wifi">) {
  const set = (patch: Partial<QrData["wifi"]>) => onChange({ ...value, ...patch });
  const hiddenId = useId();
  return (
    <div className="grid gap-4">
      <TextField
        label="Network name (SSID)"
        value={value.ssid}
        onValueChange={(ssid) => set({ ssid })}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <TextField
          label="Password"
          value={value.password}
          onValueChange={(password) => set({ password })}
          disabled={value.encryption === "nopass"}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <div className="grid gap-2">
          <Label>Security</Label>
          <Select
            value={value.encryption}
            onValueChange={(encryption) => encryption && set({ encryption })}
            items={{ WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "None" }}
          >
            <SelectTrigger className="w-full sm:w-40" aria-label="Security">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id={hiddenId}
          checked={value.hidden}
          onCheckedChange={(hidden) => set({ hidden })}
        />
        <Label htmlFor={hiddenId} className="font-normal text-foreground">
          Hidden network
        </Label>
      </div>
    </div>
  );
}

function MoreFields({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Collapsible>
      <CollapsibleTrigger
        render={
          <Button variant="ghost" size="sm" className="group -ml-2.5 text-muted-foreground" />
        }
      >
        {label}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className="transition-transform group-data-panel-open:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function VcardForm({ value, onChange }: FormProps<"vcard">) {
  const field = (key: keyof QrData["vcard"], label: string, props: Partial<FieldProps> = {}) => (
    <TextField
      label={label}
      value={value[key]}
      onValueChange={(v) => onChange({ ...value, [key]: v })}
      {...props}
    />
  );
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { autoComplete: "given-name" })}
        {field("lastName", "Last name", { autoComplete: "family-name" })}
        {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
        {field("email", "Email", { type: "email", autoComplete: "email" })}
      </div>
      <MoreFields label="Company, website and address">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("org", "Company", { autoComplete: "organization" })}
          {field("title", "Job title", { autoComplete: "organization-title" })}
          {field("website", "Website", {
            type: "url",
            autoComplete: "url",
            className: "sm:col-span-2",
          })}
          {field("street", "Street", {
            autoComplete: "street-address",
            className: "sm:col-span-2",
          })}
          {field("city", "City", { autoComplete: "address-level2" })}
          {field("region", "State / region", { autoComplete: "address-level1" })}
          {field("postcode", "Postal code", { autoComplete: "postal-code" })}
          {field("country", "Country", { autoComplete: "country-name" })}
          {field("note", "Note", { multiline: true, className: "sm:col-span-2" })}
        </div>
      </MoreFields>
    </div>
  );
}

function EmailForm({ value, onChange }: FormProps<"email">) {
  const set = (patch: Partial<QrData["email"]>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-4">
      <TextField
        label="To"
        type="email"
        value={value.to}
        onValueChange={(to) => set({ to })}
        autoComplete="email"
      />
      <TextField
        label="Subject"
        value={value.subject}
        onValueChange={(subject) => set({ subject })}
      />
      <TextField
        label="Message"
        multiline
        value={value.body}
        onValueChange={(body) => set({ body })}
      />
    </div>
  );
}

function SmsForm({ value, onChange }: FormProps<"sms">) {
  const set = (patch: Partial<QrData["sms"]>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-4">
      <TextField
        label="Phone number"
        type="tel"
        value={value.phone}
        onValueChange={(phone) => set({ phone })}
      />
      <TextField
        label="Message"
        multiline
        value={value.message}
        onValueChange={(message) => set({ message })}
      />
    </div>
  );
}

function PhoneForm({ value, onChange }: FormProps<"phone">) {
  return (
    <TextField
      label="Phone number"
      type="tel"
      value={value.phone}
      onValueChange={(phone) => onChange({ phone })}
      placeholder="+1 555 123 4567"
      autoComplete="tel"
    />
  );
}

function LocationForm({ value, onChange }: FormProps<"location">) {
  const [locating, setLocating] = useState(false);
  const locate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        onChange({ lat: coords.latitude.toFixed(6), lng: coords.longitude.toFixed(6) });
      },
      (error) => {
        setLocating(false);
        toast.error(
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied"
            : "Couldn't get your location",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Latitude"
          inputMode="decimal"
          value={value.lat}
          onValueChange={(lat) => onChange({ ...value, lat })}
          placeholder="40.748817"
        />
        <TextField
          label="Longitude"
          inputMode="decimal"
          value={value.lng}
          onValueChange={(lng) => onChange({ ...value, lng })}
          placeholder="-73.985428"
        />
      </div>
      <Button variant="outline" className="w-fit" onClick={locate} disabled={locating}>
        <HugeiconsIcon icon={GpsSignal01Icon} />
        {locating ? "Locating…" : "Use my location"}
      </Button>
    </div>
  );
}

function toggleAllDay(value: string, allDay: boolean) {
  if (!value) return value;
  return allDay ? value.slice(0, 10) : `${value.slice(0, 10)}T09:00`;
}

function EventForm({ value, onChange }: FormProps<"event">) {
  const set = (patch: Partial<QrData["event"]>) => onChange({ ...value, ...patch });
  const allDayId = useId();
  const inputType = value.allDay ? "date" : "datetime-local";
  return (
    <div className="grid gap-4">
      <TextField label="Title" value={value.title} onValueChange={(title) => set({ title })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Starts"
          type={inputType}
          value={value.start}
          onValueChange={(start) => set({ start })}
        />
        <TextField
          label="Ends"
          type={inputType}
          value={value.end}
          min={value.start}
          onValueChange={(end) => set({ end })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id={allDayId}
          checked={value.allDay}
          onCheckedChange={(allDay) =>
            set({
              allDay,
              start: toggleAllDay(value.start, allDay),
              end: toggleAllDay(value.end, allDay),
            })
          }
        />
        <Label htmlFor={allDayId} className="font-normal text-foreground">
          All day
        </Label>
      </div>
      <TextField
        label="Location"
        value={value.location}
        onValueChange={(location) => set({ location })}
      />
      <TextField
        label="Description"
        multiline
        value={value.description}
        onValueChange={(description) => set({ description })}
      />
    </div>
  );
}

interface TypeFormProps {
  type: QrType;
  data: QrData;
  onChange: <K extends QrType>(type: K, value: QrData[K]) => void;
}

export function TypeForm({ type, data, onChange }: TypeFormProps): React.ReactNode {
  switch (type) {
    case "url":
      return <UrlForm value={data.url} onChange={(v) => onChange("url", v)} />;
    case "text":
      return <TextForm value={data.text} onChange={(v) => onChange("text", v)} />;
    case "wifi":
      return <WifiForm value={data.wifi} onChange={(v) => onChange("wifi", v)} />;
    case "vcard":
      return <VcardForm value={data.vcard} onChange={(v) => onChange("vcard", v)} />;
    case "email":
      return <EmailForm value={data.email} onChange={(v) => onChange("email", v)} />;
    case "sms":
      return <SmsForm value={data.sms} onChange={(v) => onChange("sms", v)} />;
    case "phone":
      return <PhoneForm value={data.phone} onChange={(v) => onChange("phone", v)} />;
    case "location":
      return <LocationForm value={data.location} onChange={(v) => onChange("location", v)} />;
    case "event":
      return <EventForm value={data.event} onChange={(v) => onChange("event", v)} />;
  }
}

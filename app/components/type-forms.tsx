import { useEffect, useRef, useState } from "react";
import { CloseRegular, DownRegular, NavigationRegular } from "@mingcute/react/core-regular";
import { toast } from "sonner";

import {
  FieldButton,
  FieldDate,
  FieldGroup,
  FieldInput,
  FieldSelect,
  FieldSwitch,
  FieldTextarea,
} from "~/components/ui/field";
import type { QrData, QrType } from "~/lib/qr/types";

interface FormProps<K extends QrType> {
  value: QrData[K];
  onChange: (value: QrData[K]) => void;
}

const plain = { autoComplete: "off", autoCapitalize: "off", spellCheck: false } as const;

function UrlForm({ value, onChange }: FormProps<"url">) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) ref.current?.focus();
  }, []);
  return (
    <FieldGroup className="relative">
      <FieldInput
        ref={ref}
        label="Paste a link"
        value={value.value}
        onValueChange={(v) => onChange({ value: v })}
        inputMode="url"
        className="h-[52px] pr-12"
        {...plain}
      />
      {value.value ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => {
            onChange({ value: "" });
            ref.current?.focus();
          }}
          className="absolute top-2 right-2 grid border-t-0! animate-in duration-200 fade-in zoom-in-75 size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          <CloseRegular className="size-4" />
        </button>
      ) : null}
    </FieldGroup>
  );
}

function TextForm({ value, onChange }: FormProps<"text">) {
  return (
    <FieldGroup>
      <FieldTextarea
        label="Type anything"
        value={value.value}
        onValueChange={(v) => onChange({ value: v })}
        className="min-h-32"
      />
    </FieldGroup>
  );
}

const securityOptions: { value: QrData["wifi"]["encryption"]; label: string }[] = [
  { value: "WPA", label: "WPA" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "None" },
];

function WifiForm({ value, onChange }: FormProps<"wifi">) {
  const set = (patch: Partial<QrData["wifi"]>) => onChange({ ...value, ...patch });
  return (
    <FieldGroup>
      <FieldInput
        label="Network name"
        value={value.ssid}
        onValueChange={(ssid) => set({ ssid })}
        {...plain}
      />
      {value.encryption === "nopass" ? null : (
        <FieldInput
          label="Password"
          value={value.password}
          onValueChange={(password) => set({ password })}
          {...plain}
        />
      )}
      <FieldSelect
        label="Security"
        value={value.encryption}
        options={securityOptions}
        onChange={(encryption) => set({ encryption })}
      />
      <FieldSwitch label="Hidden" checked={value.hidden} onChange={(hidden) => set({ hidden })} />
    </FieldGroup>
  );
}

const extraVcardKeys = [
  "org",
  "title",
  "website",
  "street",
  "city",
  "region",
  "postcode",
  "country",
  "note",
] as const;

function VcardForm({ value, onChange }: FormProps<"vcard">) {
  const [more, setMore] = useState(() => extraVcardKeys.some((key) => value[key]));
  const field = (
    key: keyof QrData["vcard"],
    label: string,
    props: Partial<Omit<React.ComponentProps<"input">, "value">> = {},
  ) => (
    <FieldInput
      label={label}
      value={value[key]}
      onValueChange={(v) => onChange({ ...value, [key]: v })}
      {...props}
    />
  );
  return (
    <div className="grid gap-3">
      <FieldGroup>
        {field("firstName", "First name", { autoComplete: "given-name" })}
        {field("lastName", "Last name", { autoComplete: "family-name" })}
        {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
        {field("email", "Email", { type: "email", autoComplete: "email" })}
      </FieldGroup>
      {more ? (
        <>
          <FieldGroup>
            {field("org", "Company", { autoComplete: "organization" })}
            {field("title", "Job title", { autoComplete: "organization-title" })}
            {field("website", "Website", { ...plain, type: "url", autoComplete: "url" })}
          </FieldGroup>
          <FieldGroup>
            {field("street", "Street", { autoComplete: "street-address" })}
            {field("city", "City", { autoComplete: "address-level2" })}
            {field("region", "State or region", { autoComplete: "address-level1" })}
            {field("postcode", "Postal code", { autoComplete: "postal-code" })}
            {field("country", "Country", { autoComplete: "country-name" })}
          </FieldGroup>
          <FieldGroup>
            <FieldTextarea
              label="Note"
              value={value.note}
              onValueChange={(note) => onChange({ ...value, note })}
            />
          </FieldGroup>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setMore(true)}
          className="flex h-9 w-fit items-center gap-1 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
        >
          More fields
          <DownRegular className="size-4" />
        </button>
      )}
    </div>
  );
}

function EmailForm({ value, onChange }: FormProps<"email">) {
  const set = (patch: Partial<QrData["email"]>) => onChange({ ...value, ...patch });
  return (
    <FieldGroup>
      <FieldInput
        label="To"
        type="email"
        value={value.to}
        onValueChange={(to) => set({ to })}
        autoComplete="email"
      />
      <FieldInput
        label="Subject"
        value={value.subject}
        onValueChange={(subject) => set({ subject })}
      />
      <FieldTextarea label="Message" value={value.body} onValueChange={(body) => set({ body })} />
    </FieldGroup>
  );
}

function SmsForm({ value, onChange }: FormProps<"sms">) {
  const set = (patch: Partial<QrData["sms"]>) => onChange({ ...value, ...patch });
  return (
    <FieldGroup>
      <FieldInput
        label="Phone number"
        type="tel"
        value={value.phone}
        onValueChange={(phone) => set({ phone })}
      />
      <FieldTextarea
        label="Message"
        value={value.message}
        onValueChange={(message) => set({ message })}
      />
    </FieldGroup>
  );
}

function PhoneForm({ value, onChange }: FormProps<"phone">) {
  return (
    <FieldGroup>
      <FieldInput
        label="Phone number"
        type="tel"
        value={value.phone}
        onValueChange={(phone) => onChange({ phone })}
        autoComplete="tel"
      />
    </FieldGroup>
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
    <FieldGroup>
      <FieldInput
        label="Latitude"
        inputMode="decimal"
        value={value.lat}
        onValueChange={(lat) => onChange({ ...value, lat })}
      />
      <FieldInput
        label="Longitude"
        inputMode="decimal"
        value={value.lng}
        onValueChange={(lng) => onChange({ ...value, lng })}
      />
      <FieldButton icon={NavigationRegular} onClick={locate} disabled={locating}>
        {locating ? "Locating…" : "Use my location"}
      </FieldButton>
    </FieldGroup>
  );
}

function toggleAllDay(value: string, allDay: boolean) {
  if (!value) return value;
  return allDay ? value.slice(0, 10) : `${value.slice(0, 10)}T09:00`;
}

function EventForm({ value, onChange }: FormProps<"event">) {
  const set = (patch: Partial<QrData["event"]>) => onChange({ ...value, ...patch });
  const inputType = value.allDay ? "date" : "datetime-local";
  return (
    <div className="grid gap-3">
      <FieldGroup>
        <FieldInput label="Title" value={value.title} onValueChange={(title) => set({ title })} />
        <FieldInput
          label="Location"
          value={value.location}
          onValueChange={(location) => set({ location })}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldSwitch
          label="All day"
          checked={value.allDay}
          onChange={(allDay) =>
            set({
              allDay,
              start: toggleAllDay(value.start, allDay),
              end: toggleAllDay(value.end, allDay),
            })
          }
        />
        <FieldDate
          label="Starts"
          type={inputType}
          value={value.start}
          onValueChange={(start) => set({ start })}
        />
        <FieldDate
          label="Ends"
          type={inputType}
          value={value.end}
          min={value.start}
          onValueChange={(end) => set({ end })}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldTextarea
          label="Description"
          value={value.description}
          onValueChange={(description) => set({ description })}
        />
      </FieldGroup>
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

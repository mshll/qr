import { describe, expect, test } from "vite-plus/test";

import { detectLink, encode } from "./encode";
import { emptyData } from "./types";

describe("detectLink", () => {
  test.each([
    ["bare domain gets https", "mshl.me/qr", "https://mshl.me/qr"],
    ["email becomes mailto", "hi@mshl.me", "mailto:hi@mshl.me"],
    ["formatted phone becomes tel", "+1 (555) 123-4567", "tel:+15551234567"],
    ["plain words stay text", "hello world", "hello world"],
  ])("%s", (_, input, expected) => {
    const { payload } = detectLink(input);

    expect(payload).toBe(expected);
  });
});

describe("encode", () => {
  test("escapes WiFi special characters in SSID and password", () => {
    const wifi = {
      ssid: 'My;Net,"x"',
      password: "a:b\\c",
      encryption: "WPA" as const,
      hidden: true,
    };

    const payload = encode("wifi", wifi);

    expect(payload).toBe('WIFI:T:WPA;S:My\\;Net\\,\\"x\\";P:a\\:b\\\\c;H:true;;');
  });

  test("omits the WiFi password for open networks", () => {
    const wifi = {
      ssid: "Cafe",
      password: "ignored",
      encryption: "nopass" as const,
      hidden: false,
    };

    const payload = encode("wifi", wifi);

    expect(payload).toBe("WIFI:T:nopass;S:Cafe;;");
  });

  test("escapes vCard text with CRLF line breaks", () => {
    const card = { ...emptyData.vcard, firstName: "Ana", lastName: "Smith, Jr.", note: "a\nb; c" };

    const payload = encode("vcard", card);

    expect(payload.split("\r\n")).toEqual([
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Smith\\, Jr.;Ana;;;",
      "FN:Ana Smith\\, Jr.",
      "NOTE:a\\nb\\; c",
      "END:VCARD",
    ]);
  });

  test("writes timed events as floating local times", () => {
    const event = {
      ...emptyData.event,
      title: "Launch",
      start: "2026-10-02T15:30",
      end: "2026-10-02T17:00",
    };

    const payload = encode("event", event);

    expect(payload).toContain("DTSTART:20261002T153000\r\nDTEND:20261002T170000");
  });

  test("makes all-day end dates exclusive across a month boundary", () => {
    const event = {
      ...emptyData.event,
      title: "Trip",
      allDay: true,
      start: "2026-10-30",
      end: "2026-10-31",
    };

    const payload = encode("event", event);

    expect(payload).toContain("DTSTART;VALUE=DATE:20261030\r\nDTEND;VALUE=DATE:20261101");
  });

  test("encodes mailto spaces as %20", () => {
    const email = { to: "a@b.co", subject: "Hi there", body: "" };

    const payload = encode("email", email);

    expect(payload).toBe("mailto:a@b.co?subject=Hi%20there");
  });

  test("returns nothing for out-of-range coordinates", () => {
    const location = { lat: "91", lng: "0" };

    const payload = encode("location", location);

    expect(payload).toBe("");
  });
});

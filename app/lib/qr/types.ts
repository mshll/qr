export type QrType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "sms"
  | "phone"
  | "location"
  | "event";

export interface QrData {
  url: { value: string };
  text: { value: string };
  wifi: { ssid: string; password: string; encryption: "WPA" | "WEP" | "nopass"; hidden: boolean };
  vcard: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    org: string;
    title: string;
    website: string;
    street: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
    note: string;
  };
  email: { to: string; subject: string; body: string };
  sms: { phone: string; message: string };
  phone: { phone: string };
  location: { lat: string; lng: string };
  event: {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    location: string;
    description: string;
  };
}

export const emptyData: QrData = {
  url: { value: "" },
  text: { value: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    org: "",
    title: "",
    website: "",
    street: "",
    city: "",
    region: "",
    postcode: "",
    country: "",
    note: "",
  },
  email: { to: "", subject: "", body: "" },
  sms: { phone: "", message: "" },
  phone: { phone: "" },
  location: { lat: "", lng: "" },
  event: { title: "", start: "", end: "", allDay: false, location: "", description: "" },
};

export const typeLabels: Record<QrType, string> = {
  url: "Link",
  text: "Text",
  wifi: "WiFi",
  vcard: "Contact",
  email: "Email",
  sms: "SMS",
  phone: "Phone",
  location: "Location",
  event: "Event",
};

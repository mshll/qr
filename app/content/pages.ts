import type { QrType } from "~/lib/qr/types";

export interface PageContent {
  path: string;
  type: QrType;
  openLogo?: boolean;
  title: string;
  description: string;
  h1: string;
  lead: string;
  navLabel: string;
  faqs: { q: string; a: string }[];
}

export const pages: PageContent[] = [
  {
    path: "/",
    type: "url",
    title: "Free QR Code Generator · No Sign-Up, No Watermark · QR",
    description:
      "Free QR code generator with no sign-up and no watermark. Create custom QR codes with logos and colors that never expire. Download PNG or SVG in seconds.",
    h1: "Free QR code generator",
    lead: "Make a QR code for a link, WiFi, contact, and more. No account, no watermark, and it never expires.",
    navLabel: "Home",
    faqs: [
      {
        q: "Is this QR code generator really free?",
        a: "Yes. There is no paid plan, no sign-up, no watermark, and no limit on how many QR codes you create or download.",
      },
      {
        q: "Do the QR codes expire?",
        a: "No. These are static QR codes, so the data is stored in the code itself. They work forever and support unlimited scans.",
      },
      {
        q: "Do I need an account?",
        a: "No. Open the page and start making codes. Your recent codes are saved on your device, not in an account.",
      },
      {
        q: "Is my data private?",
        a: "Yes. Codes are generated in your browser and your data never leaves it. The site uses anonymous page-view analytics, but the content of your QR codes is never sent anywhere.",
      },
      {
        q: "Can I add a logo to my QR code?",
        a: "Yes. Upload your own PNG, JPG, or SVG, or pick a built-in icon like Instagram, WhatsApp, or WiFi. Error correction switches to High automatically so the code still scans.",
      },
    ],
  },
  {
    path: "/wifi-qr-code",
    type: "wifi",
    title: "WiFi QR Code Generator · Share Your WiFi Password · QR",
    description:
      "Free WiFi QR code generator. Guests scan to join your network without typing the password. No sign-up, nothing to install, and the code never expires.",
    h1: "WiFi QR code generator",
    lead: "Let guests join your WiFi by scanning a code instead of typing a long password.",
    navLabel: "WiFi",
    faqs: [
      {
        q: "Do iPhones and Android phones support WiFi QR codes?",
        a: "Yes. The built-in camera app on iPhone and most Android phones recognizes WiFi QR codes and offers to join the network.",
      },
      {
        q: "Which security type should I choose?",
        a: "Choose WPA for almost all current routers, including WPA2 and WPA3 networks. Use WEP only for very old equipment, and none for open networks without a password.",
      },
      {
        q: "Does it work with a hidden network?",
        a: "Yes. Turn on the hidden network option so phones know to look for an SSID that is not broadcast.",
      },
      {
        q: "What happens if I change my WiFi password?",
        a: "The old code stops working because the password is stored in the code itself. Create a new code with the new password.",
      },
      {
        q: "Is my WiFi password sent to your server?",
        a: "No. The code is generated in your browser and the password stays on your device. It is also never included in shareable links.",
      },
    ],
  },
  {
    path: "/vcard-qr-code",
    type: "vcard",
    title: "vCard QR Code Generator · Free Contact Card QR Code · QR",
    description:
      "Free vCard QR code generator for business cards. One scan saves your name, phone, email, and company to contacts. No sign-up, and it never expires.",
    h1: "vCard QR code generator",
    lead: "Turn your contact details into a QR code that saves straight to someone's phone contacts.",
    navLabel: "Contact card",
    faqs: [
      {
        q: "What is a vCard QR code?",
        a: "It is a QR code that contains a contact card in the vCard format. Scanning it lets someone add you to their contacts in one step.",
      },
      {
        q: "What contact fields can I include?",
        a: "Name, phone, email, company, title, website, and address. All fields are optional.",
      },
      {
        q: "Do phones need an app to scan a contact QR code?",
        a: "No. The camera app on iPhone and most Android phones recognizes contact QR codes and offers to save the contact.",
      },
      {
        q: "Can I update my details after printing?",
        a: "No. Static codes store the details directly, so a new phone number or job means a new code. In return, the code never expires and does not depend on any service.",
      },
      {
        q: "Why is my contact QR code so dense?",
        a: "More text means more modules in the code. Remove fields you do not need, or print the code larger, to keep it easy to scan.",
      },
    ],
  },
  {
    path: "/qr-code-with-logo",
    type: "url",
    openLogo: true,
    title: "QR Code With Logo Generator · Free, No Watermark · QR",
    description:
      "Free QR code generator with logo. Upload your PNG, JPG, or SVG logo or pick a built-in icon. No sign-up, no watermark, and the code never expires.",
    h1: "QR code with logo",
    lead: "Add your logo or a social icon to the center of a QR code that still scans.",
    navLabel: "With logo",
    faqs: [
      {
        q: "Will a QR code with a logo still scan?",
        a: "Yes, as long as the logo is not too large. Error correction is set to High automatically, and the live scan check warns you if the code stops reading.",
      },
      {
        q: "What logo file types can I upload?",
        a: "PNG, JPG, and SVG. A PNG or SVG with a transparent background usually looks cleanest.",
      },
      {
        q: "Is my uploaded logo sent to a server?",
        a: "No. Your logo is placed into the code in your browser and stays on your device.",
      },
      {
        q: "Which built-in icons are available?",
        a: "Instagram, WhatsApp, X, Facebook, TikTok, YouTube, Snapchat, Telegram, GitHub, Spotify, Apple, and Google Play, plus generic icons for WiFi, mail, phone, link, and map pin.",
      },
      {
        q: "Can I lower the error correction after adding a logo?",
        a: "You can change it, but lower levels leave less room for the covered area. Keep it at High when a logo is present for the most reliable scans.",
      },
    ],
  },
  {
    path: "/text-qr-code",
    type: "text",
    title: "Text QR Code Generator · Convert Text to QR Code · QR",
    description:
      "Free text QR code generator. Convert any plain text, note, or code to a QR code that shows it when scanned. No sign-up, works offline, never expires.",
    h1: "Text QR code generator",
    lead: "Convert plain text into a QR code that shows the message when scanned, no internet needed.",
    navLabel: "Text",
    faqs: [
      {
        q: "What happens when someone scans a text QR code?",
        a: "Their phone shows the text on screen. Most camera apps let them copy it or search for it.",
      },
      {
        q: "Do text QR codes need internet to scan?",
        a: "No. The text is stored in the code, so it can be read offline.",
      },
      {
        q: "How much text can a QR code hold?",
        a: "QR codes can hold a few thousand characters, but long text makes the code dense and hard to scan. Keep it short for codes that will be printed small.",
      },
      {
        q: "Can I use emoji or non-English characters?",
        a: "Text is encoded as UTF-8, which covers most languages. Test the code with your own phone to confirm it displays as expected.",
      },
      {
        q: "Is my text stored anywhere?",
        a: "The code is generated in your browser, so your text stays on your device. Recent codes are saved locally so you can find them later.",
      },
    ],
  },
  {
    path: "/email-qr-code",
    type: "email",
    title: "Email QR Code Generator · Prefilled Mailto QR Code · QR",
    description:
      "Free email QR code generator. Scanning opens a new email with the address, subject, and body already filled in. No sign-up, and the code never expires.",
    h1: "Email QR code generator",
    lead: "Create a QR code that opens a new email with the recipient, subject, and message prefilled.",
    navLabel: "Email",
    faqs: [
      {
        q: "Does scanning the code send an email automatically?",
        a: "No. It opens a draft in the person's mail app. They decide whether to send it.",
      },
      {
        q: "Can I prefill the subject and message?",
        a: "Yes. Add a subject and body and both appear in the new email when the code is scanned.",
      },
      {
        q: "Which mail app opens when someone scans it?",
        a: "Their phone's default mail app, such as Mail on iPhone or Gmail on most Android phones.",
      },
      {
        q: "Can I change the email address later?",
        a: "No. The address is stored in the code itself, so you would create a new code. That is also why it never expires.",
      },
      {
        q: "Does a long message make the code harder to scan?",
        a: "Yes. A long body adds data and makes the code denser. Keep the prefilled message short, or print the code larger.",
      },
    ],
  },
  {
    path: "/sms-qr-code",
    type: "sms",
    title: "SMS QR Code Generator · Free Text Message QR Code · QR",
    description:
      "Free SMS QR code generator. Scanning opens a text message with your number and message ready to send. No sign-up, no account, and it never expires.",
    h1: "SMS QR code generator",
    lead: "Create a QR code that opens a text message with the number and message already filled in.",
    navLabel: "SMS",
    faqs: [
      {
        q: "Does scanning the code send the text automatically?",
        a: "No. It opens the messages app with the number and text filled in. The person taps send themselves.",
      },
      {
        q: "Should I include the country code?",
        a: "Yes, if anyone outside your country might scan it. A number like +1 555 123 4567 works everywhere.",
      },
      {
        q: "Can the person edit the message before sending?",
        a: "Yes. The prefilled message is a draft and can be changed before sending.",
      },
      {
        q: "Does it work on both iPhone and Android?",
        a: "Yes. Both platforms open their messages app from an SMS QR code.",
      },
      {
        q: "Will the SMS QR code ever stop working?",
        a: "Not on its own. The number and message are stored in the code, so it works as long as the number is in service.",
      },
    ],
  },
  {
    path: "/phone-qr-code",
    type: "phone",
    title: "Phone Number QR Code Generator · Free Call QR Code · QR",
    description:
      "Free phone number QR code generator. Scanning offers to call your number, so nobody has to type it. No sign-up, no watermark, and it never expires.",
    h1: "Phone number QR code",
    lead: "Create a QR code that lets people call your number with one scan, no dialing.",
    navLabel: "Phone call",
    faqs: [
      {
        q: "Does scanning the code call the number right away?",
        a: "No. The phone shows the number and asks the person to confirm before calling.",
      },
      {
        q: "Should I include the country code?",
        a: "Yes. The international format with a plus sign works for every caller, wherever they are.",
      },
      {
        q: "Can I use a call QR code on a printed sign?",
        a: "Yes. Download the SVG for print so it stays sharp at large sizes, and test a printed proof from the distance people will scan it.",
      },
      {
        q: "What is the difference between a call QR code and a contact QR code?",
        a: "A call QR code starts a phone call. A contact QR code saves your name, number, and other details to the person's contacts.",
      },
      {
        q: "Does the phone number QR code expire?",
        a: "No. The number is stored in the code, so it works for as long as the number does.",
      },
    ],
  },
  {
    path: "/location-qr-code",
    type: "location",
    title: "Location QR Code Generator · Google Maps and GPS · QR",
    description:
      "Free location QR code generator. Turn GPS coordinates or your current location into a QR code that opens on a map. No sign-up, and it never expires.",
    h1: "Location QR code generator",
    lead: "Turn GPS coordinates or your current location into a QR code that opens on a map.",
    navLabel: "Location",
    faqs: [
      {
        q: "What happens when someone scans a location QR code?",
        a: "Their phone opens the coordinates in a maps app so they can see the spot and get directions.",
      },
      {
        q: "How do I find the coordinates of a place?",
        a: "In Google Maps, press and hold on the spot and the latitude and longitude appear. Copy them into the generator.",
      },
      {
        q: "Can I use my current location?",
        a: "Yes. Tap the current location option and allow location access in your browser. Your location stays on your device and is only used to fill in the coordinates.",
      },
      {
        q: "Why use coordinates instead of an address?",
        a: "Coordinates mark an exact point, which helps for entrances, trailheads, parking areas, and rural spots where addresses are vague.",
      },
      {
        q: "Does a location QR code expire?",
        a: "No. The coordinates are stored in the code, so it keeps working indefinitely.",
      },
    ],
  },
  {
    path: "/event-qr-code",
    type: "event",
    title: "Event QR Code Generator · Add to Calendar QR Code · QR",
    description:
      "Free event QR code generator. Guests scan to add your event's title, time, and location to their calendar. No sign-up, no watermark, and no expiry.",
    h1: "Event QR code generator",
    lead: "Create a QR code that adds your event to a guest's calendar with the time and place filled in.",
    navLabel: "Event",
    faqs: [
      {
        q: "What happens when someone scans an event QR code?",
        a: "Their phone reads the event details and offers to add the event to their calendar.",
      },
      {
        q: "What details can I include?",
        a: "Title, start time, end time, location, and description.",
      },
      {
        q: "Can I change the event time after printing?",
        a: "No. The details are encoded in the code itself, so a new time needs a new code. Check everything before you print.",
      },
      {
        q: "Does it work with Google Calendar and Apple Calendar?",
        a: "The code uses the standard calendar event format. Support depends on the phone's scanner, so test it on the devices your guests are likely to use.",
      },
      {
        q: "Is the event QR code free to use for a public event?",
        a: "Yes. There is no fee, no watermark, and no limit on scans, whatever the size of your event.",
      },
    ],
  },
  {
    path: "/svg-qr-code",
    type: "url",
    title: "SVG QR Code Generator · Vector QR Codes for Print · QR",
    description:
      "Free SVG QR code generator. Download vector QR codes for print that scale to any size, or high resolution 1024px PNGs. No sign-up, never expires.",
    h1: "SVG QR code generator",
    lead: "Download QR codes as vector SVG files that stay sharp at any print size.",
    navLabel: "SVG for print",
    faqs: [
      {
        q: "Is the SVG download free?",
        a: "Yes. SVG and PNG downloads are free, with no sign-up and no watermark.",
      },
      {
        q: "What resolution is the PNG?",
        a: "The PNG is 1024px, which is high resolution for screens and most everyday uses. For large prints, use the SVG.",
      },
      {
        q: "Can I edit the SVG in Illustrator or Figma?",
        a: "Yes. The SVG opens in vector design tools, where you can scale it and place it in your layout.",
      },
      {
        q: "How large should I print my QR code?",
        a: "At least about 2 cm (0.8 in) wide for scanning up close. For signs, a common rule of thumb is 1 cm of code width for every 10 cm of scanning distance.",
      },
      {
        q: "Why does my printed QR code not scan?",
        a: "The usual causes are low contrast, inverted colors, a missing margin, or printing too small. The live scan check catches color problems, but always test a printed proof too.",
      },
    ],
  },
];

export const pageByPath = new Map(pages.map((p) => [p.path, p]));

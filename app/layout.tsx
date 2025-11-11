import "./globals.css";
import "modern-normalize";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata = {
  title: "NoteHub",
  description: "Simple note management app",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode; //
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <TanStackProvider>
          <Header />
          <main>{children}</main>

          {modal}

          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}

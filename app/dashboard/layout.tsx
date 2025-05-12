import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord | Stage+",
  description: "Tableau de bord de gestion des stagiaires",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
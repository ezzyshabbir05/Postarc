import { redirect } from "next/navigation"

export default function DnsRedirect() {
  redirect("/admin/domains")
}

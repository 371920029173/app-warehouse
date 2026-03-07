import { redirect } from "next/navigation";
import { verifyTunnelGateToken } from "@/lib/tunnel-gate";
import { GateRedirect } from "./GateRedirect";

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export default async function TunnelGoPage({ searchParams }: Props) {
  const { t } = await searchParams;
  if (!t) {
    return (
      <div className="layout-shell max-w-md text-center text-sm text-accent-silver">
        <p>缺少跳转参数，请从隧道页重新打开。</p>
        <a href="/tunnel" className="mt-4 inline-block text-accent-gold hover:underline">
          返回隧道
        </a>
      </div>
    );
  }

  const payload = await verifyTunnelGateToken(t);
  if (!payload) {
    return (
      <div className="layout-shell max-w-md text-center text-sm text-accent-silver">
        <p>链接无效或已过期，请重新在隧道页发起访问。</p>
        <a href="/tunnel" className="mt-4 inline-block text-accent-gold hover:underline">
          返回隧道
        </a>
      </div>
    );
  }

  return <GateRedirect url={payload.url} />;
}

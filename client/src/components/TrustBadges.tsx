import { Award, Shield } from "lucide-react";

interface TrustBadgesProps {
  className?: string;
}

export default function TrustBadges({ className = "" }: TrustBadgesProps) {
  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      {/* Badge 1: Top 1% DFW Real Estate Agents */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f]/10 border border-[#1e3a5f]/20">
        <Award className="h-5 w-5 text-[#d4af37]" />
        <span className="text-sm font-semibold text-[#1e3a5f] dark:text-[#d4af37]">
          Top 1% DFW Real Estate Agents
        </span>
      </div>
      
      {/* Badge 2: Licensed & Insured Texas Realtors */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f]/10 border border-[#1e3a5f]/20">
        <Shield className="h-5 w-5 text-[#d4af37]" />
        <span className="text-sm font-semibold text-[#1e3a5f] dark:text-[#d4af37]">
          Licensed & Insured Texas Realtors
        </span>
      </div>
    </div>
  );
}

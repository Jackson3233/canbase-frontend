"use client";

import { ReactNode } from "react";
import { SubTabs, SubTabsList, SubTabsTrigger, SubTabsContent, SubTabsSeparator } from "@/components/ui/subtab";

export interface SubTabItem {
  icon: ReactNode;
  label: string;
  value: string;
}

interface SubTabsLayoutProps {
  items: SubTabItem[];
  defaultValue: string;
  children: ReactNode;
}

export const SubTabsLayout = ({ items, defaultValue, children }: SubTabsLayoutProps) => {
  return (
    <div className="w-full border-b border-gray-200">
      <SubTabs defaultValue={defaultValue}>
        <SubTabsList>
          {items.map((item, index) => (
            <>
              {index > 0 && <SubTabsSeparator />}
              <SubTabsTrigger
                key={item.value}
                value={item.value}
                className="data-[state=active]:bg-white"
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
              </SubTabsTrigger>
            </>
          ))}
        </SubTabsList>
        {children}
      </SubTabs>
    </div>
  );
};

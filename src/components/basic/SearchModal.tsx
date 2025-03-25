import React, { useEffect, useState } from "react";
import { ArrowRight, QrCode } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import navigationItems from "@/constant/navigationItems";
import { useAppSelector } from "@/store/hook";
import { axiosPrivateInstance } from "@/lib/axios";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const { club } = useAppSelector((state) => state.club);
  const router = useRouter();
  const [filteredItems, setFilteredItems] = useState<[string, string][] | null>(
    null
  );
  const [combinedItems, setCombinedItems] = useState<{
    [key: string]: string;
  } | null>(null);

  useEffect(() => {
    setCombinedItems(navigationItems);
  }, []);

  useEffect(() => {
    setFilteredItems(
      combinedItems
        ? Object.entries(combinedItems).filter(([title]) =>
            title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : []
    );
  }, [searchQuery, combinedItems]);

  const addItemsToNav = (
    items: any[],
    additionalNavItems: { [key: string]: string },
    route: string
  ) => {
    items.forEach((item) => {
      additionalNavItems[item] = route;
    });
  };

  useEffect(() => {
    const getSearchData = async () => {
      if (!isOpen) {
        setIsChecked(false);
        return;
      }
      if (!club) return;
      try {
        const { data } = await axiosPrivateInstance.post(
          "/search/getSearchData",
          {
            clubID: club.clubID,
          }
        );

        const additionalNavItems: { [key: string]: string } = {};

        const navMappings = {
          email: "/club/member",
          userName: "/club/member",
          memberId: "/club/member",
          strain: "/club/grow",
          zone: "/club/grow?tab=zone",
          charge: "/club/grow?tab=charge",
          plant: "/club/grow?tab=plant",
          inventory: "/club/inventory",
        };

        Object.entries(navMappings).forEach(([key, route]) => {
          addItemsToNav(data[key], additionalNavItems, route);
        });
        const combinedItems = { ...navigationItems, ...additionalNavItems };
        setCombinedItems(combinedItems);

        setIsChecked(true);
      } catch (error) {
        console.error(error);
      }
    };

    getSearchData();
  }, [isOpen, club]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleItemClick = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className=" p-0 w-[400px] rounded-md overflow-hidden shadow-lg [&>button]:hidden"
        style={{ background: "white" }}
      >
        <div className="flex items-center border-b border-gray-200 p-2">
          <input
            type="text"
            placeholder="Suche"
            className="flex-1 px-4 py-2 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <QrCode className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="max-h-[400px] min-h-[300px] overflow-y-auto p-2">
          {isChecked &&
            searchQuery.length > 0 &&
            filteredItems?.map(([title, path], index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => handleItemClick(path)}
              >
                <ArrowRight className="w-5 h-5 mt-1 text-gray-400" />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{title}</h3>
                  <p className="text-sm text-gray-500">{path}</p>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;

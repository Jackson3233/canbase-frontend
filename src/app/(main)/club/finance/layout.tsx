"use client";

import { Suspense, useEffect } from "react";
import { ArrowUpDown, Settings2, Ticket } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { bankActions } from "@/store/reducers/bankReducer";
import { transactionsActions } from "@/store/reducers/transactionsReducer";
import {
  SubTabs,
  SubTabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/subtab";
import { getFinance } from "@/actions/transaction";
import { FinanceLayoutPropsInterface } from "@/types/page";

const FinanceLayout = ({
  book,
  transaction,
  setting,
}: FinanceLayoutPropsInterface) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      const result = await getFinance();

      if (result.success) {
        dispatch(
          transactionsActions.setTransactions({
            transactions: result.transactions.transactions,
            currentMonthTotalPositive:
              result.transactions.currentMonthTotalPositive,
            currentMonthTotalNegative:
              result.transactions.currentMonthTotalNegative,
            previousMonthTotalPositive:
              result.transactions.previousMonthTotalPositive,
            previousMonthTotalNegative:
              result.transactions.previousMonthTotalNegative,
          })
        );
        dispatch(bankActions.setBank({ bank: result.bank }));
      }
    })();
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <SubTabs
        defaultValue={
          user?.role === "owner" ||
          user?.functions?.includes("club-finance-book_read") ||
          user?.functions?.includes("club-finance-book_manange")
            ? "book"
            : user?.functions?.includes("club-finance-transactions-read") ||
              user?.functions?.includes("club-finance-transactions-manange")
            ? "transaction"
            : "setting"
        }
      >
        <div className="w-full border-b border-gray-100 px-4">
          <SubTabsList>
            {(user?.role === "owner" ||
              user?.functions?.includes("club-finance-book_read") ||
              user?.functions?.includes("club-finance-book_manange")) && (
              <SubTabsTrigger value="book">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-3.5 h-3.5" />
                  <p className="text-sm">Buchung</p>
                </div>
              </SubTabsTrigger>
            )}
            {(user?.role === "owner" ||
              user?.functions?.includes("club-finance-transactions-read") ||
              user?.functions?.includes(
                "club-finance-transactions-manange"
              )) && (
              <SubTabsTrigger value="transaction">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <p className="text-sm">Kontobewegungen</p>
                </div>
              </SubTabsTrigger>
            )}
            {(user?.role === "owner" ||
              user?.functions?.includes("club-finance-setting-read") ||
              user?.functions?.includes("club-finance-setting-manange")) && (
              <SubTabsTrigger value="setting">
                <div className="flex items-center space-x-2">
                  <Settings2 className="w-3.5 h-3.5" />
                  <p className="text-sm">Einstellungen</p>
                </div>
              </SubTabsTrigger>
            )}
          </SubTabsList>
        </div>
        <div className="flex-1 flex flex-col px-5 pt-1 tablet:pt-0.5 mobile:pt-0.5">
          <SubTabsContent value="book">{book}</SubTabsContent>
          <SubTabsContent value="transaction">{transaction}</SubTabsContent>
          <SubTabsContent value="setting">{setting}</SubTabsContent>
        </div>
      </SubTabs>
    </Suspense>
  );
};

export default FinanceLayout;

import { useEffect, useRef, useState } from "react";
import PerformRequest from "../utilities/PerformRequest.js";
import moment from "moment-timezone"
export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  useEffect(() => {
    const fecthTransaction = async () => {
      try {
        const response = await OriginalRequest(
          "transaction/getTransactionHistory",
          "GET"
        );
        if (response.data) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (hasMounted.current) {
      fecthTransaction();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);
  return (
    <div className="mt-7">
      {/* <h4 className="text-2xl text-lightText dark:text-darkText font-semibold">
        Transactions
      </h4> */}
      {transactions.length === 0 ? (
        <div className="w-full h-40 flex items-center justify-center">
          <h4 className="text-center">No Transaction have been made</h4>
        </div>
      ) : (
        <table className="w-full text-lightText dark:text-darkText">
          <thead className="font-semibold">
            <tr className="border-b border-neutral-300">
              <td className="w-1/12 text-center">Transaction Type</td>
              <td className="w-2/12 pl-1">To</td>
              <td className="w-3/12 text-center">Amount</td>
              <td className="w-3/12 text-center">Date</td>
            </tr>
          </thead>
          <tbody className="text-lightTextSecondary dark:text-darkTextSecondary">
            {transactions.map((transaction, index) => (
              <tr
                className={`border-b border-neutral-300 hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group`}
                key={transaction._id}
              >
                <td className="w-1/12 text-center">
                  {transaction.transactionType}
                </td>
                <td className="w-3/12">{transaction.seller.artist_name}</td>
                <td className="w-3/12 text-center">
                  <span>
                    {Intl.NumberFormat("de-DE").format(transaction.amount)}
                  </span>{" "}
                  <span>đ</span>
                </td>
                <td className="w-3/12 text-center">{moment(transaction.createdAt).format("MM/DD/yyyy, hh:mm:ss a z")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

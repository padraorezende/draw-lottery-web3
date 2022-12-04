import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from "@heroicons/react/24/solid"
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { currency } from "../../constants"



function AdminControls() {

    const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTERRY_CONTRACT_ADDRESS)
    const { data: totalComission } = useContractRead(contract, "operatorTotalCommission")
    const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll")
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw")
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission")


    const onDrawWinner = async () => {
        const notification = toast.loading("Picking a Lucky Winner...");

        try {
            const data = await DrawWinnerTicket([{}])
            toast.success("A Winner has been selected!", {
                id: notification
            })
            console.info("contract call successs", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const onWithdrawCommission = async () => {
        const notification = toast.loading("Withdraw commission...");

        try {
            const data = await WithdrawCommission([{}])
            toast.success("Your Comission has been withdraw successfully!", {
                id: notification
            })
            console.info("contract call successs", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const onRestartDraw = async () => {
        const notification = toast.loading("Restarting draw...");

        try {
            const data = await restartDraw([{}])
            toast.success("Draw restarted successfully", {
                id: notification
            })
            console.info("contract call successs", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const onRefundAll = async () => {
        const notification = toast.loading("Refunding all...");

        try {
            const data = await RefundAll([{}])
            toast.success("All refunded successfully!", {
                id: notification
            })
            console.info("contract call successs", data);
        } catch (err) {
            toast.error("Whoops something went wrong!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    return (
        <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20
        border">
            <h2 className="font-bold">Admin Controls</h2>
            <p className="mb-5">Total Commission to be withdraw:{" "}
                {totalComission && ethers.utils.formatEther(totalComission.toString())}{" "}{currency}</p>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0
            md:space-x-2">
                <button onClick={onDrawWinner} className="admin-button">
                    <StarIcon className="h-6 mx-auto mb-2" />
                    Draw Winner
                </button>
                <button onClick={onWithdrawCommission} className="admin-button">
                    <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
                    Withdraw Commission
                </button>
                <button onClick={onRestartDraw} className="admin-button">
                    <ArrowPathIcon className="h-6 mx-auto mb-2" />
                    Restart Draw
                </button>
                <button onClick={onRefundAll} className="admin-button">
                    <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
                    Refund All
                </button>
            </div>


        </div>
    )
}

export default AdminControls
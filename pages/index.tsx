import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from "ethers"
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import toast from 'react-hot-toast'
import { currency } from '../constants'
import AdminControls from './components/AdiminControls'
import CountdownTimer from './components/CountdownTimer'
import Header from './components/Header'
import Loading from './components/Loading'
import Login from './components/Login'

const Home: NextPage = () => {

  const address = useAddress()
  const [quantity, setQuantity] = useState(1)
  const [userTickets, setUserTickets] = useState(0)
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTERRY_CONTRACT_ADDRESS)
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets")
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward")
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice")
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission")
  const { data: expiration } = useContractRead(contract, "expiration")

  const { data: tickets } = useContractRead(contract, "getTickets")
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", address)
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")
  const { data: lastWinner } = useContractRead(contract, "lastWinner")
  const { data: isLotteryOperator } = useContractRead(contract, "lotteryOperator")
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings")

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try {
      const data = await BuyTickets([{
        value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString())
      }])

      toast.success("Tickets purchased successfuly!", {
        id: notification
      })

    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification
      })
    }
  }

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...");

    try {
      const data = await WithdrawWinnings([{}])

      toast.success("Winnings withdrawn successfully!", {
        id: notification
      })
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification
      })
    }
  }

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0)
    setUserTickets(noOfUserTickets)

  }, [tickets, address])


  if (!address) return <Login />

  if (isLoading) return <Loading />



  return (
    <>
      <div className="bg-[#091B18] min-h-screen flex flex-col">
        <Head>
          <title>Lottery WEB3 Dapp</title>
        </Head>

        <div className='flex-1'>
          <Header />

          {lastWinnerAmount != 0 && (
            <Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100}>
              <div className='flex space-x-2 mx-10'>
                <h4 className='text-white font-bold'>Last Winner:
                  {lastWinner?.toString().substring(0, 5)}...{lastWinner?.toString().substring(lastWinner?.toString().length, lastWinner?.toString().length - 5)} </h4>
                <h4 className='text-white font-bold'>Previous winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</h4>
              </div>
            </Marquee>
          )}

          {isLotteryOperator === address && (
            <div className='flex justify-center'>
              <AdminControls />
            </div>
          )}


          {winnings > 0 && (
            <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
              <button onClick={onWithdrawWinnings} className='p-5 bg-gradient-to-b  from-emerald-600 to-emerald-600 text-white
          animate-pulse text-center rounded-xl w-full'>
                <p className='font-bold'>Winner Winner Chickern Dinner!</p>
                <p>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}{currency}</p>
                <br />
                <p className='font-semibold'>Click here to withdraw</p>
              </button>
            </div>
          )}



          <div className='space-y-5 md:space-y-0 m-5 md:flex md:flew-row items-start justify-center md:space-x-5'>
            <div className='stats-container'>
              <h1 className='text-5xl text-white font-semibold text-center'> The Next Draw</h1>
              <div className='flex justify-between p-2 space-x-2'>
                <div className='stats'>
                  <h2 className='text-sm'>Total Pool</h2>
                  <p className='text-xl'>
                    {currentWinningReward &&
                      ethers.utils.formatEther(currentWinningReward?.toString())}
                    {" "}{currency}</p>
                </div>
                <div className='stats'>
                  <h2 className='text-sm'>Tickets Remaining</h2>
                  <p className='text-xl'>{remainingTickets?.toNumber()}</p>
                </div>
              </div>

              <div className='mt-5 mb-3'>
                <CountdownTimer />
              </div>
            </div>

            <div className='stats-container space-y-2'>
              <div className='stats-container'>
                <div className='flex justify-between items-center text-white pb-2'>
                  <h2>Price per ticket</h2>
                  <p>{ticketPrice && ethers.utils.formatEther(ticketPrice?.toString())}{" "}{currency}</p>
                </div>

                <div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4'>
                  <p>TICKET</p>
                  <input type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className='flex w-full bg-transparent text-right outline-none'
                    min={1}
                    max={100}
                  />
                </div>

                <div className='space-y-2 mt-5'>
                  <div className='flex items-center justify-between text-emerald-300 text-xs italic font-extrabold'>
                    <p>Total cost of Tickets</p>
                    <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice?.toString())) * quantity}{" "}{currency}</p>
                  </div>

                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>Service fees</p>
                    <p>{ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())}{" "}{currency}</p>
                  </div>

                  <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                    <p>+ Network Fees</p>
                    <p>TBC</p>
                  </div>
                </div>

                <button disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber === 0}
                  onClick={handleClick}
                  className='mt-5 w-full bg-gradient-to-br
            from-emerald-600 to-emerald-600 px-10 py-5 rounded-md font-semibold
            text-white shadow-xl disabled:from-gray-600
            disabled:text-gray-100 disabled:to-gray-600
            disabled:cursor-not-allowed'>
                  Buy {quantity} tickets for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}{" "}{currency}
                </button>
              </div>

              {userTickets > 0 && (
                <div className='stats'>
                  <p className='text-lg mb-2'>You have {userTickets} Tickes in this draw</p>
                  <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                    {Array(userTickets).fill("").map((_, index) => (
                      <p key={index} className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0
                items-center justify-center text-xs italic">{index + 1}</p>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <footer className='border-t border-emerald-500/20 flex items-center
        text-white justify-between p-5'>
          <img className='h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full'
            src="https://i.imgur.com/4h7mAu7.png" alt="" />

          <p className='text-xs text-emerald-900 pl-5 text-justify'>
            DISCLAMER: This video is made for informational and educational purposes only.
            The content of this tutorial is not intended to be a lure to gambling. Instead,
            the informatio presented is meant for nothing more than learning and entertainment
            purposes. We are not liable for any losses that are incurred or problems that arise
            at online casions or elsewhere after the reading and consideration of this tutorials content.
            If you are gambling online utilizing information from this tutorial, you are doing so completety
            and your own risk.
          </p>
        </footer>
      </div>
    </>
  )
}

export default Home

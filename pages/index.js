import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'

const style = {
    wrapper: ``,
    walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
    button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
    details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
        </>
    )
}
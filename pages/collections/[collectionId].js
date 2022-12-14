import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from "../../components/NFTCard"

import { useNFTCollection } from "@thirdweb-dev/react";
import { useMarketplace } from '@thirdweb-dev/react'

const style = {
    bannerImageContainer: `h-[50vh] w-screen overflow-hidden flex justify-center items-center`,
    bannerImage: `w-full object-cover`,
    infoContainer: `w-screen px-4`,
    midRow: `w-full flex justify-center text-white`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem]`,
    socialIconsWrapper: `w-44`,
    socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
    socialIcon: `my-2`,
    divider: `border-r-2`,
    title: `text-5xl font-bold mb-4`,
    createdBy: `text-lg mb-4`,
    statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
    collectionStat: `w-1/4`,
    statValue: `text-3xl font-bold w-full flex items-center justify-center`,
    ethLogo: `h-6 mr-2`,
    statName: `text-lg w-full text-center mt-1`,
    description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collection = () => {

    // sdk v1
    // const { provider } = useWeb3()
    // sdk v2
    // const rpcUrl = "https://rinkeby.infura.io/v3/dc57cdded7334a599cf26e3c2dda97a5";
    // const sdk = new ThirdwebSDK(rpcUrl);
    // const contract = sdk.getNFTCollection("0xfBFb463C184b93C2d8659fe0311599001217FE68");

    const router = useRouter()
    const { collectionId } = router.query

    const [collection, setCollection] = useState({})
    const [nfts, setNfts] = useState([])
    const [listings, setListings] = useState([])

    // get an instance of your own collection contract
    const nftCollection = useNFTCollection(collectionId);

    useEffect(() => {
        if (nftCollection) {
            // call functions on your contract
            nftCollection
                .getAll()
                .then((nfts) => {
                    setNfts(nfts);
                    console.log("nfts: ", nfts)
                })
                .catch((error) => {
                    console.error("failed to fetch nfts", error);
                });
        }
    }, [nftCollection]);

    // Initialize marketplace contract by passing in the contract address
    const marketplaceAddress = "0x5DC7d152281e7F08585898CdB088E1144a938cA3";
    const marketPlaceModule = useMarketplace(marketplaceAddress);

    useEffect(() => {
        if (!marketPlaceModule) return
            ; (async () => {
                const listings = await marketPlaceModule.getAll()
                setListings(listings)
            })()
    }, [marketPlaceModule])


    // fetch data from sanity
    const fetchCollectionData = async (
        sanityClient = client
    ) => {
        const query = `*[_type == "marketItems" && contractAddress == "${collectionId}"]{
            "imageUrl": profileImage.asset->url, 
            "bannerImageUrl": bannerImage.asset->url, 
            volumeTraded, createdBy, contractAddress,
            "creator": createdBy->userName,
            title, floorPrice, "allOwners": owners[]->, 
            description
          }`

        const collectionData = await sanityClient.fetch(query)

        console.log(collectionData, '✨')

        // the query returns 1 object inside of an array
        await setCollection(collectionData[0])
    }

    // whenever collection id gets updated -> when user routes to collection page
    useEffect(() => {
        fetchCollectionData()

    }, [collectionId])    

    console.log(router.query)
    console.log(router.query.collectionId)

    return (
        <div className="overflow-hidden">
            <Header />
            <div className={style.bannerImageContainer}>
                <img
                    className={style.bannerImage}
                    src={
                        collection?.bannerImageUrl
                            ? collection.bannerImageUrl
                            : 'https://via.placeholder.com/200'
                    }
                    alt="banner"
                />
            </div>
            <div className={style.infoContainer}>
                <div className={style.midRow}>
                    <img
                        className={style.profileImg}
                        src={
                            collection?.imageUrl
                                ? collection.imageUrl
                                : 'https://via.placeholder.com/200'
                        }
                        alt="profile image"
                    />
                </div>
            </div>

            <div className={style.endRow}>
                <div className={style.socialIconsContainer}>
                    <div className={style.socialIconsWrapper}>
                        <div className={style.socialIcon}>
                            <CgWebsite />
                        </div>
                        <div className={style.divider}>
                            <div className={style.socialIcon}>
                                <AiOutlineInstagram />
                            </div>
                        </div>
                        <div className={style.divider}>
                            <div className={style.socialIcon}>
                                <AiOutlineTwitter />
                            </div>
                        </div>
                        <div className={style.divider}>
                            <div className={style.socialIcon}>
                                <HiDotsVertical />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.midRow}>
                <div className={style.title}>{collection?.title}</div>
            </div>

            <div className={style.midRow}>
                <div className={style.createdBy}>
                    Created by{' '}
                    <span className="text-[#2081e2]">{collection?.creator}</span>
                </div>
            </div>

            <div className={style.midRow}>
                <div className={style.statsContainer}>
                    <div className={style.collectionStat}>
                        <div className={style.statValue}>{nfts.length}</div>
                        <div className={style.statName}>items</div>
                    </div>

                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            {collection?.allOwners ? collection.allOwners.length : ''}
                        </div>
                        <div className={style.statName}>owners</div>
                    </div>

                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            <img
                                className={style.ethLogo}
                                src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                                alt="eth"
                            />
                            {collection?.floorPrice}
                        </div>
                        <div className={style.statName}>floor price</div>
                    </div>
                    <div className={style.collectionStat}>
                        <div className={style.statValue}>
                            <img
                                className={style.ethLogo}
                                src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                                alt="eth"
                            />
                            {collection?.volumeTraded}.7K
                        </div>
                        <div className={style.statName}>volume traded</div>
                    </div>
                </div>
            </div>

            <div className={style.midRow}>
                <div className={style.description}>{collection?.description}</div>
            </div>
            <div className="flex flex-wrap ">
                {
                    nfts.map((nftItem, id) => (
                        <NFTCard
                            key={id}
                            nftItem={nftItem}
                            title={collection?.title}
                            listings={listings}
                        />
                    ))
                }
            </div>
        </div>

    )
}

export default Collection